export const ROLES = {
  OWNER: 'owner',
  MANAGER: 'manager',
  STAFF: 'staff',
  CLIENT: 'client'
};

export const PERMISSIONS = {
  DASHBOARD_VIEW: 'dashboard:view',
  APPOINTMENTS_MANAGE: 'appointments:manage',
  PRODUCTS_MANAGE: 'products:manage',
  SETTINGS_UPDATE: 'settings:update',
  BILLING_MANAGE: 'billing:manage',
  STAFF_INVITE: 'staff:invite'
};

const ROLE_PERMISSIONS = {
  [ROLES.OWNER]: Object.values(PERMISSIONS),
  [ROLES.MANAGER]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.APPOINTMENTS_MANAGE,
    PERMISSIONS.PRODUCTS_MANAGE,
    PERMISSIONS.STAFF_INVITE
  ],
  [ROLES.STAFF]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.APPOINTMENTS_MANAGE
  ],
  [ROLES.CLIENT]: []
};

export function hasPermission(userRole, permission) {
  if (!userRole) return false;
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
}