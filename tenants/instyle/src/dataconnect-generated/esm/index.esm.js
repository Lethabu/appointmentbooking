import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'appointmentbooking',
  location: 'us-central1'
};

export const createCustomerRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateCustomer');
}
createCustomerRef.operationName = 'CreateCustomer';

export function createCustomer(dc) {
  return executeMutation(createCustomerRef(dc));
}

export const listServicesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListServices');
}
listServicesRef.operationName = 'ListServices';

export function listServices(dc) {
  return executeQuery(listServicesRef(dc));
}

export const updateAppointmentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateAppointment', inputVars);
}
updateAppointmentRef.operationName = 'UpdateAppointment';

export function updateAppointment(dcOrVars, vars) {
  return executeMutation(updateAppointmentRef(dcOrVars, vars));
}

export const listStaffMembersRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListStaffMembers');
}
listStaffMembersRef.operationName = 'ListStaffMembers';

export function listStaffMembers(dc) {
  return executeQuery(listStaffMembersRef(dc));
}

