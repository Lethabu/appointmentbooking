const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'appointmentbooking',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

const createCustomerRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateCustomer');
}
createCustomerRef.operationName = 'CreateCustomer';
exports.createCustomerRef = createCustomerRef;

exports.createCustomer = function createCustomer(dc) {
  return executeMutation(createCustomerRef(dc));
};

const listServicesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListServices');
}
listServicesRef.operationName = 'ListServices';
exports.listServicesRef = listServicesRef;

exports.listServices = function listServices(dc) {
  return executeQuery(listServicesRef(dc));
};

const updateAppointmentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateAppointment', inputVars);
}
updateAppointmentRef.operationName = 'UpdateAppointment';
exports.updateAppointmentRef = updateAppointmentRef;

exports.updateAppointment = function updateAppointment(dcOrVars, vars) {
  return executeMutation(updateAppointmentRef(dcOrVars, vars));
};

const listStaffMembersRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListStaffMembers');
}
listStaffMembersRef.operationName = 'ListStaffMembers';
exports.listStaffMembersRef = listStaffMembersRef;

exports.listStaffMembers = function listStaffMembers(dc) {
  return executeQuery(listStaffMembersRef(dc));
};
