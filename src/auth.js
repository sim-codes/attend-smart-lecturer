import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { Session } from 'inspector';
import { use } from 'react';
import { authService } from './lib/services';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: {strategy: 'jwt'},
  providers: [Credentials({
    async authorize(credentials) {

        const parsedCredentials = z
        .object({ username: z.string().min(6), password: z.string().min(8) })
        .safeParse(credentials);

        if (parsedCredentials.success) {
            const { username, password } = parsedCredentials.data;
          const response = await authService.login({ username, password });

          if (response.success) {
            Promise.resolve([
                authUtils.setUserData(response.data.user),
                authUtils.setTokens(response.data.tokens)
            ]).then(() => {
              return response.data?.user;
            })
          }
        }
        return null;
    }
  })],
  callbacks: {
    async session({session, token, user}) {
        session = {
            ...session,
            user: {
                ...session.user
            }
        }
        return session;
    }
  }
});