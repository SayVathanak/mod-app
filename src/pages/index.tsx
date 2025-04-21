import { useEffect, useState } from "react";
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
  Grid,
  GridItem,
  Image,
  Badge,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { FaNewspaper, FaBook, FaMap, FaVideo, FaArrowRight, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";
import { SignUpButton } from "@clerk/nextjs";

// Define interfaces for our news items
interface NewsItem {
  _id: string | number;
  title: string;
  body: string;
  category?: string;
  createdAt?: string;
  publishedAt?: string;
  imageUrl?: string;
}

const MotionBox = motion(Box);

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/news');

        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }

        const data = await response.json();

        // Sort by date (newest first) and limit to 4 items
        const sortedNews = data
          .sort((a: NewsItem, b: NewsItem) => {
            const dateA = new Date(a.createdAt || a.publishedAt || '').getTime();
            const dateB = new Date(b.createdAt || b.publishedAt || '').getTime();
            return dateB - dateA;
          })
          .slice(0, 4);

        setNews(sortedNews);
      } catch (error) {
        console.error("Failed to fetch news:", error);
        setError("Could not load the latest news");

        // Fallback to mock data if API fails
        const mockNews: NewsItem[] = [
          {
            _id: 1,
            title: "Progress Report on National Defense Strategy Implementation",
            body: "The Ministry of Defense announces significant progress in implementing the new national defense strategy...",
            category: "Defense",
            createdAt: "2025-04-20T12:00:00Z",
            imageUrl: "/images/news/defense-strategy.jpg"
          },
          // ... other mock items if needed
        ];

        setNews(mockNews);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

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
            <SignUpButton mode="modal">
              <Button size="lg" variant="outline">Sign Up</Button>
            </SignUpButton>
          </HStack>
        </VStack>
      </MotionBox>

      {/* Featured News Section */}
      <Container maxW="container.xl" mb={16}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg" color="white">
            Latest News
          </Heading>
          <Button
            as={NextLink}
            href="/news"
            size="sm"
            variant="ghost"
            rightIcon={<Icon as={FaArrowRight} />}
            _hover={{ color: "brand.400" }}
          >
            View All
          </Button>
        </Flex>

        {isLoading ? (
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6}>
            {[1, 2, 3, 4].map((item) => (
              <Box key={item} borderRadius="lg" overflow="hidden" bg="dark.800" height="100%">
                <Skeleton height="180px" />
                <Box p={4}>
                  <SkeletonText mt={2} noOfLines={1} spacing="4" />
                  <SkeletonText mt={4} noOfLines={3} spacing="4" />
                  <Skeleton height="20px" mt={4} width="100px" />
                </Box>
              </Box>
            ))}
          </Grid>
        ) : error ? (
          <Box textAlign="center" p={8} bg="dark.800" borderRadius="lg">
            <Text color="red.400">{error}</Text>
            <Button mt={4} colorScheme="green" size="sm" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </Box>
        ) : (
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6}>
            {news.map((item) => (
              <GridItem key={item._id}>
                <Link as={NextLink} href={`/news/${item._id}`} _hover={{ textDecoration: "none" }}>
                  <MotionBox
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                    borderRadius="lg"
                    overflow="hidden"
                    bg="dark.800"
                    borderWidth="1px"
                    borderColor="dark.700"
                    height="100%"
                    _hover={{ boxShadow: "0 0 15px rgba(47, 158, 47, 0.3)" }}
                  >
                    <Box position="relative" height="180px">
                      <Image
                        src={item.imageUrl || "/api/placeholder/400/320"}
                        alt={item.title}
                        objectFit="cover"
                        width="100%"
                        height="100%"
                        fallback={<Skeleton height="180px" />}
                      />
                      <Badge
                        position="absolute"
                        top="10px"
                        right="10px"
                        colorScheme="green"
                        borderRadius="md"
                      >
                        {item.category || "News"}
                      </Badge>
                    </Box>
                    <Box p={4}>
                      <Heading as="h3" size="md" mb={2} noOfLines={2}>
                        {item.title}
                      </Heading>
                      <Text color="gray.400" fontSize="sm" noOfLines={2} mb={3}>
                        {item.body}
                      </Text>
                      <Flex align="center" color="gray.500" fontSize="xs">
                        <Icon as={FaClock} mr={1} />
                        <Text>{formatDate(item.createdAt || item.publishedAt)}</Text>
                      </Flex>
                    </Box>
                  </MotionBox>
                </Link>
              </GridItem>
            ))}
          </Grid>
        )}
      </Container>

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