<<<<<<< HEAD
import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
=======

import NextAuth, { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
>>>>>>> origin/feat/instyle-whitelabel
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      id: string;
<<<<<<< HEAD
    } & DefaultSession['user'];
=======
    } & DefaultSession["user"]
>>>>>>> origin/feat/instyle-whitelabel
  }

  interface User extends DefaultUser {
    /** The user's postal address. */
    id: string;
  }
}
