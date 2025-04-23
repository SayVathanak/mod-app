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
import { FaCalendarAlt, FaArrowRight, FaSearch, FaUser, FaClock, FaTag, FaExclamationCircle, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import Head from "next/head";
import { KhmerTitle } from "@/components/shared/KhmerTitle";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

// Custom color palette
const colors = {
    darkBg: "#0A0D0B",
    darkBgAlt: "#121A14",
    darkGreen: "#1A2C1F",
    midGreen: "#264D33",
    lightGreen: "#3E7E50",
    gold: "#BFA46F",
    brightGold: "#D4B86A",
    mutedGold: "#8F7B4E",
    textLight: "#E0E0E0",
    textMuted: "#A0A0A0",
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
    const [editorsPicks, setEditorsPicks] = useState<NewsItem[]>([]);
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
            // const allCategories = [...new Set(data.map((item: NewsItem) => item.category).filter(Boolean))];
            // setCategories(allCategories);

            if (data.length > 0) {
                // Set the first item as featured
                setFeatured(data[0]);

                // Set trending news (items 2-4)
                if (data.length > 1) {
                    setTrending(data.slice(1, Math.min(4, data.length)));
                }

                // Select items 5-8 for editors picks if available
                if (data.length > 4) {
                    setEditorsPicks(data.slice(4, Math.min(8, data.length)));
                }

                // Regular news list (skip featured, trending, and editors picks)
                setNewsList(data.slice(Math.min(8, data.length)));
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

    const [showSearch, setShowSearch] = useState(false);

    const filteredNews = newsList.filter(item => {
        const matchesSearch = !searchQuery ||
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.body.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = !selectedCategory || item.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

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
                <title>ព័តមានទូទៅ | Ministry of National Defense</title>
                <meta name="description" content="Stay updated with the latest news from Ministry of National Defense" />
            </Head>

            <Box bg={colors.darkBg} pt={2} pb={16} minH="100vh">
                <Container maxW="container.xl">
                    {/* Header Section */}
                    <MotionBox
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        mb={5}
                    >
                        <Box
                            display="grid"
                            gridTemplateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }}
                            alignItems="center"
                            gap={4}
                        >
                            {/* Left Spacer */}
                            <Box display={{ base: "none", md: "block" }} />

                            {/* Center Title */}
                            <KhmerTitle
                                size="sm"
                                color={colors.gold}
                                textAlign="center"
                                mb={{ base: 0, md: 0 }}
                            >
                                ព័តមានទូទៅ
                                <Box
                                    width="120px"
                                    height="1px"
                                    bg={colors.brightGold}
                                    mx="auto"
                                    mt={2}
                                />
                            </KhmerTitle>

                            {/* Right Search Icon / Input */}
                            <Flex justify="flex-end" align="centre" display={{ base: "none", md: "block" }}>
                                {showSearch ? (
                                    <InputGroup maxW="300px">
                                        <Input
                                            borderColor={colors.midGreen}
                                            placeholder="Search articles..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            bg={colors.darkGreen}
                                            color={colors.textLight}
                                            _placeholder={{ color: colors.textMuted }}
                                            _hover={{ borderColor: colors.gold, bg: colors.darkGreen }}
                                            _focus={{
                                                borderColor: colors.brightGold,
                                                boxShadow: `0 0 0 1px ${colors.brightGold}`,
                                            }}
                                        />
                                        <InputRightElement>
                                            <Icon
                                                as={FaTimes}
                                                color={colors.gold}
                                                cursor="pointer"
                                                onClick={() => setShowSearch(false)}
                                            />
                                        </InputRightElement>
                                    </InputGroup>
                                ) : (
                                    <Icon
                                        as={FaSearch}
                                        boxSize={6}
                                        color={colors.gold}
                                        cursor="pointer"
                                        onClick={() => setShowSearch(true)}
                                    />
                                )}
                            </Flex>
                        </Box>
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
                                            <Text
                                                size="md"
                                                color="white"
                                                mb={3}
                                                textShadow="0 2px 4px rgba(0,0,0,0.7)"
                                                //fontFamily="Khmer Moul, sans-serif"
                                                fontFamily="'Kantumruy Pro', sans-serif"
                                            >
                                                {featured.title}
                                            </Text>
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
                                            <Text
                                                size="md"
                                                mb={2}
                                                color={colors.textLight}
                                                //fontFamily="Khmer Moul, sans-serif"
fontFamily="'Kantumruy Pro', sans-serif"
                                            >
                                                {featured.title}
                                            </Text>
                                            <Text color={colors.textMuted} noOfLines={2} fontFamily="'Kantumruy Pro', sans-serif" fontSize="sm" mb={3}>
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

                    {/* Top Articles - Grid Layout (NY Times style) */}
                    {trending.length > 0 && (
                        <Box mb={12}>
                            <Flex align="center" mb={6}>
                                <Box width="5px" height="24px" bg={colors.brightGold} mr={3} />
                                <KhmerTitle
                                    size="sm"
                                    color={colors.brightGold}
                                    //fontFamily="Khmer Moul, sans-serif"
                                >
                                    ព័ត៌មានថ្មីៗ
                                </KhmerTitle>
                            </Flex>

                            <Grid
                                templateColumns={{ base: "1fr", lg: "1fr 1px 1fr" }}
                                gap={{ base: 6, lg: 0 }}
                            >
                                {/* Left Column - Main Story */}
                                <GridItem>
                                    <MotionBox
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <Link
                                            as={NextLink}
                                            href={`/news/${trending[0]._id}`}
                                            _hover={{ textDecoration: "none" }}
                                            passHref
                                        >
                                            <Box
                                                pb={6}
                                                borderBottomWidth={{ base: "1px", lg: "0" }}
                                                borderColor={colors.midGreen}
                                            >
                                                {trending[0].imageUrl && (
                                                    <Box mb={4} borderRadius="md" overflow="hidden">
                                                        <Image
                                                            src={trending[0].imageUrl}
                                                            alt={trending[0].title}
                                                            w="100%"
                                                            h={{ base: "240px", md: "300px" }}
                                                            objectFit="cover"
                                                        />
                                                    </Box>
                                                )}

                                                {trending[0].category && (
                                                    <Badge
                                                        mb={2}
                                                        bg={colors.darkGreen}
                                                        color={colors.gold}
                                                    >
                                                        {trending[0].category}
                                                    </Badge>
                                                )}

                                                <Text
                                                    size="md"
                                                    mb={3}
                                                    color={colors.textLight}
                                                    fontFamily="Khmer Moul, sans-serif"
                                                >
                                                    {trending[0].title}
                                                </Text>

                                                <Text color={colors.textMuted} mb={4} noOfLines={3}>
                                                    {trending[0].body}
                                                </Text>

                                                <HStack color={colors.textMuted} fontSize="sm">
                                                    <Text>{trending[0].author || "Staff"}</Text>
                                                    <Text>•</Text>
                                                    <Text>{formatDate(trending[0].createdAt)}</Text>
                                                </HStack>
                                            </Box>
                                        </Link>
                                    </MotionBox>
                                </GridItem>

                                {/* Divider */}
                                <GridItem
                                    display={{ base: "none", lg: "block" }}
                                >
                                    <Box
                                        h="100%"
                                        bg={colors.midGreen}
                                        opacity={0.3}
                                    />
                                </GridItem>

                                {/* Right Column - List of Articles */}
                                <GridItem>
                                    <VStack
                                        spacing={6}
                                        align="stretch"
                                        pl={{ base: 0, lg: 6 }}
                                    >
                                        {trending.slice(1).map((item, index) => (
                                            <MotionBox
                                                key={item._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                            >
                                                <Link
                                                    as={NextLink}
                                                    href={`/news/${item._id}`}
                                                    _hover={{ textDecoration: "none" }}
                                                    passHref
                                                >
                                                    <Flex
                                                        gap={4}
                                                        pb={6}
                                                        borderBottomWidth={index < trending.length - 2 ? "1px" : "0"}
                                                        borderColor={colors.midGreen}
                                                    >
                                                        {item.imageUrl && (
                                                            <Box
                                                                flexShrink={0}
                                                                width={{ base: "100px", md: "120px" }}
                                                                height={{ base: "80px", md: "90px" }}
                                                                borderRadius="md"
                                                                overflow="hidden"
                                                            >
                                                                <Image
                                                                    src={item.imageUrl}
                                                                    alt={item.title}
                                                                    w="100%"
                                                                    h="100%"
                                                                    objectFit="cover"
                                                                />
                                                            </Box>
                                                        )}

                                                        <Box>
                                                            {item.category && (
                                                                <Badge
                                                                    size="sm"
                                                                    mb={1}
                                                                    bg={colors.darkGreen}
                                                                    color={colors.gold}
                                                                >
                                                                    {item.category}
                                                                </Badge>
                                                            )}

                                                            <Heading
                                                                size="sm"
                                                                mb={2}
                                                                color={colors.textLight}
                                                                fontFamily="Khmer Moul, sans-serif"
                                                            >
                                                                {item.title}
                                                            </Heading>

                                                            <HStack fontSize="xs" color={colors.textMuted}>
                                                                <Text>{formatDate(item.createdAt)}</Text>
                                                                <Text>•</Text>
                                                                <Text>{item.readTime || getReadTime(item.body)}</Text>
                                                            </HStack>
                                                        </Box>
                                                    </Flex>
                                                </Link>
                                            </MotionBox>
                                        ))}
                                    </VStack>
                                </GridItem>
                            </Grid>
                        </Box>
                    )}

                    {/* Editor's Picks - Magazine Style */}
                    {editorsPicks.length > 0 && (
                        <Box mb={12} py={8} bg={colors.darkBgAlt} borderRadius="lg">
                            <Container maxW="container.xl">
                                <HStack mb={6}>
                                    <Box
                                        bg={colors.brightGold}
                                        w="30px"
                                        h="30px"
                                        borderRadius="full"
                                        mr={3}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Icon as={FaTag} color={colors.darkGreen} />
                                    </Box>
                                    <Heading
                                        size="md"
                                        color={colors.brightGold}
                                        fontFamily="Khmer Moul, sans-serif"
                                    >
                                        ជ្រើសរើសដោយអ្នកនិពន្ធ
                                    </Heading>
                                </HStack>

                                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                                    {editorsPicks.map((item, index) => (
                                        <MotionBox
                                            key={item._id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.4, delay: index * 0.1 }}
                                        >
                                            <LinkBox
                                                bg={colors.darkGreen}
                                                borderRadius="lg"
                                                overflow="hidden"
                                                h="100%"
                                                _hover={{ transform: "translateY(-5px)" }}
                                                transition="all 0.3s ease"
                                            >
                                                {item.imageUrl && (
                                                    <Box h="160px">
                                                        <Image
                                                            src={item.imageUrl}
                                                            alt={item.title}
                                                            w="100%"
                                                            h="100%"
                                                            objectFit="cover"
                                                        />
                                                    </Box>
                                                )}

                                                <Box p={4}>
                                                    <LinkOverlay
                                                        as={NextLink}
                                                        href={`/news/${item._id}`}
                                                    >
                                                        <Text
                                                            size="md"
                                                            mb={2}
                                                            noOfLines={2}
                                                            color={colors.textLight}
                                                            //fontFamily="Khmer Moul, sans-serif"
                                                            fontFamily="'Kantumruy Pro', sans-serif"
                                                        >
                                                            {item.title}
                                                        </Text>
                                                    </LinkOverlay>

                                                    <Text
                                                        fontSize="sm"
                                                        color={colors.textMuted}
                                                        noOfLines={2}
                                                        mb={3}
                                                        fontFamily="'Kantumruy Pro', sans-serif"
                                                    >
                                                        {item.body}
                                                    </Text>

                                                    <HStack fontSize="xs" color={colors.textMuted}>
                                                        <Icon as={FaCalendarAlt} boxSize="10px" />
                                                        <Text>{formatDate(item.createdAt)}</Text>
                                                    </HStack>
                                                </Box>
                                            </LinkBox>
                                        </MotionBox>
                                    ))}
                                </SimpleGrid>
                            </Container>
                        </Box>
                    )}

                    {/* Latest News - Mixed Layout */}
                    <Box mb={10}>
                        <Flex align="center" justify="space-between" mb={6}>
                            <Flex align="center">
                                <Box width="5px" height="24px" bg={colors.brightGold} mr={3} />
                                <Heading
                                    size="md"
                                    color={colors.gold}
                                    fontFamily="Khmer Moul, sans-serif"
                                >
                                    ព័ត៌មានថ្មីបំផុត
                                </Heading>
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
                            <Grid
                                templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
                                gap={8}
                            >
                                {/* Main column - Featured items */}
                                <GridItem>
                                    <VStack spacing={8} align="stretch">
                                        {filteredNews.slice(0, 4).map((item, index) => (
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
                                                        direction={{ base: "column", sm: "row" }}
                                                        bg={colors.darkBgAlt}
                                                        borderRadius="lg"
                                                        overflow="hidden"
                                                        borderWidth="1px"
                                                        borderColor={colors.midGreen}
                                                        _hover={{
                                                            borderColor: colors.gold,
                                                            transform: "translateY(-3px)",
                                                            boxShadow: "md"
                                                        }}
                                                        transition="all 0.3s ease"
                                                    >
                                                        {item.imageUrl && (
                                                            <Box
                                                                w={{ base: "100%", sm: "40%" }}
                                                                h={{ base: "180px", sm: "auto" }}
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
                                                            p={5}
                                                            flex="1"
                                                        >
                                                            <Flex
                                                                justify="space-between"
                                                                mb={2}
                                                                align="center"
                                                            >
                                                                {item.category && (
                                                                    <Badge
                                                                        bg={colors.darkGreen}
                                                                        color={colors.gold}
                                                                    >
                                                                        {item.category}
                                                                    </Badge>
                                                                )}
                                                                <Text
                                                                    fontSize="xs"
                                                                    color={colors.textMuted}
                                                                >
                                                                    {formatDate(item.createdAt)}
                                                                </Text>
                                                            </Flex>

                                                            <Text
                                                                size="md"
                                                                mb={3}
                                                                color={colors.textLight}
                                                                //fontFamily="Khmer Moul, sans-serif"
fontFamily="'Kantumruy Pro', sans-serif"
                                                            >
                                                                {item.title}
                                                            </Text>

                                                            <Text
                                                                color={colors.textMuted}
                                                                noOfLines={2}
                                                                mb={4}
                                                            >
                                                                {item.body}
                                                            </Text>

                                                            <HStack>
                                                                <Flex align="center">
                                                                    <Avatar
                                                                        size="xs"
                                                                        mr={2}
                                                                        name={item.author || "Staff"}
                                                                    />
                                                                    <Text
                                                                        fontSize="sm"
                                                                        color={colors.textMuted}
                                                                    >
                                                                        {item.author || "Staff"}
                                                                    </Text>
                                                                </Flex>
                                                                <Text color={colors.textMuted}>•</Text>
                                                                <Flex align="center">
                                                                    <Icon as={FaClock} boxSize="10px" mr={1} />
                                                                    <Text
                                                                        fontSize="sm"
                                                                        color={colors.textMuted}
                                                                    >
                                                                        {item.readTime || getReadTime(item.body)}
                                                                    </Text>
                                                                </Flex>
                                                            </HStack>
                                                        </Box>
                                                    </Flex>
                                                </Link>
                                            </MotionBox>
                                        ))}
                                    </VStack>
                                </GridItem>

                                {/* Side column - Compact list */}
                                <GridItem display={{ base: "none", lg: "block" }}>
                                    <Box
                                        bg={colors.darkBgAlt}
                                        p={5}
                                        borderRadius="lg"
                                        borderWidth="1px"
                                        borderColor={colors.midGreen}
                                    >
                                        <Heading
                                            size="sm"
                                            mb={4}
                                            pb={2}
                                            borderBottomWidth="2px"
                                            borderColor={colors.gold}
                                            color={colors.brightGold}
                                            fontFamily="Khmer Moul, sans-serif"
                                        >
                                            ព័ត៌មានជាដំណឹង
                                        </Heading>

                                        <VStack spacing={4} align="stretch">
                                            {filteredNews.slice(4, Math.min(filteredNews.length, 10)).map((item, index) => (
                                                <MotionBox
                                                    key={item._id}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                                >
                                                    <Link
                                                        as={NextLink}
                                                        href={`/news/${item._id}`}
                                                        _hover={{ textDecoration: "none" }}
                                                    >
                                                        <Flex
                                                            pb={3}
                                                            borderBottomWidth={index < Math.min(filteredNews.length, 10) - 5 - 1 ? "1px" : "0"}
                                                            borderColor={colors.midGreen}
                                                            gap={3}
                                                            _hover={{ color: colors.gold }}
                                                        >
                                                            <Text color={colors.brightGold} fontWeight="bold">
                                                                {index + 1}.
                                                            </Text>
                                                            <Box>
                                                                <Text
                                                                    size="xs"
                                                                    mb={1}
                                                                    color={colors.textLight}
                                                                    fontFamily="Khmer Moul, sans-serif"
                                                                    _groupHover={{ color: colors.gold }}
                                                                >
                                                                    {item.title}
                                                                </Text>
                                                                <HStack fontSize="xs" color={colors.textMuted} spacing={2}>
                                                                    <Text>{formatDate(item.createdAt)}</Text>
                                                                    {item.category && (
                                                                        <>
                                                                            <Text>•</Text>
                                                                            <Text>{item.category}</Text>
                                                                        </>
                                                                    )}
                                                                </HStack>
                                                            </Box>
                                                        </Flex>
                                                    </Link>
                                                </MotionBox>
                                            ))}
                                        </VStack>

                                        {filteredNews.length > 10 && (
                                            <Button
                                                mt={6}
                                                size="sm"
                                                width="100%"
                                                variant="outline"
                                                borderColor={colors.midGreen}
                                                color={colors.gold}
                                                _hover={{ bg: colors.darkGreen }}
                                                rightIcon={<FaArrowRight />}
                                            >
                                                View More News
                                            </Button>
                                        )}
                                    </Box>

                                    {/* Newsletter Signup */}
                                    <Box
                                        mt={6}
                                        p={5}
                                        bg={colors.darkGreen}
                                        borderRadius="lg"
                                        borderWidth="1px"
                                        borderColor={colors.midGreen}
                                        position="relative"
                                        overflow="hidden"
                                    >
                                        <Box
                                            position="absolute"
                                            top="-20px"
                                            right="-20px"
                                            bg={colors.gold}
                                            opacity={0.1}
                                            w="100px"
                                            h="100px"
                                            borderRadius="full"
                                        />
                                        <Heading
                                            size="sm"
                                            mb={3}
                                            color={colors.brightGold}
                                            fontFamily="Khmer Moul, sans-serif"
                                        >
                                            ព័ត៌មានប្រចាំខែ
                                        </Heading>
                                        <Text
                                            fontSize="sm"
                                            mb={4}
                                            color={colors.textLight}
                                        >
                                            ចុះឈ្មោះដើម្បីទទួលបានព័ត៌មានថ្មីៗពីក្រសួងការពារជាតិ
                                        </Text>
                                        <Input
                                            placeholder="អ៊ីមែល"
                                            bg={colors.darkBgAlt}
                                            color={colors.textLight}
                                            borderColor={colors.midGreen}
                                            mb={3}
                                            _placeholder={{ color: colors.textMuted }}
                                            _hover={{ borderColor: colors.gold }}
                                            _focus={{ borderColor: colors.brightGold }}
                                        />
                                        <Button
                                            width="100%"
                                            colorScheme="green"
                                            bg={colors.gold}
                                            color={colors.darkGreen}
                                            _hover={{ bg: colors.brightGold }}
                                        >
                                            ចុះឈ្មោះ
                                        </Button>
                                    </Box>
                                </GridItem>
                            </Grid>
                        )}
                    </Box>

                    {/* More News - Grid Layout */}
                    {filteredNews.length > 4 && (
                        <Box display={{ base: "block", lg: "none" }} mt={10}>
                            <Flex align="center" mb={6}>
                                <Box width="5px" height="24px" bg={colors.brightGold} mr={3} />
                                <Heading
                                    size="md"
                                    color={colors.gold}
                                    fontFamily="Khmer Moul, sans-serif"
                                >
                                    ព័ត៌មានផ្សេងទៀត
                                </Heading>
                            </Flex>

                            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={6}>
                                {filteredNews.slice(4).map((item, index) => (
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
                                                direction="column"
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
                                                    <Box h="160px">
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
                                                        <Text
                                                            size="sm"
                                                            mb={2}
                                                            color={colors.textLight}
                                                            fontFamily="Khmer Moul, sans-serif"
                                                        >
                                                            {item.title}
                                                        </Text>
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
                        </Box>
                    )}
                </Container>
            </Box>
        </>
    );
}