import type { Metadata } from "next";
import { Inter, Jost } from "next/font/google";
import Script from "next/script";

import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import CustomCursor from "@/components/ui/CustomCursor";
import TabNotifier from "@/components/ui/TabNotifier";
import HeaderMobileClient from "@/components/layout/HeaderMobileClient";
import FutsalHeader from "@/components/layout/FutsalHeader";

import DixorFooter from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import CartDrawer from "@/components/cart/CartDrawer";
import { Toaster } from "sonner";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  weight: ["400", "700", "900"],
  style: ["normal"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Saprix | Calzado Deportivo Premium",
  description: "Tienda oficial de Saprix. Encuentra los mejores guayos y zapatillas deportivas.",
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${jost.variable} font-inter bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300`} suppressHydrationWarning>
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <CartProvider>
            <WishlistProvider>
              <div className="flex flex-col min-h-screen">
                <CustomCursor />
                <TabNotifier />
                <HeaderMobileClient />
                <FutsalHeader />
                <main className="flex-grow">{children}</main>
                <DixorFooter />
                <CartDrawer />
                <WhatsAppButton />
              </div>
              <Toaster position="top-right" richColors />
            </WishlistProvider>
          </CartProvider>
        </ThemeProvider>
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}
