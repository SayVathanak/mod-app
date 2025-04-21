import { Box, Container, Flex, HStack, Text, Link as ChakraLink, Stack, IconButton } from '@chakra-ui/react'
import { FaGithub, FaTwitter, FaFacebook } from 'react-icons/fa'
import NextLink from 'next/link'

const Footer = () => {
  return (
    <Box as="footer" bg="gray.50" py={8} mt={8}>
      <Container maxW="container.xl">
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
          wrap="wrap"
        >
          <Text fontSize="sm" color="gray.600" mb={{ base: 4, md: 0 }}>
            &copy; {new Date().getFullYear()} MediaVerse. All rights reserved.
          </Text>

          <HStack spacing={6} mb={{ base: 4, md: 0 }}>
            <NextLink href="/about" passHref>
              <ChakraLink fontSize="sm" color="gray.600" _hover={{ color: 'brand.500' }}>
                About
              </ChakraLink>
            </NextLink>
            <NextLink href="/contact" passHref>
              <ChakraLink fontSize="sm" color="gray.600" _hover={{ color: 'brand.500' }}>
                Contact
              </ChakraLink>
            </NextLink>
            <NextLink href="/privacy" passHref>
              <ChakraLink fontSize="sm" color="gray.600" _hover={{ color: 'brand.500' }}>
                Privacy
              </ChakraLink>
            </NextLink>
          </HStack>

          <HStack spacing={4}>
            <IconButton
              as="a"
              href="https://github.com"
              target="_blank"
              aria-label="GitHub"
              icon={<FaGithub />}
              variant="ghost"
              color="gray.600"
              _hover={{ color: 'brand.500' }}
            />
            <IconButton
              as="a"
              href="https://twitter.com"
              target="_blank"
              aria-label="Twitter"
              icon={<FaTwitter />}
              variant="ghost"
              color="gray.600"
              _hover={{ color: 'brand.500' }}
            />
            <IconButton
              as="a"
              href="https://facebook.com"
              target="_blank"
              aria-label="Facebook"
              icon={<FaFacebook />}
              variant="ghost"
              color="gray.600"
              _hover={{ color: 'brand.500' }}
            />
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}

export default Footer
