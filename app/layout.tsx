import type { Metadata } from "next";
import { Roboto, Urbanist } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";
import AuthProvider from "./api/auth/AuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Providers } from "./providers";
import Script from "next/script";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-urbanist",
});

export const metadata: Metadata = {
  title: "GooFunded",
  description: "  Best in Prop firms ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning suppressContentEditableWarning>
      <Providers>
        <AuthProvider>
          <Script
            strategy="lazyOnload"
            src={`https://embed.tawk.to/6853d7a6c96da61913b6fcb2/1iu3o4p51`}
            async
            charSet="UTF-8"
            //@ts-ignore
            crossOrigin="*"
          />
          <body className={`${roboto.className} ${urbanist.className}`}>
            <NextTopLoader
              color="blue"
              initialPosition={0.08}
              crawlSpeed={200}
              height={2}
              crawl={true}
              showSpinner={false}
              easing=" ease-in-out"
              speed={200}
              shadow="0 0 5px #2299DD,0 0 5px #2299DD"
            />
            {children}
            <ToastContainer />

            <Toaster position="bottom-center" />
          </body>
        </AuthProvider>
      </Providers>
    </html>
  );
}
