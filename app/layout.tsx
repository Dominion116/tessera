import type { Metadata } from "next";
import { headers } from "next/headers";
import { ThemeProvider } from "@/components/theme-provider";
import { FarcasterProvider } from "@/components/farcaster/farcaster-provider";
import { WalletProvider } from "@/components/wallet/wallet-provider";
import "./globals.css";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000";

const DESCRIPTION =
  "Create onchain POAPs, hand them out at real events, and collect them. Artwork and metadata live entirely onchain.";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Tessera",
    template: "%s, Tessera",
  },
  description: DESCRIPTION,
  keywords: [
    "POAP",
    "proof of attendance",
    "onchain SVG",
    "Base",
    "ERC-1155",
    "event badges",
  ],
  icons: {
    icon: [{ url: "/tessera-mark.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    siteName: "Tessera",
    title: "Tessera",
    description: DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tessera",
    description: DESCRIPTION,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await headers();
  const cookies = cookieStore.get("cookie");

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <FarcasterProvider>
            <WalletProvider cookies={cookies}>{children}</WalletProvider>
          </FarcasterProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
