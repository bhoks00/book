'use client';

import {ThemeProvider, ToasterProvider, Toaster} from '@gravity-ui/uikit';
import '@gravity-ui/uikit/styles/styles.css';

export function UIProvider({children}: {children: React.ReactNode}) {
  // ✅ Buat instance Toaster
  const toaster = new Toaster();

  return (
    <ThemeProvider theme='light'>
      <ToasterProvider toaster={toaster}>
        <div className='bg-background min-h-screen'>
        {children}
        </div>
      </ToasterProvider>
    </ThemeProvider>
  );
}
