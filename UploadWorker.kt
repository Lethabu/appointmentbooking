
package com.example.yourapp

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.net.Uri
import android.os.Build
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.work.CoroutineWorker
import androidx.work.ForegroundInfo
import androidx.work.WorkerParameters
import androidx.work.workDataOf
import com.google.firebase.storage.FirebaseStorage
import com.google.firebase.storage.StorageMetadata
import kotlinx.coroutines.tasks.await
import java.io.File

class UploadWorker(private val appContext: Context, workerParams: WorkerParameters) :
    CoroutineWorker(appContext, workerParams) {

    private val sharedPreferences =
        appContext.getSharedPreferences("UploadWorkerPrefs", Context.MODE_PRIVATE)

    private val notificationManager =
        appContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

    override suspend fun doWork(): Result {
        val filePath = inputData.getString(KEY_FILE_PATH)

        if (filePath.isNullOrEmpty()) {
            Log.e(TAG, "File path is null or empty.")
            return Result.failure()
        }

        val file = File(filePath)
        if (!file.exists()) {
            Log.e(TAG, "File does not exist at path: $filePath")
            return Result.failure()
        }

        val fileUri = Uri.fromFile(file)
        val fileName = file.name

        setForeground(createForegroundInfo(fileName))

        val storage = FirebaseStorage.getInstance()
        val storageRef = storage.reference
        val productsRef = storageRef.child("products/$fileName")

        val sessionUriString = sharedPreferences.getString(getSessionKey(file), null)
        val sessionUri = sessionUriString?.let { Uri.parse(it) }

        val uploadTask = if (sessionUri != null) {
            Log.d(TAG, "Resuming upload from: $sessionUri")
            // Correctly resume by passing the session URI to putFile
            productsRef.putFile(fileUri, StorageMetadata.Builder().build(), sessionUri)
        } else {
            Log.d(TAG, "Starting a new upload for: $fileName")
            // Start a new upload
            productsRef.putFile(fileUri)
        }

        uploadTask.addOnProgressListener { taskSnapshot ->
            val progress = (100.0 * taskSnapshot.bytesTransferred / taskSnapshot.totalByteCount).toInt()

            val progressData = workDataOf(KEY_PROGRESS to progress)
            setProgressAsync(progressData)

            val newSessionUri = taskSnapshot.uploadSessionUri
            if (newSessionUri != null && newSessionUri.toString() != sessionUriString) {
                sharedPreferences.edit()
                    .putString(getSessionKey(file), newSessionUri.toString())
                    .apply()
            }

            val notification = createNotification(fileName, progress)
            notificationManager.notify(NOTIFICATION_ID, notification)
        }

        return try {
            uploadTask.await()
            Log.d(TAG, "Upload successful for: $fileName")

            sharedPreferences.edit().remove(getSessionKey(file)).apply()
            val notification = createCompletionNotification(fileName)
            notificationManager.notify(NOTIFICATION_ID, notification)

            Result.success()
        } catch (e: Exception) {
            Log.e(TAG, "Upload failed for: $fileName", e)
            Result.failure()
        }
    }

    private fun getSessionKey(file: File): String {
        return "$KEY_SESSION_URI:${file.path}"
    }

    private fun createForegroundInfo(fileName: String): ForegroundInfo {
        val notification = createNotification(fileName, 0)
        return ForegroundInfo(NOTIFICATION_ID, notification)
    }

    private fun createNotification(fileName: String, progress: Int): Notification {
        createNotificationChannel()

        val title = "Uploading $fileName"

        return NotificationCompat.Builder(appContext, CHANNEL_ID)
            .setContentTitle(title)
            .setTicker(title)
            .setContentText("$progress%")
            .setSmallIcon(R.drawable.ic_upload)
            .setOngoing(true)
            .setProgress(100, progress, false)
            .build()
    }

    private fun createCompletionNotification(fileName: String): Notification {
        createNotificationChannel()

        return NotificationCompat.Builder(appContext, CHANNEL_ID)
            .setContentTitle("Upload Complete")
            .setContentText("$fileName has been successfully uploaded.")
            .setSmallIcon(R.drawable.ic_upload_done)
            .setAutoCancel(true)
            .build()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "File Uploads",
                NotificationManager.IMPORTANCE_LOW
            )
            notificationManager.createNotificationChannel(channel)
        }
    }

    companion object {
        private const val TAG = "UploadWorker"
        const val KEY_FILE_PATH = "KEY_FILE_PATH"
        const val KEY_SESSION_URI = "KEY_SESSION_URI"
        const val KEY_PROGRESS = "KEY_PROGRESS"
        private const val CHANNEL_ID = "UploadWorkerChannel"
        private const val NOTIFICATION_ID = 1
    }
}
