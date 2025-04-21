// // pages/_app.tsx
// import { ChakraProvider } from "@chakra-ui/react";
// import { AppProps } from "next/app";
// import { AuthProvider } from "@/context/AuthContext";

// export default function App({ Component, pageProps }: AppProps) {
//   return (
//     <ChakraProvider>
//       <AuthProvider>
//         <Component {...pageProps} />
//       </AuthProvider>
//     </ChakraProvider>
//   );
// }

import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { ClerkProvider } from '@clerk/nextjs';
import theme from '../theme';
import '../styles/globals.css';
import MainLayout from '../components/layout/MainLayout';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <ChakraProvider theme={theme}>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </ChakraProvider>
    </ClerkProvider>
  );
}

