'use client';

import { useEffect, useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import './globals.css';
import './styles.css';
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);

  const isNotFoundPage = pathname === '/_not-found';

  useEffect(() => {
    if (isNotFoundPage) return;

    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 500);

    const handleLoad = () => {
      setIsNavigating(false);
      clearTimeout(timer);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      const observer = new MutationObserver(() => {
        if (document.readyState === 'complete') {
          handleLoad();
          observer.disconnect();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      window.removeEventListener('load', handleLoad);
      clearTimeout(timer);
    };
  }, [pathname, searchParams, isNotFoundPage]);

  useEffect(() => {
    const originalConsoleLog = console.log;

    const messages = [
      '%cSegura aí, meu piru viadin!',
      '%cAFIS VEIIR',
      '%chttps://instagram.com/tudaocuzin',
    ];

    const styles = [
      'color: #ff5733; font-size: 40px; font-weight: bold; text-shadow: 2px 2px 4px #000000;',
      'font-size: 16px; font-weight: bold; color: red;',
      'font-size: 16px;',
    ];

    let messageIndex = 0;
    const intervalId = setInterval(() => {
      originalConsoleLog(messages[messageIndex], styles[messageIndex]);
      messageIndex = (messageIndex + 1) % messages.length;
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      {isNavigating && !isNotFoundPage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
          <div className="loading-spinner"></div>
        </div>
      )}
      <div
        className={`min-h-screen font-sans antialiased transition-opacity duration-300 ${
          isNavigating && !isNotFoundPage ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {children}
      </div>
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
       <title>Centro de Recarga Free Fire</title>
        <meta name="description" content="O site oficial para comprar diamantes no Free Fire. Vários métodos de pagamento estão disponíveis para os jogadores do Brasil." 
        />

        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-17521187394"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17521187394');
            `,
          }}
        />

        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1445729596694572');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1445729596694572&ev=PageView&noscript=1"
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={null}>
          <LayoutContent>{children}</LayoutContent>
        </Suspense>
      </body>
    </html>
  );
}
