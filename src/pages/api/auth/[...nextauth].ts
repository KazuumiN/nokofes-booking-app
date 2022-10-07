
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "lib/prismadb"

const { GOOGLE_ID, GOOGLE_SECRET, secret } = process.env;

if (!GOOGLE_ID) throw new Error('You must provide GOOGLE_ID env var.');
if (!GOOGLE_SECRET) throw new Error('You must provide GOOGLE_SECRET env var.');

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
    }),
  ],
  secret: secret,
  callbacks: {
    // @ts-ignore
    async signIn(user, account, profile) {
      // ユーザーのメールアドレスが@st.go.tuat.ac.jpで終わらない場合はログインを拒否する
      if (user.email.endsWith("@st.go.tuat.ac.jp")) {
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
