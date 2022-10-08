
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "lib/prismadb"

const { GOOGLE_ID, GOOGLE_SECRET, secret } = process.env;

if (!GOOGLE_ID) throw new Error('You must provide GOOGLE_ID env var.');
if (!GOOGLE_SECRET) throw new Error('You must provide GOOGLE_SECRET env var.');

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
  console.log(profile)
  return profile
}

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
    }),
    Credentials({
      name: 'LINE',
      credentials: {
        accessToken: { label: "Access Token", type: "text", placeholder: "Enter your access token" },
      },
      async authorize(credentials) {
        console.log(credentials)
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
  secret: secret,
  callbacks: {
    // @ts-ignore
    async signIn(user, account, profile) {
      // ユーザーのメールアドレスが@st.go.tuat.ac.jpで終わらない場合はログインを拒否する
      if (user.user.email.endsWith("@st.go.tuat.ac.jp")) {
        return true;
      }
      return false; // TODO: ちゃんとしたエラーメッセージを表示する
    },
    async session({ session, user, token }) {
      // @ts-ignore
      session.user.id = 1; // TODO: 動的に取得する
      return session;
    },
  }
});
