import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Icognito | Random Video or Voice Chat",
  description: "Random Video or Voice Chat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}