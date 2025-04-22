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
  Grid,
  Link,
  Button,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
  useBreakpointValue,
  Badge,
  Stack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { FaNewspaper, FaBook, FaMap, FaVideo, FaSync } from "react-icons/fa";
import { motion } from "framer-motion";

const COLORS = {
  darkBg: "#0A0D0B",
  darkLayerOne: "#121712",
  darkLayerTwo: "#1A211C",
  darkBorder: "#2A332C",
  goldAccent: "#BFA46F",
  goldAccentHover: "#D4B86A",
  greenAccent: "#2C3B2D",
  greenAccentHover: "#3A4C3B",
  textPrimary: "#E5E5E0",
  textSecondary: "#A0A29E",
};

type ContentCount = {
  news: number;
  books: number;
  maps: number;
  videos: number;
};

type ActivityItem = {
  text: string;
  timestamp: string;
  type: string;
};

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

export default function AdminDashboard() {
  const [counts, setCounts] = useState<ContentCount>({ news: 0, books: 0, maps: 0, videos: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const fetchContentCounts = async () => {
    setLoading(true);
    setError(null);

    try {
      const [newsRes, booksRes, mapsRes, videosRes] = await Promise.all([
        fetch("/api/news"),
        fetch("/api/books"),
        fetch("/api/maps"),
        fetch("/api/videos")
      ]);

      if (!newsRes.ok || !booksRes.ok || !mapsRes.ok || !videosRes.ok) {
        throw new Error("Failed to fetch content data");
      }

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

      const now = new Date();
      setRecentActivity([
        {
          text: "New book 'Military Strategy' added",
          timestamp: new Date(now.getTime() - 1000 * 60 * 30).toLocaleString(),
          type: "books"
        },
        {
          text: "Video 'Combat Training' uploaded",
          timestamp: new Date(now.getTime() - 1000 * 60 * 120).toLocaleString(),
          type: "videos"
        },
        {
          text: "News article 'Field Operations Update' published",
          timestamp: new Date(now.getTime() - 1000 * 60 * 180).toLocaleString(),
          type: "news"
        },
        {
          text: "Map 'Tactical Terrain' updated",
          timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24).toLocaleString(),
          type: "maps"
        },
      ]);
    } catch (error) {
      console.error("Error fetching content counts:", error);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContentCounts();
  }, []);

  const icons = {
    news: FaNewspaper,
    books: FaBook,
    maps: FaMap,
    videos: FaVideo,
  };

  const typeColors = {
    news: "blue.400",
    books: "purple.400",
    maps: "green.400",
    videos: "red.400",
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <Box p={{ base: 0, md: 6 }}>
      {/* Header */}
      <Stack
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "stretch", md: "center" }}
        mb={{ base: 4, md: 8 }}
        spacing={{ base: 3, md: 0 }}
      >
        <Heading
          color={COLORS.textPrimary}
          size={{ base: "md", md: "lg" }}
          fontWeight="600"
          letterSpacing="0.5px"
        >
          Command Dashboard
        </Heading>
        <Button
          bg={COLORS.greenAccent}
          color={COLORS.textPrimary}
          leftIcon={<Icon as={FaSync} />}
          onClick={fetchContentCounts}
          isLoading={loading}
          size={{ base: "sm", md: "md" }}
          width={{ base: "full", md: "auto" }}
          _hover={{ bg: COLORS.greenAccentHover }}
          _active={{ bg: COLORS.greenAccent }}
        >
          Refresh Intel
        </Button>
      </Stack>

      {error && (
        <Alert status="error" mb={{ base: 4, md: 8 }} borderRadius="md" bg="#391C1C" color={COLORS.textPrimary}>
          <AlertIcon color="#FF5252" />
          {error}
        </Alert>
      )}

      {loading ? (
        <Flex justify="center" align="center" height={{ base: "200px", md: "300px" }}>
          <Spinner size="xl" color={COLORS.goldAccent} thickness="3px" />
        </Flex>
      ) : (
        <MotionFlex
          direction="column"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Stats Grid */}
          <MotionBox variants={itemVariants}>
            <SimpleGrid
              columns={{ base: 2, sm: 2, md: 4 }}
              spacing={{ base: 3, md: 4, lg: 6 }}
              mb={{ base: 5, md: 10 }}
            >
              {Object.entries(counts).map(([key, count]) => (
                <Stat
                  key={key}
                  as={NextLink}
                  href={`/admin/${key}`}
                  p={{ base: 3, md: 4, lg: 6 }}
                  borderRadius={{ base: "md", md: "lg" }}
                  boxShadow="md"
                  bg={COLORS.darkLayerOne}
                  borderWidth="1px"
                  borderColor={COLORS.darkBorder}
                  _hover={{
                    transform: "translateY(-3px)",
                    boxShadow: "lg",
                    borderColor: COLORS.goldAccent,
                  }}
                  transition="all 0.3s ease"
                >
                  <Flex justify="space-between" align="center">
                    <Box>
                      <StatLabel 
                        fontSize={{ base: "xs", md: "sm" }} 
                        textTransform="uppercase" 
                        letterSpacing="1px"
                        color={COLORS.textSecondary}
                      >
                        {key}
                      </StatLabel>
                      <StatNumber fontSize={{ base: "lg", md: "xl", lg: "2xl" }} color={COLORS.textPrimary}>
                        {count}
                      </StatNumber>
                    </Box>
                    <Icon
                      as={icons[key as keyof typeof icons]}
                      boxSize={{ base: 5, md: 6, lg: 8 }}
                      color={COLORS.goldAccent}
                    />
                  </Flex>
                </Stat>
              ))}
            </SimpleGrid>
          </MotionBox>

          {/* Content Sections */}
          <Grid
            templateColumns={{ base: "1fr", lg: "3fr 1fr" }}
            gap={{ base: 4, md: 6, lg: 8 }}
          >
            {/* Quick Access */}
            <MotionBox variants={itemVariants}>
              <Box
                p={{ base: 4, md: 6 }}
                borderRadius={{ base: "md", md: "lg" }}
                boxShadow="md"
                bg={COLORS.darkLayerOne}
                borderWidth="1px"
                borderColor={COLORS.darkBorder}
              >
                <Flex justify="space-between" align="center" mb={{ base: 4, md: 6 }}>
                  <Heading size={{ base: "md", md: "lg" }} color={COLORS.textPrimary}>
                    Content Management
                  </Heading>
                  {!isMobile && (
                    <Badge 
                      bg={COLORS.greenAccent} 
                      color={COLORS.textPrimary} 
                      px={3} 
                      py={1} 
                      borderRadius="full"
                    >
                      Quick Access
                    </Badge>
                  )}
                </Flex>
                <SimpleGrid 
                  columns={{ base: 2, sm: 2, md: 4, lg: 2, xl: 4 }} 
                  spacing={{ base: 3, md: 4 }}
                >
                  {["news", "books", "maps", "videos"].map((section) => (
                    <Link
                      key={section}
                      as={NextLink}
                      href={`/admin/${section}`}
                      p={{ base: 2, md: 3, lg: 4 }}
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor={COLORS.darkBorder}
                      display="flex"
                      alignItems="center"
                      justifyContent={{ base: "center", md: "flex-start" }}
                      bg={COLORS.darkLayerTwo}
                      _hover={{
                        textDecoration: "none",
                        bg: COLORS.greenAccent,
                        borderColor: COLORS.goldAccent,
                        transform: "translateY(-2px)",
                      }}
                      transition="all 0.2s ease"
                      textAlign={{ base: "center", md: "left" }}
                    >
                      <Icon
                        as={icons[section as keyof typeof icons]}
                        mr={{ base: 0, md: 3 }}
                        boxSize={{ base: 4, md: 5 }}
                        color={COLORS.goldAccent}
                      />
                      {!isMobile && (
                        <Text fontWeight="medium" fontSize={{ base: "sm", md: "md" }}>
                          {section.charAt(0).toUpperCase() + section.slice(1)}
                        </Text>
                      )}
                    </Link>
                  ))}
                </SimpleGrid>
              </Box>
            </MotionBox>

            {/* Recent Activity - Hidden on mobile */}
            {!isMobile && (
              <MotionBox variants={itemVariants}>
                <Box
                  p={{ base: 4, md: 6 }}
                  borderRadius={{ base: "md", md: "lg" }}
                  boxShadow="md"
                  bg={COLORS.darkLayerOne}
                  borderWidth="1px"
                  borderColor={COLORS.darkBorder}
                >
                  <Flex justify="space-between" align="center" mb={{ base: 4, md: 6 }}>
                    <Heading size={{ base: "md", md: "lg" }} color={COLORS.textPrimary}>
                      Recent Activity
                    </Heading>
                    <Badge 
                      bg={COLORS.greenAccent} 
                      color={COLORS.textPrimary} 
                      px={3} 
                      py={1} 
                      borderRadius="full"
                    >
                      Latest
                    </Badge>
                  </Flex>
                  <VStack spacing={{ base: 3, md: 4 }} align="stretch">
                    {recentActivity.map((activity, index) => (
                      <Box
                        key={index}
                        p={{ base: 3, md: 4 }}
                        borderRadius="md"
                        borderWidth="1px"
                        borderColor={COLORS.darkBorder}
                        bg={COLORS.darkLayerTwo}
                        _hover={{
                          borderColor: COLORS.goldAccent,
                          transform: "translateX(2px)"
                        }}
                        transition="all 0.2s ease"
                      >
                        <Flex align="center" mb={2}>
                          <Icon
                            as={icons[activity.type as keyof typeof icons]}
                            color={typeColors[activity.type as keyof typeof typeColors]}
                            mr={2}
                          />
                          <Text fontWeight="medium" color={COLORS.textPrimary}>
                            {activity.text}
                          </Text>
                        </Flex>
                        <Text fontSize="sm" color={COLORS.textSecondary}>
                          {activity.timestamp}
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                </Box>
              </MotionBox>
            )}
          </Grid>

          {/* Mobile-only Recent Activity */}
          {isMobile && (
            <MotionBox variants={itemVariants} mt={{ base: 4, md: 0 }}>
              <Box
                p={4}
                borderRadius="md"
                boxShadow="md"
                bg={COLORS.darkLayerOne}
                borderWidth="1px"
                borderColor={COLORS.darkBorder}
                mt={4}
              >
                <Heading size="md" mb={4} color={COLORS.textPrimary}>
                  Recent Activity
                </Heading>
                <VStack spacing={3} align="stretch">
                  {recentActivity.slice(0, 2).map((activity, index) => (
                    <Box
                      key={index}
                      p={3}
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor={COLORS.darkBorder}
                      bg={COLORS.darkLayerTwo}
                    >
                      <Flex align="center" mb={1}>
                        <Icon
                          as={icons[activity.type as keyof typeof icons]}
                          color={typeColors[activity.type as keyof typeof typeColors]}
                          mr={2}
                          boxSize={4}
                        />
                        <Text fontWeight="medium" color={COLORS.textPrimary} fontSize="sm">
                          {activity.text}
                        </Text>
                      </Flex>
                      <Text fontSize="xs" color={COLORS.textSecondary}>
                        {activity.timestamp}
                      </Text>
                    </Box>
                  ))}
                </VStack>
              </Box>
            </MotionBox>
          )}
        </MotionFlex>
      )}
    </Box>
  );
}