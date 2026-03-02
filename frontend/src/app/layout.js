import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "SocialApp - Connect with Friends",
  description: "A modern social media application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <ThemeProvider>
          <Navbar />
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#1e293b",
                color: "#f8fafc",
                borderRadius: "0.75rem",
              },
              success: {
                iconTheme: {
                  primary: "#22c55e",
                  secondary: "#f8fafc",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#f8fafc",
                },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
