import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // ONLY allow your specific Google account
      const allowedEmail = "seneshfernando55@gmail.com"
      if (user.email === allowedEmail) {
        return true
      }
      return false // Access denied
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/error',
  },
})

export { handler as GET, handler as POST }
