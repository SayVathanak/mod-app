import { Box, Button, Flex, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Custom404() {
  const router = useRouter();
  const accentColor = useColorModeValue("brand.500", "brand.300");
  const textColor = useColorModeValue("gray.600", "gray.300");

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
        minH="70vh"
        py={12}
        px={4}
        textAlign="center"
      >
        {/* 404 Graphic */}
        <Box mb={6} position="relative">
          <Heading
            as="h1"
            size="4xl"
            fontWeight="bold"
            color={accentColor}
            lineHeight="1"
            opacity="0.1"
            fontSize={["150px", "200px", "250px"]}
          >
            404
          </Heading>
          <Heading
            as="h2"
            size="lg"
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            width="100%"
          >
            Page Not Found
          </Heading>
        </Box>
        
        <Box maxW="md" mb={8}>
          <Text fontSize="lg" color={textColor}>
            The page you're looking for doesn't exist or has been moved.
          </Text>
        </Box>
        
        <Flex gap={4}>
          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            Go Back
          </Button>
          <Button
            colorScheme="brand"
            onClick={() => router.push("/")}
          >
            Return Home
          </Button>
        </Flex>
      </Flex>
    </>
  );
}