// lib/rbac.js
const ROLES = {
  OWNER: 'owner',
  MANAGER: 'manager',
  STAFF: 'staff',
  CLIENT: 'client'
};

const PERMISSIONS = {
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
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
}

// pages/api/staff/invite.js
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { hasPermission, ROLES, PERMISSIONS } from '@/lib/rbac'

export default async function handler(req, res) {
  const supabase = createServerSupabaseClient({ req, res })
  const { data: { session }} = await supabase.auth.getSession()
  
  if (!session) return res.status(401).json({ error: 'Unauthorized' })
  
  // Get user's role in salon
  const { data: userRole } = await supabase
    .rpc('get_user_role', {
      salon_id: req.body.salonId,
      user_id: session.user.id
    })
  
  // Check permission
  if (!hasPermission(userRole, PERMISSIONS.STAFF_INVITE)) {
    return res.status(403).json({ error: 'Insufficient permissions' })
  }
  
  // Create invite
  const { error } = await supabase
    .from('staff_invites')
    .insert({
      salon_id: req.body.salonId,
      email: req.body.email,
      role: req.body.role,
      invited_by: session.user.id
    })
  
  if (error) return res.status(500).json({ error: error.message })
  
  // Send invitation email (pseudo-code)
  await sendInviteEmail(req.body.email, req.body.role)
  
  return res.status(200).json({ success: true })
}

// PostgreSQL function for user role lookup
CREATE OR REPLACE FUNCTION get_user_role(salon_id uuid, user_id uuid)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM staff_members
  WHERE salon_id = $1 AND user_id = $2;
  
  IF NOT FOUND THEN
    -- Check if owner
    SELECT 'owner' INTO user_role
    FROM salons
    WHERE id = $1 AND owner_id = $2;
  END IF;
  
  RETURN COALESCE(user_role, 'client');
END;
$$ LANGUAGE plpgsql;