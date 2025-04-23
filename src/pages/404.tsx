import { Box, Button, Container, Flex, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Head from "next/head";

const Custom404 = () => {
  const router = useRouter();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const accentColor = useColorModeValue("blue.500", "blue.300");

  return (
    <>
      <Head>
        <title>404 - Page Not Found</title>
        <meta name="description" content="The page you're looking for doesn't exist" />
      </Head>
      <Flex 
        direction="column" 
        alignItems="center" 
        justifyContent="center" 
        minH="100vh" 
        bg={bgColor}
        p={4}
      >
        <Container maxW="lg" textAlign="center">
          {/* 404 SVG */}
          <Box mb={8} w="full" maxW="200px" mx="auto">
            <svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M36.5 26H25L47.5 74H59L36.5 26Z" fill="currentColor" />
              <path d="M62 74V64L84 26H95L73 64H96V74H62Z" fill="currentColor" />
              <path d="M116.5 26H105L127.5 74H139L116.5 26Z" fill="currentColor" />
              <circle cx="158" cy="63" r="11" fill="currentColor" />
            </svg>
          </Box>
          
          <Heading 
            as="h1" 
            size="4xl" 
            color={accentColor} 
            mb={4}
          >
            Oops!
          </Heading>
          
          <Heading 
            as="h2" 
            size="lg" 
            fontWeight="medium" 
            mb={6}
          >
            This page has gone missing
          </Heading>
          
          <Text 
            fontSize="lg" 
            color={textColor} 
            mb={8}
          >
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </Text>
          
          <Button
            colorScheme="blue"
            size="lg"
            onClick={() => router.push("/")}
            px={8}
          >
            Return Home
          </Button>
        </Container>
      </Flex>
    </>
  );
};

export default Custom404;