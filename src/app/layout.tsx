import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SyncSession } from "@/components/auth/sync-session";
import { getSiteUrl } from "@/lib/site-url";

// Runtime guard: Warn if NEXT_PUBLIC_SITE_URL is missing in production
if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SITE_URL) {
  console.warn(
    "⚠️  NEXT_PUBLIC_SITE_URL is not set. Using fallback:",
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"
  );
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Note Summarizer",
  description: "Turn messy notes into clear summaries. Paste long text and get a clean summary + bullet points in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                  if (mediaQuery.matches) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <SyncSession />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
