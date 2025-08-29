import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { JWT } from "next-auth/jwt";
import axios from "axios";
import { BACKEND_URL } from "@/utils/server_provider";

interface BackendUser {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

interface BackendTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: BackendUser;
}

interface ExtendedUser extends User {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  backendUser?: BackendUser;
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/auth/web/refresh`,
      {},
      {
        headers: {
          Cookie: `refresh_token=${token.refreshToken}`,
        },
        withCredentials: true,
      }
    );

    const refreshedTokens = response.data;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: Date.now() + refreshedTokens.expires_in * 1000,
    };
  } catch (error) {
    console.error("Failed to refresh access token:", error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    // Email/Password Authentication
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<ExtendedUser | null> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await axios.post(
            `${BACKEND_URL}/api/v1/auth/web/login`,
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              withCredentials: true, // Important for cookies
              validateStatus: (status) => status < 500, // Don't throw on 4xx errors
            }
          );

          if (response.status !== 200) {
            console.error("Login failed:", response.data);
            return null;
          }

          const data: BackendTokenResponse = response.data;

          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.full_name,
            image: data.user.avatar_url,
            accessToken: data.access_token,
            expiresAt: Date.now() + data.expires_in * 1000,
            backendUser: data.user,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),

    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),

    // GitHub OAuth
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email",
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // Exchange Google code for our backend tokens
          const response = await axios.post(
            `${BACKEND_URL}/api/v1/auth/web/google/token`,
            {
              code: account.access_token, // Google access token
              state: account.id_token, // Use ID token as state
            },
            {
              withCredentials: true,
            }
          );

          const data: BackendTokenResponse = response.data;

          // Store backend data in user object
          (user as ExtendedUser).accessToken = data.access_token;
          (user as ExtendedUser).expiresAt =
            Date.now() + data.expires_in * 1000;
          (user as ExtendedUser).backendUser = data.user;

          return true;
        } catch (error) {
          console.error("Google authentication failed:", error);
          return false;
        }
      }

      if (account?.provider === "github") {
        try {
          // Exchange GitHub code for our backend tokens
          const response = await axios.post(
            `${BACKEND_URL}/api/v1/auth/web/github/token`,
            {
              code: account.access_token, // GitHub access token
              state: account.id, // Use account ID as state
            },
            {
              withCredentials: true,
            }
          );

          const data: BackendTokenResponse = response.data;

          (user as ExtendedUser).accessToken = data.access_token;
          (user as ExtendedUser).expiresAt =
            Date.now() + data.expires_in * 1000;
          (user as ExtendedUser).backendUser = data.user;

          return true;
        } catch (error) {
          console.error("GitHub authentication failed:", error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user, account }) {
      // Initial sign in
      if (user && account) {
        const extUser = user as ExtendedUser;
        return {
          ...token,
          accessToken: extUser.accessToken,
          expiresAt: extUser.expiresAt,
          backendUser: extUser.backendUser,
        };
      }

      // Return previous token if the access token has not expired yet
      if (token.expiresAt && Date.now() < (token.expiresAt as number)) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (token.error) {
        // Force sign out if refresh failed - NextAuth will handle this
        return {
          ...session,
          expires: "1970-01-01T00:00:00.000Z", // Expired session
        };
      }

      // Add our custom properties to session
      const extendedSession = session as Session & {
        accessToken?: string;
        backendUser?: BackendUser;
      };

      extendedSession.accessToken = token.accessToken as string;
      extendedSession.user.id = token.sub!;

      // Add backend user data to session
      if (token.backendUser) {
        extendedSession.backendUser = token.backendUser as BackendUser;
      }

      return extendedSession;
    },
  },

  events: {
    async signOut({ token }) {
      // Logout from backend
      if (token.accessToken) {
        try {
          await axios.post(
            `${BACKEND_URL}/api/v1/auth/web/logout`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token.accessToken}`,
              },
              withCredentials: true,
            }
          );
        } catch (error) {
          console.error("Backend logout failed:", error);
        }
      }
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};

export default NextAuth(authOptions);
