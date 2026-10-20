import './globals.css';
import { Hind_Siliguri, Plus_Jakarta_Sans } from 'next/font/google';
import { ToastProvider } from '@/context/ToastContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { CartProvider } from '@/context/CartContext';
import { ProductProvider } from '@/context/ProductContext';
import ToastContainer from '@/components/common/ToastContainer';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import MobileBottomNav from '@/components/common/MobileBottomNav';
import CartDrawer from '@/components/cart/CartDrawer';

const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-hind-siliguri',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata = {
  title: 'ফুল কিনি (Phul Kini) | ভালোবাসা হোক ফুলের ভাষায় — প্রিমিয়াম ফ্লোরাল বুটিক',
  description:
    'ফুল কিনি (Phul Kini) বাংলাদেশের একটি প্রিমিয়াম ফ্লোরাল ই-কমার্স ব্র্যান্ড। তাজা ফুল, এক্সক্লুসিভ তোড়া, কাস্টম তোড়া ও গিফট কম্বো ডেলিভারি সমগ্র ঢাকায়।',
  keywords: 'ফুল কিনি, phul kini, flowers dhaka, floral boutique bangladesh, গোলাপ, লিলি, টিউলিপ, তোড়া, গিফট',
  authors: [{ name: 'Phul Kini' }],
  other: {
    google: 'notranslate',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#610000',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="bn"
      className={`${hindSiliguri.variable} ${plusJakartaSans.variable} notranslate`}
      translate="no"
      suppressHydrationWarning
    >
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col bg-[#FCF9F8] text-[#1B1C1C] antialiased selection:bg-[#FFDAD4] selection:text-[#610000]"
      >
        <ToastProvider>
          <ProductProvider>
            <WishlistProvider>
              <CartProvider>
                <Navbar />
                <main className="flex-1 pb-16 md:pb-0">{children}</main>
                <Footer />
                <MobileBottomNav />
                <CartDrawer />
                <ToastContainer />
              </CartProvider>
            </WishlistProvider>
          </ProductProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
