import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { ClerkProvider } from '@clerk/nextjs';
import theme from '../theme';
import Fonts from "../components/Fonts";
import '../styles/globals.css';
import MainLayout from '../components/layout/MainLayout';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <ChakraProvider theme={theme}>
        <MainLayout>
          <Fonts/>
          <Component {...pageProps} />
        </MainLayout>
      </ChakraProvider>
    </ClerkProvider>
  );
}