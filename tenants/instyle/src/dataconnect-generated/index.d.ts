import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Appointment_Key {
  id: UUIDString;
  __typename?: 'Appointment_Key';
}

export interface AvailabilitySlot_Key {
  id: UUIDString;
  __typename?: 'AvailabilitySlot_Key';
}

export interface CreateCustomerData {
  customer_insert: Customer_Key;
}

export interface Customer_Key {
  id: UUIDString;
  __typename?: 'Customer_Key';
}

export interface ListServicesData {
  services: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    durationMinutes: number;
    price: number;
  } & Service_Key)[];
}

export interface ListStaffMembersData {
  staffMembers: ({
    id: UUIDString;
    firstName: string;
    lastName: string;
    bio?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
  } & StaffMember_Key)[];
}

export interface Service_Key {
  id: UUIDString;
  __typename?: 'Service_Key';
}

export interface StaffMember_Key {
  id: UUIDString;
  __typename?: 'StaffMember_Key';
}

export interface Tenant_Key {
  id: UUIDString;
  __typename?: 'Tenant_Key';
}

export interface UpdateAppointmentData {
  appointment_update?: Appointment_Key | null;
}

export interface UpdateAppointmentVariables {
  id: UUIDString;
}

interface CreateCustomerRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateCustomerData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateCustomerData, undefined>;
  operationName: string;
}
export const createCustomerRef: CreateCustomerRef;

export function createCustomer(): MutationPromise<CreateCustomerData, undefined>;
export function createCustomer(dc: DataConnect): MutationPromise<CreateCustomerData, undefined>;

interface ListServicesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListServicesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListServicesData, undefined>;
  operationName: string;
}
export const listServicesRef: ListServicesRef;

export function listServices(): QueryPromise<ListServicesData, undefined>;
export function listServices(dc: DataConnect): QueryPromise<ListServicesData, undefined>;

interface UpdateAppointmentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateAppointmentVariables): MutationRef<UpdateAppointmentData, UpdateAppointmentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateAppointmentVariables): MutationRef<UpdateAppointmentData, UpdateAppointmentVariables>;
  operationName: string;
}
export const updateAppointmentRef: UpdateAppointmentRef;

export function updateAppointment(vars: UpdateAppointmentVariables): MutationPromise<UpdateAppointmentData, UpdateAppointmentVariables>;
export function updateAppointment(dc: DataConnect, vars: UpdateAppointmentVariables): MutationPromise<UpdateAppointmentData, UpdateAppointmentVariables>;

interface ListStaffMembersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListStaffMembersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListStaffMembersData, undefined>;
  operationName: string;
}
export const listStaffMembersRef: ListStaffMembersRef;

export function listStaffMembers(): QueryPromise<ListStaffMembersData, undefined>;
export function listStaffMembers(dc: DataConnect): QueryPromise<ListStaffMembersData, undefined>;

