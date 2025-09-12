
package com.example.yourapp

import android.content.Context
import android.net.Uri
import android.util.Log
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.google.firebase.storage.FirebaseStorage
import kotlinx.coroutines.tasks.await
import java.io.File

class UploadWorker(appContext: Context, workerParams: WorkerParameters) :
    CoroutineWorker(appContext, workerParams) {

    override suspend fun doWork(): Result {
        val filePath = inputData.getString(KEY_FILE_PATH) ?: return Result.failure()
        val fileUri = Uri.fromFile(File(filePath))

        val storage = FirebaseStorage.getInstance()
        val storageRef = storage.reference
        val productsRef = storageRef.child("products/${fileUri.lastPathSegment}")

        // Check for existing upload tasks and resume if one exists
        val uploadTask = productsRef.activeUploadTasks.firstOrNull() ?: productsRef.putFile(fileUri)

        return try {
            uploadTask.await()
            Log.d("UploadWorker", "Upload successful")
            Result.success()
        } catch (e: Exception) {
            Log.e("UploadWorker", "Upload failed", e)
            Result.failure()
        }
    }

    companion object {
        const val KEY_FILE_PATH = "FILE_PATH"
    }
}
