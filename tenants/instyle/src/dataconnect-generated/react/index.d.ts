import { CreateCustomerData, ListServicesData, UpdateAppointmentData, UpdateAppointmentVariables, ListStaffMembersData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateCustomer(options?: useDataConnectMutationOptions<CreateCustomerData, FirebaseError, void>): UseDataConnectMutationResult<CreateCustomerData, undefined>;
export function useCreateCustomer(dc: DataConnect, options?: useDataConnectMutationOptions<CreateCustomerData, FirebaseError, void>): UseDataConnectMutationResult<CreateCustomerData, undefined>;

export function useListServices(options?: useDataConnectQueryOptions<ListServicesData>): UseDataConnectQueryResult<ListServicesData, undefined>;
export function useListServices(dc: DataConnect, options?: useDataConnectQueryOptions<ListServicesData>): UseDataConnectQueryResult<ListServicesData, undefined>;

export function useUpdateAppointment(options?: useDataConnectMutationOptions<UpdateAppointmentData, FirebaseError, UpdateAppointmentVariables>): UseDataConnectMutationResult<UpdateAppointmentData, UpdateAppointmentVariables>;
export function useUpdateAppointment(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateAppointmentData, FirebaseError, UpdateAppointmentVariables>): UseDataConnectMutationResult<UpdateAppointmentData, UpdateAppointmentVariables>;

export function useListStaffMembers(options?: useDataConnectQueryOptions<ListStaffMembersData>): UseDataConnectQueryResult<ListStaffMembersData, undefined>;
export function useListStaffMembers(dc: DataConnect, options?: useDataConnectQueryOptions<ListStaffMembersData>): UseDataConnectQueryResult<ListStaffMembersData, undefined>;
