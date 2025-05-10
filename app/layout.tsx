import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";
import AuthProvider from "./api/auth/AuthProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Providers } from "./providers";
import Image from "next/image";
import Link from "next/link";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
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
          <body className={roboto.className}>
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

            <Toaster position="top-center" />
            {/* <Link href={"https://proppicks.com/"} target="_blank">
              <Image
                src="/images/propicks.svg"
                alt="bg"
                width={200}
                height={200}
                className="absolute bottom-4 right-2 z-50"
              />
            </Link> */}
          </body>
        </AuthProvider>
      </Providers>
    </html>
  );
}
