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
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  IconButton,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { FaNewspaper, FaBook, FaMap, FaVideo, FaChartLine, FaBars, FaHome, FaUser, FaCog } from "react-icons/fa";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

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
  const [error, setError] = useState<string | null>(null);
  const [recentActivity, setRecentActivity] = useState<Array<{text: string, timestamp: string}>>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Custom color scheme - dark with green accents
  const bgMain = "black";
  const cardBg = "gray.900";
  const cardBorder = "gray.800";
  const accentColor = "green.700"; // Dark green accent
  const accentHover = "green.600";
  const textColor = "gray.100";
  const subTextColor = "gray.400";
  const sidebarBg = "gray.950";
  const statCardHover = "gray.800";

  // Fetch content counts from APIs
  const fetchContentCounts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Make parallel requests to all content APIs
      const [newsRes, booksRes, mapsRes, videosRes] = await Promise.all([
        fetch("/api/news"),
        fetch("/api/books"),
        fetch("/api/maps"),
        fetch("/api/videos")
      ]);
      
      // Check for failed requests
      if (!newsRes.ok || !booksRes.ok || !mapsRes.ok || !videosRes.ok) {
        throw new Error("Failed to fetch content data");
      }
      
      // Parse JSON responses
      const newsData = await newsRes.json();
      const booksData = await booksRes.json();
      const mapsData = await mapsRes.json();
      const videosData = await videosRes.json();
      
      // Update counts state
      setCounts({
        news: newsData.length,
        books: booksData.length,
        maps: mapsData.length,
        videos: videosData.length,
      });
      
      // Create activity data (in a real app, this would come from an activity log API)
      const now = new Date();
      setRecentActivity([
        {
          text: "New book 'Digital Transformation' added",
          timestamp: new Date(now.getTime() - 1000 * 60 * 30).toLocaleString() // 30 minutes ago
        },
        {
          text: "Video 'Welcome Tutorial' uploaded",
          timestamp: new Date(now.getTime() - 1000 * 60 * 120).toLocaleString() // 2 hours ago
        },
        {
          text: "News article 'Recent Updates' published",
          timestamp: new Date(now.getTime() - 1000 * 60 * 180).toLocaleString() // 3 hours ago
        },
        {
          text: "Map 'Campus Guide' updated",
          timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24).toLocaleString() // 1 day ago
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

  // Icons for each section
  const icons = {
    news: FaNewspaper,
    books: FaBook,
    maps: FaMap,
    videos: FaVideo,
  };
  
  // Navigation items for sidebar
  const navItems = [
    { name: "Dashboard", icon: FaHome, path: "/admin" },
    { name: "News", icon: FaNewspaper, path: "/admin/news" },
    { name: "Books", icon: FaBook, path: "/admin/books" },
    { name: "Maps", icon: FaMap, path: "/admin/maps" },
    { name: "Videos", icon: FaVideo, path: "/admin/videos" },
    { name: "Settings", icon: FaCog, path: "/admin/settings" },
    { name: "User Management", icon: FaUser, path: "/admin/users" },
  ];

  // Animation variants
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
    <Flex bg={bgMain} color={textColor} direction={{ base: "column", md: "row" }}>
      {/* Mobile menu button */}
      <IconButton
        aria-label="Open menu"
        icon={<FaBars />}
        display={{ base: "flex", md: "none" }}
        position="fixed"
        top="4"
        left="4"
        zIndex="overlay"
        onClick={onOpen}
        bg={accentColor}
        color="white"
        _hover={{ bg: accentHover }}
      />
      
      {/* Sidebar for mobile (drawer) */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent bg={sidebarBg} color={textColor}>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" borderBottomColor="gray.800">Admin Panel</DrawerHeader>
          <DrawerBody p={0}>
            <VStack spacing={0} align="stretch">
              {navItems.map((item) => (
                <Link 
                  key={item.name} 
                  as={NextLink} 
                  href={item.path}
                  py={3}
                  px={4}
                  borderRadius="none"
                  borderBottomWidth="1px"
                  borderBottomColor="gray.800"
                  _hover={{ bg: accentColor, color: "white" }}
                  onClick={onClose}
                  display="flex"
                  alignItems="center"
                  fontWeight={item.path === "/admin" ? "bold" : "normal"}
                  bg={item.path === "/admin" ? accentColor : "transparent"}
                  color={item.path === "/admin" ? "white" : "inherit"}
                >
                  <Icon as={item.icon} mr={3} />
                  <Text>{item.name}</Text>
                </Link>
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      
      {/* Desktop sidebar */}
      <Box
        width="250px"
        bg={sidebarBg}
        height={{ md: "100vh" }}
        position="sticky"
        top="0"
        borderRightWidth="1px"
        borderRightColor="gray.800"
        display={{ base: "none", md: "block" }}
      >
        <VStack p={5} align="stretch" spacing={8}>
          <Heading size="md" textAlign="center" color="white">Admin Panel</Heading>
          <VStack spacing={2} align="stretch">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                as={NextLink} 
                href={item.path}
                py={3}
                px={4}
                borderRadius="md"
                _hover={{ bg: accentHover, color: "white" }}
                display="flex"
                alignItems="center"
                fontWeight={item.path === "/admin" ? "bold" : "normal"}
                bg={item.path === "/admin" ? accentColor : "transparent"}
                color={item.path === "/admin" ? "white" : "inherit"}
              >
                <Icon as={item.icon} mr={3} />
                <Text>{item.name}</Text>
              </Link>
            ))}
          </VStack>
        </VStack>
      </Box>
      
      {/* Main content */}
      <Box 
        flex="1" 
        p={{ base: 4, sm: 5, md: 6 }} 
        pt={{ base: 16, md: 6 }} /* Add padding-top for mobile to account for the menu button */
        overflowY="auto" 
        bg={bgMain}
        width="100%"
      >
        <Flex 
          justify="space-between" 
          align={{ base: "flex-start", sm: "center" }} 
          mb={6} 
          flexDirection={{ base: "column", sm: "row" }}
          gap={{ base: 4, sm: 0 }}
        >
          <Heading 
            color="white" 
            size={{ base: "lg", md: "xl" }}
          >
            Dashboard Overview
          </Heading>
          <Button 
            bg={accentColor}
            color="white"
            _hover={{ bg: accentHover }}
            leftIcon={<Icon as={FaChartLine} />}
            onClick={fetchContentCounts}
            isLoading={loading}
            size={{ base: "sm", md: "md" }}
            width={{ base: "full", sm: "auto" }}
          >
            Refresh Stats
          </Button>
        </Flex>
        
        {error && (
          <Alert status="error" mb={6} borderRadius="md" bg="red.900" color="white">
            <AlertIcon />
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Flex justify="center" align="center" height="200px">
            <Spinner size="xl" color={accentColor} thickness="4px" />
          </Flex>
        ) : (
          <MotionFlex
            direction="column"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Content Stats */}
            <MotionBox variants={itemVariants}>
              <SimpleGrid 
                columns={{ base: 1, sm: 2, lg: 4 }} 
                spacing={{ base: 4, md: 6 }} 
                mb={{ base: 6, md: 10 }}
              >
                {Object.entries(counts).map(([key, count]) => (
                  <Stat 
                    key={key}
                    as={NextLink} 
                    href={`/admin/${key}`}
                    p={{ base: 4, md: 5 }}
                    borderRadius="lg"
                    boxShadow="dark-lg"
                    bg={cardBg}
                    borderWidth="1px"
                    borderColor={cardBorder}
                    _hover={{ 
                      transform: "translateY(-5px)", 
                      boxShadow: "dark-lg",
                      bg: statCardHover,
                      borderColor: accentColor,
                      transition: "all 0.3s ease"
                    }}
                    cursor="pointer"
                  >
                    <Flex justify="space-between" align="center">
                      <Box>
                        <StatLabel fontSize={{ base: "md", md: "lg" }} textTransform="capitalize" color={subTextColor}>{key}</StatLabel>
                        <StatNumber fontSize={{ base: "2xl", md: "3xl" }} color="white">{count}</StatNumber>
                      </Box>
                      <Icon 
                        as={icons[key as keyof typeof icons]} 
                        boxSize={{ base: 8, md: 10 }} 
                        color={accentColor} 
                        opacity={0.9} 
                      />
                    </Flex>
                  </Stat>
                ))}
              </SimpleGrid>
            </MotionBox>

            {/* Quick Access & Recent Activity */}
            <Grid 
              templateColumns={{ base: "1fr", lg: "2fr 1fr" }} 
              gap={{ base: 4, md: 6 }}
            >
              {/* Quick Access Section */}
              <MotionBox 
                variants={itemVariants}
                p={{ base: 4, md: 6 }} 
                borderRadius="lg" 
                boxShadow="dark-lg" 
                bg={cardBg} 
                borderWidth="1px" 
                borderColor={cardBorder}
              >
                <Heading size="md" mb={{ base: 4, md: 6 }} color="white">Content Management</Heading>
                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={{ base: 3, md: 5 }}>
                  {["news", "books", "maps", "videos"].map((section) => (
                    <Link 
                      key={section} 
                      as={NextLink} 
                      href={`/admin/${section}`}
                      p={{ base: 3, md: 4 }}
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor={cardBorder}
                      bg="gray.800"
                      display="flex"
                      alignItems="center"
                      _hover={{ 
                        textDecoration: "none", 
                        bg: accentColor, 
                        color: "white",
                        transform: "translateY(-2px)",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <Icon 
                        as={icons[section as keyof typeof icons]} 
                        mr={3} 
                        boxSize={{ base: 4, md: 5 }} 
                        color={accentHover}
                      />
                      <Text fontWeight="medium">Manage {section}</Text>
                    </Link>
                  ))}
                </SimpleGrid>
              </MotionBox>

              {/* Recent Activity */}
              <MotionBox 
                variants={itemVariants}
                p={{ base: 4, md: 6 }} 
                borderRadius="lg" 
                boxShadow="dark-lg" 
                bg={cardBg} 
                borderWidth="1px" 
                borderColor={cardBorder}
              >
                <Heading size="md" mb={{ base: 4, md: 6 }} color="white">Recent Activity</Heading>
                <VStack spacing={{ base: 3, md: 4 }} align="stretch">
                  {recentActivity.map((activity, index) => (
                    <Box 
                      key={index} 
                      p={{ base: 2, md: 3 }} 
                      borderRadius="md" 
                      borderWidth="1px" 
                      borderColor={cardBorder}
                      bg="gray.800"
                      _hover={{ bg: "gray.700", borderColor: accentColor }}
                    >
                      <Text fontWeight="medium" color="white" fontSize={{ base: "sm", md: "md" }}>{activity.text}</Text>
                      <Text fontSize={{ base: "xs", md: "sm" }} color={subTextColor}>{activity.timestamp}</Text>
                    </Box>
                  ))}
                </VStack>
              </MotionBox>
            </Grid>
          </MotionFlex>
        )}
      </Box>
    </Flex>
  );
}  