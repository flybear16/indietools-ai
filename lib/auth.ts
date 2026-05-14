import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // Fetch fresh user data for subscription status
        const dbUser = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.id, user.id),
        });
        if (dbUser) {
          (session.user as any).subscriptionStatus = dbUser.subscriptionStatus;
          (session.user as any).role = dbUser.role;
          (session.user as any).stripeCustomerId = dbUser.stripeCustomerId;
        }
      }
      return session;
    },
  },
});