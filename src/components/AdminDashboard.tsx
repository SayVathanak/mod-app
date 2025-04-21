import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Icon,
  Flex,
  Text,
  useColorModeValue,
  Grid,
  Link,
  Button,
  HStack,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { FaNewspaper, FaBook, FaMap, FaVideo, FaChartLine } from "react-icons/fa";

type ContentCount = {
  news: number;
  books: number;
  maps: number;
  videos: number;
};

export default function AdminDashboard() {
  const [counts, setCounts] = useState<ContentCount>({
    news: 0,
    books: 0,
    maps: 0,
    videos: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<string[]>([]);

  // Card styles
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const statCardHover = useColorModeValue("teal.50", "teal.900");

  // Mock function to fetch counts - replace with actual API calls
  const fetchContentCounts = async () => {
    setLoading(true);
    try {
      // In a real app, these would be API calls
      const newsRes = await fetch("/api/news");
      const booksRes = await fetch("/api/books");
      const mapsRes = await fetch("/api/maps");
      const videosRes = await fetch("/api/videos");

      const newsData = await newsRes.json();
      const booksData = await booksRes.json();
      const mapsData = await mapsRes.json();
      const videosData = await videosRes.json();

      setCounts({
        news: newsData.length,
        books: booksData.length,
        maps: mapsData.length,
        videos: videosData.length,
      });

      // Simulate recent activity
      setRecentActivity([
        "New book 'Digital Transformation' added",
        "Video 'Welcome Tutorial' uploaded",
        "News article 'Recent Updates' published",
        "Map 'Campus Guide' updated",
      ]);
    } catch (error) {
      console.error("Error fetching content counts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContentCounts();
  }, []);

  // Icons for each section
  const icons = {
    news: FaNewspaper,
    books: FaBook,
    maps: FaMap,
    videos: FaVideo,
  };

  return (
    <Box p={6} maxWidth="1400px" mx="auto">
      <Flex justify="space-between" align="center" mb={8}>
        <Heading>Admin Dashboard</Heading>
        <Button 
          colorScheme="teal" 
          leftIcon={<Icon as={FaChartLine} />}
          onClick={() => fetchContentCounts()}
          isLoading={loading}
        >
          Refresh Stats
        </Button>
      </Flex>

      {/* Content Stats */}
      <Grid 
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} 
        gap={6} 
        mb={10}
      >
        {Object.entries(counts).map(([key, count]) => (
          <Stat 
            key={key}
            as={NextLink} 
            href={`/admin/${key}`}
            p={5}
            borderRadius="lg"
            boxShadow="md"
            bg={cardBg}
            borderWidth="1px"
            borderColor={cardBorder}
            _hover={{ 
              transform: "translateY(-5px)", 
              boxShadow: "lg",
              bg: statCardHover,
              transition: "all 0.3s ease"
            }}
            cursor="pointer"
          >
            <Flex justify="space-between" align="center">
              <Box>
                <StatLabel fontSize="lg" textTransform="capitalize">{key}</StatLabel>
                <StatNumber fontSize="3xl">{count}</StatNumber>
              </Box>
              <Icon 
                as={icons[key as keyof typeof icons]} 
                boxSize={10} 
                color="teal.500" 
                opacity={0.8} 
              />
            </Flex>
          </Stat>
        ))}
      </Grid>

      {/* Quick Access & Recent Activity */}
      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
        {/* Quick Access Section */}
        <Box 
          p={6} 
          borderRadius="lg" 
          boxShadow="md" 
          bg={cardBg} 
          borderWidth="1px" 
          borderColor={cardBorder}
        >
          <Heading size="md" mb={6}>Content Management</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
            {["news", "books", "maps", "videos"].map((section) => (
              <Link 
                key={section} 
                as={NextLink} 
                href={`/admin/${section}`}
                p={4}
                borderRadius="md"
                borderWidth="1px"
                borderColor={cardBorder}
                display="flex"
                alignItems="center"
                _hover={{ 
                  textDecoration: "none", 
                  bg: "teal.500", 
                  color: "white",
                  transform: "translateY(-2px)",
                  transition: "all 0.2s ease"
                }}
              >
                <Icon 
                  as={icons[section as keyof typeof icons]} 
                  mr={3} 
                  boxSize={5} 
                />
                <Text fontWeight="medium">Manage {section}</Text>
              </Link>
            ))}
          </SimpleGrid>
        </Box>

        {/* Recent Activity */}
        <Box 
          p={6} 
          borderRadius="lg" 
          boxShadow="md" 
          bg={cardBg} 
          borderWidth="1px" 
          borderColor={cardBorder}
        >
          <Heading size="md" mb={6}>Recent Activity</Heading>
          <VStack spacing={4} align="stretch">
            {recentActivity.map((activity, index) => (
              <HStack 
                key={index} 
                p={3} 
                borderRadius="md" 
                borderWidth="1px" 
                borderColor={cardBorder}
                _hover={{ bg: "gray.50" }}
              >
                <Text>{activity}</Text>
              </HStack>
            ))}
          </VStack>
        </Box>
      </Grid>
    </Box>
  );
}