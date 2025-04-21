// pages/auth/register.tsx
import { useEffect } from 'react'
import { SignUp } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import { Box, Container, Heading, Text, Link as ChakraLink, VStack } from '@chakra-ui/react'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'

const RegisterPage = () => {
  const router = useRouter()
  const { isLoaded, userId } = useAuth()
  
  // Redirect if user is already signed in
  useEffect(() => {
    if (isLoaded && userId) {
      router.push('/')
    }
  }, [isLoaded, userId, router])

  return (
    <Container maxW="md" py={12}>
      <VStack spacing={6} align="center">
        <Heading as="h1" size="xl">Create Account</Heading>
        <Text color="gray.600">Sign up to get started</Text>
        
        <Box w="full" borderRadius="md" overflow="hidden" boxShadow="md">
          <SignUp 
            path="/auth/register"
            routing="path"
            signInUrl="/auth/login"
            redirectUrl="/"
          />
        </Box>
        
        <Text fontSize="sm">
          Already have an account?{' '}
          <Link href="/auth/login" passHref>
            <ChakraLink color="brand.500">Sign in</ChakraLink>
          </Link>
        </Text>
      </VStack>
    </Container>
  )
}

export default RegisterPage