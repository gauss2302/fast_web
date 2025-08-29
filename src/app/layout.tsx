import { Inter } from "next/font/google";

import "./globals.css";
import { Providers } from "@/components/providers/appProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "JobBoard - Find Your Dream Job",
  description: "Connect with top companies and find amazing job opportunities",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
