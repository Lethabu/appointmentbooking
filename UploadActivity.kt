
package com.example.yourapp

import android.content.Context
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import androidx.work.Data
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager

class UploadActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_upload)

        val uploadButton: Button = findViewById(R.id.uploadButton)

        uploadButton.setOnClickListener {
            val filePath = "/home/user/appointmentbooking/tiktok_products.csv"
            val workManager = WorkManager.getInstance(this)

            val data = Data.Builder()
                .putString(UploadWorker.KEY_FILE_PATH, filePath)
                .build()

            val uploadWorkRequest = OneTimeWorkRequestBuilder<UploadWorker>()
                .setInputData(data)
                .build()

            workManager.enqueue(uploadWorkRequest)
        }
    }
}
