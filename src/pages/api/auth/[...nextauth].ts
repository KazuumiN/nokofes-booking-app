
import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/email"
import GoogleProvider from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "lib/prismadb"

const { GOOGLE_ID, GOOGLE_SECRET, NEXTAUTH_SECRET } = process.env;

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
  return profile
}

import { createTransport } from "nodemailer"

async function sendVerificationRequest(params: { identifier: any; url: any; provider: any; }) {
  const { identifier, url, provider } = params
  const { host } = new URL(url)
  // NOTE: You are not required to use `nodemailer`, use whatever you want.
  const transport = createTransport(provider.server)
  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: `農工祭予約システムにサインインする`,
    text: text({ url, host }),
    html: html({ url, host }),
  })
  const failed = result.rejected.concat(result.pending).filter(Boolean)
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`)
  }
}

/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
 */
function html(params: { url: string; host: string; }) {
  const { url, host } = params

  const escapedHost = host.replace(/\./g, "&#8203;.")

  const brandColor = "#2c9e50"
  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: "#fff",
  }

  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        <strong>農工祭予約システム</strong>にサインインする。
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}">
              <a href="${url}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">
                ここをクリックしてサインイン
              </a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        もし、このメールに心当たりがない場合は、このメールを無視してください。
      </td>
    </tr>
  </table>
</body>
`
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ url, host }: { url: string; host: string }) {
  return `農工祭予約システムにサインインする。\n${url}\n\n`
}

export default NextAuth({
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
        return sendVerificationRequest({
          identifier: email,
          url,
          provider: { server, from },
        })
      },
    }),
    // GoogleProvider({
    //   clientId: GOOGLE_ID,
    //   clientSecret: GOOGLE_SECRET,
    // }),
    // Credentials({
    //   name: 'LINE',
    //   credentials: {
    //     accessToken: { label: "Access Token", type: "text", placeholder: "Enter your access token" },
    //   },
    //   async authorize(credentials) {
    //     console.log(credentials)
    //     if (!credentials) {
    //       throw new Error('No credentials provided')
    //     }
    //     const token = await getLineProfile(credentials.accessToken)
    //     console.log(token)
    //     const user = {
    //       id: token.userId,
    //     }
    //     return user
    //   },
    // }),
  ],
  secret: NEXTAUTH_SECRET,
  callbacks: {
    // @ts-ignore
    // async signIn(user, account, profile) {
    //   // ユーザーのメールアドレスが@st.go.tuat.ac.jpで終わらない場合はログインを拒否する
    //   if (user.user.email.endsWith("@st.go.tuat.ac.jp")) {
    //     return true;
    //   }
    //   return false; // TODO: ちゃんとしたエラーメッセージを表示する
    // },
    // async session({ session, user, token }) {
    //   // @ts-ignore
    //   session.user.idNumber = '12345678'; // TODO: 動的に取得する。予約が済んでなかったら渡さない。
    //   return session;
    // },
  }
});


