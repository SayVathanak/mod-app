import {
  Box,
  Heading,
  SimpleGrid,
  Link,
  Text,
  Flex,
  Icon,
  Button,
  VStack,
  HStack,
  Container,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { FaNewspaper, FaBook, FaMap, FaVideo, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { SignUpButton } from "@clerk/nextjs";

const MotionBox = motion(Box);

export default function Home() {
  const sections = [
    { name: "news", icon: FaNewspaper, description: "Stay updated with the latest news and stories" },
    { name: "books", icon: FaBook, description: "Explore our digital library of books and publications" },
    { name: "maps", icon: FaMap, description: "Discover interactive maps and geographical data" },
    { name: "videos", icon: FaVideo, description: "Watch educational and entertaining videos" },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        py={[10, 20]}
        px={6}
        textAlign="center"
        borderRadius="lg"
        mb={12}
        bgGradient="linear(to-b, dark.800, dark.900)"
      >
        <VStack spacing={6} maxW="800px" mx="auto">
          <Heading as="h1" size="2xl" bgGradient="linear(to-r, brand.500, teal.400)" bgClip="text">
            Your Gateway to Digital Media
          </Heading>
          <Text fontSize="xl" color="gray.300" maxW="600px">
            Explore a world of news, books, maps, and videos in one centralized platform.
            Access quality content anytime, anywhere.
          </Text>
          <HStack spacing={4} pt={4}>
            <Button
              as={NextLink}
              href="/news"
              size="lg"
              variant="solid"
              rightIcon={<Icon as={FaArrowRight} />}
              _hover={{ transform: "scale(1.05)", transition: "0.2s ease-in-out" }}
            >
              Explore Content
            </Button>
            <SignUpButton mode="modal">
              <Button size="lg" variant="outline">Sign Up</Button>
            </SignUpButton>
          </HStack>
        </VStack>
      </MotionBox>

      {/* Sections Grid */}
      <Container maxW="container.xl">
        <Heading mb={8} size="lg" color="white">
          Discover Our Collections
        </Heading>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
          {sections.map((section) => (
            <MotionBox key={section.name} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Link as={NextLink} href={`/${section.name}`} _hover={{ textDecoration: "none" }}>
                <Box
                  p={6}
                  borderRadius="lg"
                  bg="dark.800"
                  borderWidth="1px"
                  borderColor="dark.700"
                  height="100%"
                  _hover={{ boxShadow: "0 0 15px rgba(47, 158, 47, 0.3)" }}
                  transition="all 0.3s ease"
                >
                  <Flex direction="column" align="center" textAlign="center">
                    <Icon as={section.icon} fontSize="3xl" color="brand.500" mb={4} />
                    <Heading size="md" textTransform="capitalize" mb={3}>
                      {section.name}
                    </Heading>
                    <Text color="gray.400" fontSize="sm">
                      {section.description}
                    </Text>
                  </Flex>
                </Box>
              </Link>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
