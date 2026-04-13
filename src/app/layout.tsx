import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Greenfield Academy - Premier Educational Institution",
  description: "Greenfield Academy is a leading educational institution offering world-class academic programs, dedicated faculty, and a nurturing environment for student success. Apply now for admissions.",
  keywords: ["Greenfield Academy", "school", "college", "admission", "education", "university", "academic programs", "courses"],
  authors: [{ name: "Greenfield Academy" }],
  icons: {
    icon: "/logo-icon.png",
  },
  openGraph: {
    title: "Greenfield Academy - Premier Educational Institution",
    description: "World-class education for future leaders. Explore our programs and apply today.",
    siteName: "Greenfield Academy",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
