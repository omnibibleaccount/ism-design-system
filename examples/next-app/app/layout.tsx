import type { ReactNode } from 'react';
import '@ism/ui/css';
import { DirectionProvider } from '@ism/ui';

export const metadata = { title: 'ISM Design System · Next.js example' };

// Set lang and dir per request in a real app (for example from the locale route segment).
// For Arabic, Urdu and Farsi also import '@ism/ui/css/rtl' and pass dir="rtl".
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body>
        <DirectionProvider dir="ltr">{children}</DirectionProvider>
      </body>
    </html>
  );
}
