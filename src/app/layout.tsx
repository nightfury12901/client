import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClientGravity AI — Stop Applying. Start Getting Clients.",
  description: "AI-powered tool for freelancers to discover client opportunities, generate high-converting proposals, and analyze job posts.",
  keywords: ["freelance", "AI proposals", "client finder", "lead generation", "freelancer tools"],
  authors: [{ name: "ClientGravity AI" }],
  openGraph: {
    title: "ClientGravity AI",
    description: "AI that finds leads and writes proposals that actually get replies.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
