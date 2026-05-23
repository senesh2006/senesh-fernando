import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import { getAuthBaseUrl, getGitHubCallbackUrl } from "@/lib/auth-url"

const allowedUsername =
  process.env.GITHUB_ALLOWED_USERNAME ?? "senesh2006"

const authBaseUrl = getAuthBaseUrl()
const githubCallbackUrl = getGitHubCallbackUrl()

process.env.NEXTAUTH_URL = authBaseUrl

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
      authorization: {
        params: {
          redirect_uri: githubCallbackUrl,
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ profile }) {
      const githubProfile = profile as { login?: string } | undefined
      return githubProfile?.login === allowedUsername
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
})

export { handler as GET, handler as POST }
