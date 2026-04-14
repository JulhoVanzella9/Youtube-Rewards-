"use client";
import "./global.css";
import { I18nProvider } from "@/lib/i18n/context";
import { ThemeProvider } from "@/lib/theme/context";
import { useEffect } from "react";
import { checkScheduledNotifications } from "@/lib/notifications";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error);
    }

    // Check for scheduled notifications that need to be shown
    checkScheduledNotifications();
    
    // Check periodically for scheduled notifications
    const notificationInterval = setInterval(() => {
      checkScheduledNotifications();
    }, 60000); // Check every minute

    return () => clearInterval(notificationInterval);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/icons/icon-512x512.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="YouCash" />
        <title>YouCash Rewards - Earn Money Rating Videos</title>
        <meta name="description" content="YouCash Rewards - Earn money by rating videos. Join now and start earning!" />
        <meta name="version" content="1.0.7" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="mobile-web-app-capable" content="yes" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme !== 'dark' && theme !== 'light') theme = 'light';

                  var root = document.documentElement;
                  root.setAttribute('data-theme', theme);
                  root.style.colorScheme = theme;

                  // Apply to body ASAP (may not exist yet)
                  if (document.body) {
                    document.body.setAttribute('data-theme', theme);
                  } else {
                    root.setAttribute('data-theme-pending-body', theme);
                  }

                  // Keep browser UI (address bar, etc) consistent
                  var meta = document.querySelector('meta[name="theme-color"]');
                  if (meta) meta.setAttribute('content', theme === 'dark' ? '#0F0F0F' : '#FFFFFF');

                  // Avoid white flash on dark + avoid dark flash on light
                  root.style.backgroundColor = theme === 'dark' ? '#0F0F0F' : '#FFFFFF';
                  root.setAttribute('data-theme-init', '1');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
