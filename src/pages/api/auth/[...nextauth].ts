import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/email"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "lib/prismadb"

const { NEXTAUTH_SECRET } = process.env;

const getLineProfile = async (accessToken: string) => {
  const url = `https://api.line.me/v2/profile`
  const profile = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error('accessTokenの検証に失敗しました')
      }
    }
  )
  return profile
}

const sendVerificationViaGAS = async (email: string, url: string) => {
  const endpoint = process.env.GAS_ENDPOINT
  const params = {
    email,
    url,
  }
  const query = Object.keys(params)
  // @ts-ignore
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');
  await fetch(`${endpoint}?${query}`)
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      sendVerificationRequest({
        identifier: email,
        url,
        provider: { server, from },
      }) {
        return sendVerificationViaGAS(email, url)
      },
    }),
    Credentials({
      name: 'LINE',
      credentials: {
        accessToken: { label: "Access Token", type: "text", placeholder: "Enter your access token" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('No credentials provided')
        }
        const token = await getLineProfile(credentials.accessToken)
        const user = {
          id: token.userId,
        }
        return user
      },
    }),
  ],
  pages: {
    error: '/auth-error', // Error code passed in query string as ?error=
    verifyRequest: '/verify-request', // (used for check email message)
  },
  session: {
    strategy: 'jwt',
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: NEXTAUTH_SECRET,
}

// @ts-ignore
export default NextAuth(authOptions)

