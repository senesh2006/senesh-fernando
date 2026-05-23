import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  callbacks: {
    async signIn({ user }) {
      const allowedEmail = "seneshfernando55@gmail.com"
      return user.email === allowedEmail
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
})

export { handler as GET, handler as POST }
