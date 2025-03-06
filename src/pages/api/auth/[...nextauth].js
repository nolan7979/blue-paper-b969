import axios from 'axios';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const mappingAccessToken = {};

export default async function auth(req, res) {
  const protocol = req.headers.host.includes('localhost') ? 'http' : 'https';
  const host = req.headers.host;
  const isProd = process.env.NEXT_PUBLIC_NODE_ENVIRONMENT == 'production';
  const isStaging = process.env.NEXT_PUBLIC_NODE_ENVIRONMENT == 'staging';

  const baseUrl = `${protocol}://${host}`;
  process.env.NEXTAUTH_URL = `${protocol}://${host}`;

  const authOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: {
          params: {
            prompt: 'consent',
            access_type: 'offline',
            response_type: 'code',
          },
        },
      }),
    ],

    callbacks: {
      async jwt({ token, account, user }) {
        if (account) {
          token.accessToken =
            mappingAccessToken[account.providerAccountId] ||
            account.access_token;
          token.idToken = account.id_token;
          token.userId = user.id;
        }
        return token;
      },
      async session({ session, token }) {
        session.accessToken =
          mappingAccessToken[token.userId] || token.accessToken;
        session.idToken = token.idToken;
        session.userId = token.userId;
        return session;
      },
      async signIn({ account, profile }) {
        try {
          if (!account) {
            return false;
          }
          if (account.provider === 'google') {
            const endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-access-token`;
            const payload = {
              accessToken: account.id_token,
              provider: account.provider,
            };
            const res = await axios.post(endpoint, payload);
            if (!res?.data?.data?.accessToken) {
              return false;
            }
            
            mappingAccessToken[account.providerAccountId] =
              res?.data?.data?.accessToken || null;
          }
          return true;
        } catch (error) {
          console.error(error);
          return false;
        }
      },
      async redirect({ url, baseUrl }) {
        let targetBaseUrl, targetStagingBaseUrl;

        if (baseUrl.includes('uniscore.com')) {
          targetBaseUrl = 'https://uniscore.com';
        } else {
          // Default to the primary domain
          targetBaseUrl = 'https://uniscore.vn';
        }

        if (baseUrl.includes('staging.uniscore.com')) {
          targetStagingBaseUrl = 'https://staging.uniscore.com';
        } else {
          targetStagingBaseUrl = 'https://staging.uniscore.vn';
        }


        if (url.includes('error=')) {
          const targetUrl = isProd ? targetBaseUrl : 
                           isStaging ? targetStagingBaseUrl : 
                           baseUrl;
          return `${targetUrl}/auth/google-signin-popup?closePopup=true`;
        }

        const newUrl = new URL(url, targetBaseUrl || targetStagingBaseUrl);
        const path = newUrl.pathname.includes('/auth/google-signin-popup')
          ? newUrl.pathname
          : '/';

        if (isProd) {
          return `${targetBaseUrl}${path}`;
        }
        if (isStaging) {
          return `${targetStagingBaseUrl}${path}`;
        }

        return url;
        // Ensure redirect URL matches the current domain or subdomain
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
      signIn: `${baseUrl}/auth/signin`,
      error: `${baseUrl}/auth/error`,
      verifyRequest: `${baseUrl}/auth/verify-request`,
    },
  };
  return NextAuth(req, res, authOptions);
}
