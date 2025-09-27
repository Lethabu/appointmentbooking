# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListServices*](#listservices)
  - [*ListStaffMembers*](#liststaffmembers)
- [**Mutations**](#mutations)
  - [*CreateCustomer*](#createcustomer)
  - [*UpdateAppointment*](#updateappointment)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListServices
You can execute the `ListServices` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listServices(): QueryPromise<ListServicesData, undefined>;

interface ListServicesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListServicesData, undefined>;
}
export const listServicesRef: ListServicesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listServices(dc: DataConnect): QueryPromise<ListServicesData, undefined>;

interface ListServicesRef {
  ...
  (dc: DataConnect): QueryRef<ListServicesData, undefined>;
}
export const listServicesRef: ListServicesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listServicesRef:
```typescript
const name = listServicesRef.operationName;
console.log(name);
```

### Variables
The `ListServices` query has no variables.
### Return Type
Recall that executing the `ListServices` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListServicesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListServicesData {
  services: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    durationMinutes: number;
    price: number;
  } & Service_Key)[];
}
```
### Using `ListServices`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listServices } from '@dataconnect/generated';


// Call the `listServices()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listServices();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listServices(dataConnect);

console.log(data.services);

// Or, you can use the `Promise` API.
listServices().then((response) => {
  const data = response.data;
  console.log(data.services);
});
```

### Using `ListServices`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listServicesRef } from '@dataconnect/generated';


// Call the `listServicesRef()` function to get a reference to the query.
const ref = listServicesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listServicesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.services);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.services);
});
```

## ListStaffMembers
You can execute the `ListStaffMembers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listStaffMembers(): QueryPromise<ListStaffMembersData, undefined>;

interface ListStaffMembersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListStaffMembersData, undefined>;
}
export const listStaffMembersRef: ListStaffMembersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listStaffMembers(dc: DataConnect): QueryPromise<ListStaffMembersData, undefined>;

interface ListStaffMembersRef {
  ...
  (dc: DataConnect): QueryRef<ListStaffMembersData, undefined>;
}
export const listStaffMembersRef: ListStaffMembersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listStaffMembersRef:
```typescript
const name = listStaffMembersRef.operationName;
console.log(name);
```

### Variables
The `ListStaffMembers` query has no variables.
### Return Type
Recall that executing the `ListStaffMembers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListStaffMembersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListStaffMembers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listStaffMembers } from '@dataconnect/generated';


// Call the `listStaffMembers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listStaffMembers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listStaffMembers(dataConnect);

console.log(data.staffMembers);

// Or, you can use the `Promise` API.
listStaffMembers().then((response) => {
  const data = response.data;
  console.log(data.staffMembers);
});
```

### Using `ListStaffMembers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listStaffMembersRef } from '@dataconnect/generated';


// Call the `listStaffMembersRef()` function to get a reference to the query.
const ref = listStaffMembersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listStaffMembersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.staffMembers);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.staffMembers);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateCustomer
You can execute the `CreateCustomer` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createCustomer(): MutationPromise<CreateCustomerData, undefined>;

interface CreateCustomerRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateCustomerData, undefined>;
}
export const createCustomerRef: CreateCustomerRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createCustomer(dc: DataConnect): MutationPromise<CreateCustomerData, undefined>;

interface CreateCustomerRef {
  ...
  (dc: DataConnect): MutationRef<CreateCustomerData, undefined>;
}
export const createCustomerRef: CreateCustomerRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createCustomerRef:
```typescript
const name = createCustomerRef.operationName;
console.log(name);
```

### Variables
The `CreateCustomer` mutation has no variables.
### Return Type
Recall that executing the `CreateCustomer` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateCustomerData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateCustomerData {
  customer_insert: Customer_Key;
}
```
### Using `CreateCustomer`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createCustomer } from '@dataconnect/generated';


// Call the `createCustomer()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createCustomer();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createCustomer(dataConnect);

console.log(data.customer_insert);

// Or, you can use the `Promise` API.
createCustomer().then((response) => {
  const data = response.data;
  console.log(data.customer_insert);
});
```

### Using `CreateCustomer`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createCustomerRef } from '@dataconnect/generated';


// Call the `createCustomerRef()` function to get a reference to the mutation.
const ref = createCustomerRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createCustomerRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.customer_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.customer_insert);
});
```

## UpdateAppointment
You can execute the `UpdateAppointment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateAppointment(vars: UpdateAppointmentVariables): MutationPromise<UpdateAppointmentData, UpdateAppointmentVariables>;

interface UpdateAppointmentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateAppointmentVariables): MutationRef<UpdateAppointmentData, UpdateAppointmentVariables>;
}
export const updateAppointmentRef: UpdateAppointmentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateAppointment(dc: DataConnect, vars: UpdateAppointmentVariables): MutationPromise<UpdateAppointmentData, UpdateAppointmentVariables>;

interface UpdateAppointmentRef {
  ...
  (dc: DataConnect, vars: UpdateAppointmentVariables): MutationRef<UpdateAppointmentData, UpdateAppointmentVariables>;
}
export const updateAppointmentRef: UpdateAppointmentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateAppointmentRef:
```typescript
const name = updateAppointmentRef.operationName;
console.log(name);
```

### Variables
The `UpdateAppointment` mutation requires an argument of type `UpdateAppointmentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateAppointmentVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `UpdateAppointment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateAppointmentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateAppointmentData {
  appointment_update?: Appointment_Key | null;
}
```
### Using `UpdateAppointment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateAppointment, UpdateAppointmentVariables } from '@dataconnect/generated';

// The `UpdateAppointment` mutation requires an argument of type `UpdateAppointmentVariables`:
const updateAppointmentVars: UpdateAppointmentVariables = {
  id: ..., 
};

// Call the `updateAppointment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateAppointment(updateAppointmentVars);
// Variables can be defined inline as well.
const { data } = await updateAppointment({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateAppointment(dataConnect, updateAppointmentVars);

console.log(data.appointment_update);

// Or, you can use the `Promise` API.
updateAppointment(updateAppointmentVars).then((response) => {
  const data = response.data;
  console.log(data.appointment_update);
});
```

### Using `UpdateAppointment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateAppointmentRef, UpdateAppointmentVariables } from '@dataconnect/generated';

// The `UpdateAppointment` mutation requires an argument of type `UpdateAppointmentVariables`:
const updateAppointmentVars: UpdateAppointmentVariables = {
  id: ..., 
};

// Call the `updateAppointmentRef()` function to get a reference to the mutation.
const ref = updateAppointmentRef(updateAppointmentVars);
// Variables can be defined inline as well.
const ref = updateAppointmentRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateAppointmentRef(dataConnect, updateAppointmentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.appointment_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.appointment_update);
});
```

