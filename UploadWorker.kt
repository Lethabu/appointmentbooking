
package com.example.yourapp

import android.content.Context
import android.net.Uri
import android.util.Log
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.google.firebase.storage.FirebaseStorage
import com.google.firebase.storage.StorageMetadata
import kotlinx.coroutines.tasks.await
import java.io.File

class UploadWorker(appContext: Context, workerParams: WorkerParameters) :
    CoroutineWorker(appContext, workerParams) {

    private val sharedPreferences =
        appContext.getSharedPreferences("UploadWorkerPrefs", Context.MODE_PRIVATE)

    override suspend fun doWork(): Result {
        val filePath = inputData.getString(KEY_FILE_PATH) ?: return Result.failure()
        val fileUri = Uri.fromFile(File(filePath))

        val storage = FirebaseStorage.getInstance()
        val storageRef = storage.reference
        val productsRef = storageRef.child("products/${fileUri.lastPathSegment}")

        val sessionUriString = sharedPreferences.getString(KEY_SESSION_URI, null)
        val sessionUri = sessionUriString?.let { Uri.parse(it) }

        val uploadTask = if (sessionUri != null) {
            // Resume upload
            Log.d("UploadWorker", "Resuming upload from: $sessionUri")
            productsRef.putFile(fileUri, StorageMetadata.Builder().build(), sessionUri)
        } else {
            // Start a new upload
            Log.d("UploadWorker", "Starting a new upload")
            productsRef.putFile(fileUri)
        }

        uploadTask.addOnProgressListener { taskSnapshot ->
            val newSessionUri = taskSnapshot.uploadSessionUri
            if (newSessionUri != null) {
                sharedPreferences.edit()
                    .putString(KEY_SESSION_URI, newSessionUri.toString())
                    .apply()
            }
        }

        return try {
            uploadTask.await()
            Log.d("UploadWorker", "Upload successful")
            // Clear the session URI on successful upload
            sharedPreferences.edit().remove(KEY_SESSION_URI).apply()
            Result.success()
        } catch (e: Exception) {
            Log.e("UploadWorker", "Upload failed", e)
            Result.failure()
        }
    }

    companion object {
        const val KEY_FILE_PATH = "FILE_PATH"
        const val KEY_SESSION_URI = "SESSION_URI"
    }
}
