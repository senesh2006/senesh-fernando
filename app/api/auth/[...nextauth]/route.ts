import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"

const allowedUsername =
  process.env.GITHUB_ALLOWED_USERNAME ?? "senesh2006"

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
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
