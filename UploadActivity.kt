
package com.example.yourapp

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.lifecycle.Observer
import androidx.work.Data
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkInfo
import androidx.work.WorkManager
import java.util.UUID

class UploadActivity : AppCompatActivity() {

    private lateinit var workManager: WorkManager
    private var uploadWorkId: UUID? = null
    private lateinit var statusTextView: TextView

    // Register the permissions callback, which handles the user's response to the
    // system permissions dialog. Save the return value, an instance of
    // ActivityResultLauncher. You can use either a val, as shown in this snippet,
    // or a lateinit var in your onAttach() or onCreate() method.
    private val requestPermissionLauncher =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) { isGranted: Boolean ->
            if (isGranted) {
                // Permission is granted. Continue the action or workflow in your
                // app.
            } else {
                // Explain to the user that the feature is unavailable because the
                // feature requires a permission that the user has denied. At the
                // same time, respect the user's decision. Don't link to system
                // settings in an effort to convince the user to change their
                // decision.
                statusTextView.text = "Status: Notification permission denied."
            }
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_upload)

        workManager = WorkManager.getInstance(this)

        val uploadButton: Button = findViewById(R.id.uploadButton)
        val cancelButton: Button = findViewById(R.id.cancelButton)
        statusTextView = findViewById(R.id.statusTextView)

        askForNotificationPermission()

        uploadButton.setOnClickListener {
            val filePath = "/home/user/appointmentbooking/tiktok_products.csv"

            val data = Data.Builder()
                .putString(UploadWorker.KEY_FILE_PATH, filePath)
                .build()

            val uploadWorkRequest = OneTimeWorkRequestBuilder<UploadWorker>()
                .setInputData(data)
                .build()

            uploadWorkId = uploadWorkRequest.id
            workManager.enqueue(uploadWorkRequest)

            workManager.getWorkInfoByIdLiveData(uploadWorkId!!)
                .observe(this, Observer { workInfo ->
                    if (workInfo != null) {
                        val status = workInfo.state.name
                        statusTextView.text = "Status: $status"

                        val progress = workInfo.progress.getInt(UploadWorker.KEY_PROGRESS, 0)
                        statusTextView.append("\nProgress: $progress%")

                        if (workInfo.state == WorkInfo.State.SUCCEEDED) {
                            statusTextView.append("\nUpload finished!")
                        } else if (workInfo.state == WorkInfo.State.FAILED) {
                            statusTextView.append("\nUpload failed!")
                        }
                    }
                })
        }

        cancelButton.setOnClickListener {
            uploadWorkId?.let {
                workManager.cancelWorkById(it)
                statusTextView.text = "Status: Cancelled"
            }
        }
    }

    private fun askForNotificationPermission() {
        // This is only necessary for API level 33+
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) !=
                PackageManager.PERMISSION_GRANTED) {
                // Directly ask for the permission
                requestPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
            }
        }
    }
}
