import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Payment Tracker",
  description: "Automated payment tracking system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
