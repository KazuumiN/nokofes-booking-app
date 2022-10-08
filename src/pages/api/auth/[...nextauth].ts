
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "lib/prismadb"

const { GOOGLE_ID, GOOGLE_SECRET, secret } = process.env;

if (!GOOGLE_ID) throw new Error('You must provide GOOGLE_ID env var.');
if (!GOOGLE_SECRET) throw new Error('You must provide GOOGLE_SECRET env var.');

const getLineId = async (accessToken: string) => {
  const url = `https://api.line.me/oauth2/v2.1/verify?access_token=${accessToken}`
  const token = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error('accessTokenの検証に失敗しました')
      }
    })
  return token
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
        if (!credentials) {
          throw new Error('No credentials provided')
        }
        const token = await getLineId(credentials.accessToken)
        const user = {
          id: token.sub,
          name: token.name,
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
