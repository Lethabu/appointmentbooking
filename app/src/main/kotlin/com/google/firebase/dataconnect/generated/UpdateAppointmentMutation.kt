
@file:kotlin.Suppress(
  "KotlinRedundantDiagnosticSuppress",
  "LocalVariableName",
  "MayBeConstant",
  "RedundantVisibilityModifier",
  "RemoveEmptyClassBody",
  "SpellCheckingInspection",
  "LocalVariableName",
  "unused",
)

package com.google.firebase.dataconnect.generated



public interface UpdateAppointmentMutation :
    com.google.firebase.dataconnect.generated.GeneratedMutation<
      ExampleConnector,
      UpdateAppointmentMutation.Data,
      UpdateAppointmentMutation.Variables
    >
{
  
    @kotlinx.serialization.Serializable
  public data class Variables(
  
    val id: @kotlinx.serialization.Serializable(with = com.google.firebase.dataconnect.serializers.UUIDSerializer::class) java.util.UUID
  ) {
    
    
  }
  

  
    @kotlinx.serialization.Serializable
  public data class Data(
  
    @kotlinx.serialization.SerialName("appointment_update") val key: AppointmentKey?
  ) {
    
    
  }
  

  public companion object {
    public val operationName: String = "UpdateAppointment"

    public val dataDeserializer: kotlinx.serialization.DeserializationStrategy<Data> =
      kotlinx.serialization.serializer()

    public val variablesSerializer: kotlinx.serialization.SerializationStrategy<Variables> =
      kotlinx.serialization.serializer()
  }
}

public fun UpdateAppointmentMutation.ref(
  
    id: java.util.UUID,
  
  
): com.google.firebase.dataconnect.MutationRef<
    UpdateAppointmentMutation.Data,
    UpdateAppointmentMutation.Variables
  > =
  ref(
    
      UpdateAppointmentMutation.Variables(
        id=id,
  
      )
    
  )

public suspend fun UpdateAppointmentMutation.execute(
  
    id: java.util.UUID,
  
  
  ): com.google.firebase.dataconnect.MutationResult<
    UpdateAppointmentMutation.Data,
    UpdateAppointmentMutation.Variables
  > =
  ref(
    
      id=id,
  
    
  ).execute()



// The lines below are used by the code generator to ensure that this file is deleted if it is no
// longer needed. Any files in this directory that contain the lines below will be deleted by the
// code generator if the file is no longer needed. If, for some reason, you do _not_ want the code
// generator to delete this file, then remove the line below (and this comment too, if you want).

// FIREBASE_DATA_CONNECT_GENERATED_FILE MARKER 42da5e14-69b3-401b-a9f1-e407bee89a78
// FIREBASE_DATA_CONNECT_GENERATED_FILE CONNECTOR example
