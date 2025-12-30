import type { Metadata } from "next";
import "./globals.css";
import RootProviderWrapper from "@/components/RootProviderWrapper";
import Footer from "@/components/Footer";


export const metadata: Metadata = {
  title: "BlueSky Wrapped 2025",
  description: "Discover your BlueSky year in review with BlueSky Wrapped! Unveil your top posts, interactions, and community highlights in a personalized digital experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en" data-theme="light">
      <body
        className={`antialiased `}
      >
        <RootProviderWrapper>
          {children}
        </RootProviderWrapper>
        <Footer />
      </body>
    </html>

  );
}
