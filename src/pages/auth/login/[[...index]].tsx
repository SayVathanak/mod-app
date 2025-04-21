import { useEffect, useState } from 'react';
import { SignIn } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { Box, Container, Heading, Text, Link as ChakraLink, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';

const LoginPage = () => {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const [isClient, setIsClient] = useState(false);

  // Redirect if user is already signed in
  useEffect(() => {
    setIsClient(true); // Ensuring that it runs only in the client-side environment

    if (isLoaded && userId) {
      router.push('/');
    }
  }, [isLoaded, userId, router]);

  if (!isClient) {
    return null; // Avoid rendering before the client-side initialization
  }

  return (
    <Container maxW="md" py={12}>
      <VStack spacing={6} align="center">
        <Heading as="h1" size="xl">Welcome Back</Heading>
        <Text color="gray.600">Sign in to access your account</Text>
        
        <Box w="full" borderRadius="md" overflow="hidden" boxShadow="md">
          <SignIn 
            path="/auth/login"
            routing="path"
            signUpUrl="/auth/register"
            redirectUrl={router.query.redirect?.toString() || '/'}
          />
        </Box>
        
        <Text fontSize="sm">
          Don't have an account?{' '}
          <Link href="/auth/register" passHref>
            <ChakraLink color="brand.500">Sign up</ChakraLink>
          </Link>
        </Text>
      </VStack>
    </Container>
  );
};

export default LoginPage;
