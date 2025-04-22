// pages/news/index.tsx - Enhanced with magazine-style layout
import { useEffect, useState } from "react";
import {
    Box,
    Heading,
    Text,
    Image,
    Link,
    Spinner,
    Flex,
    Grid,
    GridItem,
    Icon,
    Badge,
    HStack,
    useBreakpointValue,
    Container,
    Divider,
    SimpleGrid,
    Input,
    InputGroup,
    InputRightElement,
    Button,
    Tag,
    TagLabel,
    VStack,
    Avatar,
    LinkBox,
    LinkOverlay
} from "@chakra-ui/react";
import NextLink from "next/link";
import { FaCalendarAlt, FaArrowRight, FaSearch, FaUser, FaClock, FaTag, FaExclamationCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import Head from "next/head";
import { KhmerTitle } from "@/components/shared/KhmerTitle";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

// Custom color palette - Military dark theme
const colors = {
    darkBg: "#0A0D0B", // Very dark green/black
    darkBgAlt: "#121A14", // Slightly lighter dark green
    darkGreen: "#1A2C1F", // Dark green
    midGreen: "#264D33", // Medium green
    lightGreen: "#3E7E50", // Light green accent
    gold: "#BFA46F", // Military gold
    brightGold: "#D4B86A", // Brighter gold for highlights
    mutedGold: "#8F7B4E", // Muted gold for secondary elements
    textLight: "#E0E0E0", // Light text
    textMuted: "#A0A0A0", // Muted text
};

type NewsItem = {
    _id: string;
    title: string;
    body: string;
    imageUrl?: string;
    createdAt?: string;
    category?: string;
    author?: string;
    readTime?: string;
};

// Function to estimate read time
const getReadTime = (text: string) => {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
};

// Function to format date
const formatDate = (dateString?: string) => {
    if (!dateString) return "Recent";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function NewsPage() {
    const [newsList, setNewsList] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [featured, setFeatured] = useState<NewsItem | null>(null);
    const [trending, setTrending] = useState<NewsItem[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const fetchNews = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch("/api/news");

            if (!res.ok) {
                throw new Error(`Failed to fetch news: ${res.status}`);
            }

            const data = await res.json();  

            // Extract categories
            const allCategories = [...new Set(data.map((item: NewsItem) => item.category).filter(Boolean))];
            // setCategories(allCategories);

            // Set the first item as featured, next 3 as trending, and rest as regular news
            if (data.length > 0) {
                setFeatured(data[0]);

                // Set trending news (items 2-4)
                if (data.length > 1) {
                    setTrending(data.slice(1, Math.min(4, data.length)));
                }

                // Regular news list (skip featured and trending)
                setNewsList(data.slice(Math.min(4, data.length)));
            } else {
                setNewsList([]);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching news:", error);
            setError("Failed to load news content. Please try again later.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    // Filter news based on search and category
    const filteredNews = newsList.filter(item => {
        const matchesSearch = !searchQuery ||
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.body.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = !selectedCategory || item.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const columnCount = useBreakpointValue({ base: 1, md: 2, lg: 3 });

    if (loading) {
        return (
            <Flex justify="center" align="center" height="50vh">
                <Spinner size="xl" color={colors.gold} thickness="4px" />
            </Flex>
        );
    }

    if (error) {
        return (
            <Flex direction="column" justify="center" align="center" height="50vh">
                <Icon as={FaExclamationCircle} color="red.500" boxSize={12} mb={4} />
                <Text color={colors.textLight} fontSize="xl" textAlign="center">{error}</Text>
                <Button
                    mt={6}
                    colorScheme="green"
                    bg={colors.midGreen}
                    color={colors.brightGold}
                    onClick={fetchNews}
                    _hover={{ bg: colors.lightGreen }}
                >
                    Try Again
                </Button>
            </Flex>
        );
    }

    return (
        <>
            <Head>
                <title>Ministry of National Defense</title>
                <meta name="description" content="Stay updated with the latest news from Ministry of National Defense" />
            </Head>

            <Box bg={colors.darkBg} pt={8} pb={16} minH="100vh">
                <Container maxW="container.xl">
                    {/* Header Section */}
                    <MotionBox
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        mb={10}
                    >
                        <KhmerTitle
                            mb={4}
                            size="lg"
                            color={colors.gold}
                            textAlign="center"
                        >
                            ព័មានទូទៅ
                        </KhmerTitle>
                        <Box width="120px" height="2px" bg={colors.brightGold} mx="auto" mb={8} />

                        {/* Search and Filter Section */}
                        <Flex
                            direction={{ base: "column", md: "row" }}
                            justify="space-between"
                            align={{ base: "stretch", md: "center" }}
                            gap={4}
                            p={5}
                            borderRadius="lg"
                            bg={colors.darkBgAlt}
                            borderWidth="1px"
                            borderColor={colors.midGreen}
                        >
                            <InputGroup maxW={{ base: "100%", md: "400px" }}>
                                <Input
                                    placeholder="Search articles..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    bg={colors.darkGreen}
                                    borderColor={colors.midGreen}
                                    color={colors.textLight}
                                    _placeholder={{ color: colors.textMuted }}
                                    _hover={{ borderColor: colors.gold }}
                                    _focus={{ borderColor: colors.brightGold, boxShadow: `0 0 0 1px ${colors.brightGold}` }}
                                />
                                <InputRightElement>
                                    <Icon as={FaSearch} color={colors.gold} />
                                </InputRightElement>
                            </InputGroup>

                            <HStack spacing={2} overflow="auto" pb={2} flexWrap={{ base: "wrap", lg: "nowrap" }}>
                                <Tag
                                    size="md"
                                    borderRadius="full"
                                    cursor="pointer"
                                    variant={!selectedCategory ? "solid" : "outline"}
                                    bg={!selectedCategory ? colors.midGreen : "transparent"}
                                    borderColor={colors.midGreen}
                                    color={!selectedCategory ? colors.brightGold : colors.gold}
                                    onClick={() => setSelectedCategory("")}
                                    _hover={{ bg: colors.darkGreen }}
                                >
                                    <TagLabel>All</TagLabel>
                                </Tag>
                                {categories.map(category => (
                                    <Tag
                                        key={category}
                                        size="md"
                                        borderRadius="full"
                                        cursor="pointer"
                                        variant={selectedCategory === category ? "solid" : "outline"}
                                        bg={selectedCategory === category ? colors.midGreen : "transparent"}
                                        borderColor={colors.midGreen}
                                        color={selectedCategory === category ? colors.brightGold : colors.gold}
                                        onClick={() => setSelectedCategory(category)}
                                        _hover={{ bg: colors.darkGreen }}
                                    >
                                        <TagLabel>{category}</TagLabel>
                                    </Tag>
                                ))}
                            </HStack>
                        </Flex>
                    </MotionBox>

                    {/* Featured Article - Hero Section */}
                    {featured && (
                        <MotionBox
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            mb={10}
                        >
                            <Link
                                as={NextLink}
                                href={`/news/${featured._id}`}
                                _hover={{ textDecoration: "none" }}
                                passHref
                            >
                                <Box position="relative" cursor="pointer">
                                    {/* Desktop Layout */}
                                    <Box
                                        display={{ base: "none", md: "block" }}
                                        position="relative"
                                        borderRadius="xl"
                                        overflow="hidden"
                                        height="500px"
                                        boxShadow="0 10px 30px rgba(0,0,0,0.3)"
                                    >
                                        <Image
                                            src={featured.imageUrl || "/default-news.jpg"}
                                            alt={featured.title}
                                            objectFit="cover"
                                            w="100%"
                                            h="100%"
                                        />
                                        <Box
                                            position="absolute"
                                            bottom={0}
                                            left={0}
                                            right={0}
                                            p={8}
                                            bgGradient="linear(to-t, rgba(0,0,0,0.9), rgba(0,0,0,0.5), transparent)"
                                        >
                                            <Badge
                                                bg={colors.midGreen}
                                                color={colors.brightGold}
                                                mb={3}
                                                px={3}
                                                py={1}
                                                borderRadius="full"
                                                fontWeight="bold"
                                            >
                                                FEATURED
                                            </Badge>
                                            {featured.category && (
                                                <Badge
                                                    colorScheme="green"
                                                    mb={3}
                                                    ml={2}
                                                    bg={colors.darkGreen}
                                                    color={colors.gold}
                                                >
                                                    {featured.category}
                                                </Badge>
                                            )}
                                            <Heading size="xl" color="white" mb={3} textShadow="0 2px 4px rgba(0,0,0,0.7)">
                                                {featured.title}
                                            </Heading>
                                            <Text color="gray.300" noOfLines={2} fontSize="lg" mb={4} maxW="800px">
                                                {featured.body}
                                            </Text>
                                            <HStack spacing={6} color={colors.textLight} fontSize="sm">
                                                <Flex align="center">
                                                    <Avatar size="xs" mr={2} name={featured.author || "Staff"} />
                                                    <Text>{featured.author || "Staff"}</Text>
                                                </Flex>
                                                <Flex align="center">
                                                    <Icon as={FaCalendarAlt} mr={2} />
                                                    <Text>{formatDate(featured.createdAt)}</Text>
                                                </Flex>
                                                <Flex align="center">
                                                    <Icon as={FaClock} mr={2} />
                                                    <Text>{featured.readTime || getReadTime(featured.body)}</Text>
                                                </Flex>
                                                <Button
                                                    rightIcon={<FaArrowRight />}
                                                    variant="outline"
                                                    size="sm"
                                                    color={colors.brightGold}
                                                    borderColor={colors.brightGold}
                                                    _hover={{ bg: colors.midGreen }}
                                                >
                                                    Read More
                                                </Button>
                                            </HStack>
                                        </Box>
                                    </Box>

                                    {/* Mobile Layout */}
                                    <Box
                                        display={{ base: "block", md: "none" }}
                                        borderRadius="xl"
                                        overflow="hidden"
                                        bg={colors.darkBgAlt}
                                        borderWidth="1px"
                                        borderColor={colors.midGreen}
                                    >
                                        <Box height="220px" position="relative">
                                            <Image
                                                src={featured.imageUrl || "/default-news.jpg"}
                                                alt={featured.title}
                                                objectFit="cover"
                                                w="100%"
                                                h="100%"
                                            />
                                            <Badge
                                                position="absolute"
                                                top={4}
                                                left={4}
                                                bg={colors.midGreen}
                                                color={colors.brightGold}
                                                px={2}
                                                py={1}
                                                borderRadius="md"
                                            >
                                                FEATURED
                                            </Badge>
                                        </Box>
                                        <Box p={4}>
                                            {featured.category && (
                                                <Badge
                                                    mb={2}
                                                    bg={colors.darkGreen}
                                                    color={colors.gold}
                                                >
                                                    {featured.category}
                                                </Badge>
                                            )}
                                            <Heading size="md" mb={2} color={colors.textLight}>
                                                {featured.title}
                                            </Heading>
                                            <Text color={colors.textMuted} noOfLines={2} fontSize="sm" mb={3}>
                                                {featured.body}
                                            </Text>
                                            <HStack fontSize="xs" color={colors.textMuted} spacing={4}>
                                                <Text>{featured.author || "Staff"}</Text>
                                                <Text>{formatDate(featured.createdAt)}</Text>
                                            </HStack>
                                        </Box>
                                    </Box>
                                </Box>
                            </Link>
                        </MotionBox>
                    )}

                    {/* Trending News - 3 Column Row */}
                    {trending.length > 0 && (
                        <Box mb={12}>
                            <Flex align="center" mb={6}>
                                <Box width="5px" height="24px" bg={colors.brightGold} mr={3} />
                                <Heading size="md" color={colors.gold}>Trending Now</Heading>
                            </Flex>

                            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                                {trending.map((item, index) => (
                                    <MotionBox
                                        key={item._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                        as={Box}
                                        borderWidth="1px"
                                        borderRadius="lg"
                                        overflow="hidden"
                                        bg={colors.darkBgAlt}
                                        borderColor={colors.midGreen}
                                        _hover={{
                                            transform: "translateY(-5px)",
                                            boxShadow: "xl",
                                            borderColor: colors.gold
                                        }}
                                        transitionProperty="all"
                                        transitionDuration="0.3s"
                                    >
                                        <Link
                                            as={NextLink}
                                            href={`/news/${item._id}`}
                                            passHref
                                            _hover={{ textDecoration: "none" }}
                                        >
                                            {item.imageUrl && (
                                                <Box height="180px" overflow="hidden">
                                                    <Image
                                                        src={item.imageUrl || "/default-news.jpg"}
                                                        alt={item.title}
                                                        objectFit="cover"
                                                        w="100%"
                                                        h="100%"
                                                        transition="transform 0.3s ease"
                                                        _groupHover={{ transform: "scale(1.05)" }}
                                                    />
                                                </Box>
                                            )}
                                            <Box p={5}>
                                                {item.category && (
                                                    <Badge
                                                        bg={colors.darkGreen}
                                                        color={colors.gold}
                                                        mb={2}
                                                    >
                                                        {item.category}
                                                    </Badge>
                                                )}
                                                <Heading size="md" mb={2} color={colors.textLight}>
                                                    {item.title}
                                                </Heading>
                                                <Text color={colors.textMuted} noOfLines={3} mb={4}>
                                                    {item.body}
                                                </Text>
                                                <HStack justifyContent="space-between" color={colors.textMuted} fontSize="sm">
                                                    <Flex align="center">
                                                        <Icon as={FaUser} mr={1} />
                                                        <Text>{item.author || "Staff"}</Text>
                                                    </Flex>
                                                    <Flex align="center">
                                                        <Icon as={FaClock} mr={1} />
                                                        <Text>{item.readTime || getReadTime(item.body)}</Text>
                                                    </Flex>
                                                </HStack>
                                            </Box>
                                        </Link>
                                    </MotionBox>
                                ))}
                            </SimpleGrid>
                        </Box>
                    )}

                    {/* Latest News Grid */}
                    <Box mb={10}>
                        <Flex align="center" justify="space-between" mb={6}>
                            <Flex align="center">
                                <Box width="5px" height="24px" bg={colors.brightGold} mr={3} />
                                <Heading size="md" color={colors.gold}>Latest News</Heading>
                            </Flex>
                            {selectedCategory && (
                                <Badge colorScheme="green" fontSize="md" bg={colors.midGreen} color={colors.brightGold}>
                                    {selectedCategory}
                                </Badge>
                            )}
                        </Flex>

                        {filteredNews.length === 0 ? (
                            <Box
                                bg={colors.darkBgAlt}
                                p={8}
                                borderRadius="md"
                                textAlign="center"
                                borderWidth="1px"
                                borderColor={colors.midGreen}
                            >
                                <Icon as={FaSearch} boxSize={10} color={colors.mutedGold} mb={4} />
                                <Heading size="md" mb={2} color={colors.textLight}>No news articles found</Heading>
                                <Text color={colors.textMuted}>
                                    {searchQuery ? "Try adjusting your search terms" : "No news articles are available in this category right now"}
                                </Text>
                                {searchQuery && (
                                    <Button
                                        mt={4}
                                        variant="outline"
                                        color={colors.gold}
                                        borderColor={colors.midGreen}
                                        _hover={{ bg: colors.darkGreen }}
                                        onClick={() => setSearchQuery("")}
                                    >
                                        Clear Search
                                    </Button>
                                )}
                            </Box>
                        ) : (
                            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                                {filteredNews.map((item, index) => (
                                    <MotionBox
                                        key={item._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <Link
                                            as={NextLink}
                                            href={`/news/${item._id}`}
                                            passHref
                                            _hover={{ textDecoration: "none" }}
                                        >
                                            <Flex
                                                direction={{ base: "column", sm: "row", md: "column" }}
                                                bg={colors.darkBgAlt}
                                                borderRadius="lg"
                                                overflow="hidden"
                                                borderWidth="1px"
                                                borderColor={colors.midGreen}
                                                h="100%"
                                                _hover={{
                                                    borderColor: colors.gold,
                                                    transform: "translateY(-3px)",
                                                    boxShadow: "md"
                                                }}
                                                transition="all 0.3s ease"
                                            >
                                                {item.imageUrl && (
                                                    <Box
                                                        w={{ base: "100%", sm: "40%", md: "100%" }}
                                                        h={{ base: "180px", sm: "auto", md: "180px" }}
                                                    >
                                                        <Image
                                                            src={item.imageUrl}
                                                            alt={item.title}
                                                            objectFit="cover"
                                                            w="100%"
                                                            h="100%"
                                                        />
                                                    </Box>
                                                )}
                                                <Box
                                                    p={4}
                                                    flex="1"
                                                    display="flex"
                                                    flexDirection="column"
                                                    justifyContent="space-between"
                                                >
                                                    <Box>
                                                        {item.category && (
                                                            <Badge
                                                                mb={2}
                                                                bg={colors.darkGreen}
                                                                color={colors.gold}
                                                            >
                                                                {item.category}
                                                            </Badge>
                                                        )}
                                                        <Heading size="sm" mb={2} color={colors.textLight}>
                                                            {item.title}
                                                        </Heading>
                                                        <Text fontSize="sm" color={colors.textMuted} noOfLines={2} mb={3}>
                                                            {item.body}
                                                        </Text>
                                                    </Box>

                                                    <HStack justifyContent="space-between" color={colors.textMuted} fontSize="xs">
                                                        <Text>{formatDate(item.createdAt)}</Text>
                                                        <Flex align="center">
                                                            <Icon as={FaClock} mr={1} />
                                                            <Text>{item.readTime || getReadTime(item.body)}</Text>
                                                        </Flex>
                                                    </HStack>
                                                </Box>
                                            </Flex>
                                        </Link>
                                    </MotionBox>
                                ))}
                            </SimpleGrid>
                        )}
                    </Box>
                </Container>
            </Box>
        </>
    );
}