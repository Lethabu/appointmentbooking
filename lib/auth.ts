<<<<<<< HEAD
import { auth, currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export type Role = 'admin' | 'customer'

export interface AuthUser {
  userId: string
  role: Role
  email: string
}

export async function getCurrentUser(): Promise<AuthUser> {
  const { userId } = auth()
  if (!userId) {
    throw new NextResponse('Unauthorized', { status: 401 })
  }

  const user = await currentUser()
  if (!user) {
    throw new NextResponse('User not found', { status: 404 })
  }

  const role = (user.publicMetadata.role as Role) || 'customer'
  const email = user.emailAddresses[0]?.emailAddress || ''

  return { userId, role, email }
}

export function requireAdmin(requestHandler: (request: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const user = await getCurrentUser()
    if (user.role !== 'admin') {
      return new NextResponse('Forbidden: Admin access required', { status: 403 })
    }
    return requestHandler(request)
  }
}

export function requireCustomerOrAdmin(requestHandler: (request: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const user = await getCurrentUser()
    if (!['admin', 'customer'].includes(user.role)) {
      return new NextResponse('Forbidden: Customer or Admin access required', { status: 403 })
    }
    return requestHandler(request)
  }
}
=======
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
 
const prisma = new PrismaClient();
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});
>>>>>>> origin/feat/instyle-whitelabel
