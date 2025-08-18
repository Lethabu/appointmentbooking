'use server';

import { cookies } from 'next/headers';
import { getUser, getUserWithTeam } from '@/lib/db/queries';
import { logActivity } from '@/app/(login)/actions';

export async function signOut() {
  const user = (await getUser()) as User;
  const userWithTeam = await getUserWithTeam(user.id);
  await logActivity(userWithTeam?.teamId, user.id, 'SIGN_OUT');
  (await cookies()).delete('session');
}
