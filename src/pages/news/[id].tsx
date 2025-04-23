// pages/news/[id].tsx
import { GetServerSideProps } from "next";
import Head from "next/head";
import {
    Box,
    Heading,
    Text,
    Image,
    Container,
    Flex,
    Icon,
    HStack,
    Badge,
    Link,
    Button,
    Divider,
    Avatar,
    useToast,
    Spinner,
    Grid,
    GridItem,
    VStack
} from "@chakra-ui/react";
import { FaCalendarAlt, FaArrowLeft, FaShare, FaBookmark } from "react-icons/fa";
import NextLink from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { NewsGrid } from "@/components/NewsGrid";
import { colors } from "@/theme/colors";

const MotionBox = motion(Box);

type NewsItem = {
    _id: string;
    title: string;
    body: string;
    imageUrl?: string;
    author?: string;
    createdAt?: string;
    category?: string;
    readTime?: string;
};

type Props = {
    news: NewsItem | null;
    relatedNews?: NewsItem[];
    error?: string;
};

export default function NewsDetailPage({ news: initialNews, relatedNews = [], error }: Props) {
    const router = useRouter();
    const toast = useToast();
    const [news, setNews] = useState(initialNews);
    const [isLoading, setIsLoading] = useState(false);
    const { id } = router.query;

    useEffect(() => {
        if (error) {
            toast({
                title: "Error",
                description: error,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }, [error, toast]);

    useEffect(() => {
        // Client-side fallback if SSR fails
        const fetchNews = async () => {
            if (!news && !error && id) {
                try {
                    setIsLoading(true);
                    const res = await fetch(`/api/news/${id}`);
                    if (!res.ok) throw new Error(res.statusText);
                    const data = await res.json();
                    setNews(data);
                } catch (err) {
                    toast({
                        title: "Error",
                        description: "Failed to load article",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchNews();
    }, [id, news, error, toast]);

    const getReadTime = (text: string) => {
        const wordsPerMinute = 200;
        const wordCount = text.trim().split(/\s+/).length;
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return `${minutes} min read`;
    };

    if (isLoading) {
        return (
            <Container maxW="container.xl" py={16} centerContent>
                <Spinner size="xl" thickness="4px" speed="0.65s" />
                <Text mt={4}>Loading article...</Text>
            </Container>
        );
    }

    if (!news) {
        return (
            <Container maxW="container.xl">
                <Box textAlign="center">
                    <Heading mb={4} color="red.500">Article Not Found</Heading>
                    <Text mb={8}>The news article you're looking for could not be found.</Text>
                    <Button
                        as={NextLink}
                        href="/news"
                        colorScheme="brand"
                        leftIcon={<FaArrowLeft />}
                    >
                        Back to News
                    </Button>
                </Box>
            </Container>
        );
    }

    // Format date if it exists
    const formattedDate = news.createdAt
        ? new Date(news.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : "Recent";

    return (
        <>
            <Head>
                <title>{news.title} | Ministry of National Defense</title>
                <meta name="description" content={news.body.slice(0, 150)} />
                <meta property="og:title" content={`${news.title} | Ministry of National Defense`} />
                <meta property="og:description" content={news.body.slice(0, 150)} />
                {news.imageUrl && <meta property="og:image" content={news.imageUrl} />}
            </Head>

            <Container maxW="container.xl" px={{ base: 4, md: 8 }}>
                <Grid
                    templateColumns={{ base: "1fr", lg: "3fr 2fr" }}
                    gap={{ base: 0, lg: 10 }}
                >
                    {/* Main Content Column */}
                    <GridItem>
                        <MotionBox
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            maxW={{ base: "100%", lg: "100%" }}
                        >
                            <Link as={NextLink} href="/news">
                                <Button
                                    variant="ghost"
                                    leftIcon={<FaArrowLeft />}
                                    mb={6}
                                    color={colors.gold}
                                    _hover={{ bg: colors.darkGreen }}
                                    size={{ base: "sm", md: "md" }}
                                >
                                    Back to News
                                </Button>
                            </Link>

                            {news.category && (
                                <Badge
                                    bg={colors.darkGreen}
                                    color={colors.brightGold}
                                    mb={4}
                                    fontSize={{ base: "xs", md: "sm" }}
                                    px={2}
                                    py={1}
                                >
                                    {news.category}
                                </Badge>
                            )}

                            <Heading
                                as="h1"
                                mb={6}
                                fontSize={{ base: "md", md: "xl"}}
                                lineHeight="1.2"
                                fontFamily={"Khmer Moul"}
                                color={colors.gold}
                            >
                                {news.title}
                            </Heading>

                            {news.imageUrl && (
                                <Box
                                    mb={8}
                                    borderRadius="lg"
                                    overflow="hidden"
                                    boxShadow="dark-lg"
                                    position="relative"
                                    minH={{ base: "200px", md: "400px" }}
                                >
                                    <Image
                                        src={news.imageUrl}
                                        alt={news.title}
                                        w="100%"
                                        h="auto"
                                        objectFit="cover"
                                        fallback={
                                            <Flex
                                                h={{ base: "200px", md: "400px" }}
                                                bg={colors.darkBg}
                                                align="center"
                                                justify="center"
                                            >
                                                <Text>Image not available</Text>
                                            </Flex>
                                        }
                                    />
                                </Box>
                            )}

                            <Box
                                fontSize={{ base: "xs", md: "sm" }}
                                color={colors.textLight}
                                whiteSpace="pre-wrap"
                                lineHeight="1.8"
                                className="article-content"
                            >
                                {news.body.split('\n').map((paragraph, idx) => (
                                    <Text key={idx} mb={4} fontFamily="'Kantumruy Pro', sans-serif">
                                        {paragraph}
                                    </Text>
                                ))}
                            </Box>
                            <Flex
                                flexWrap="wrap"
                                justify="space-between"
                                mb={{ base: 4, md: 6 }}
                                align="center"
                                bg={colors.darkBgAlt}
                                p={{ base: 3, md: 4 }}
                                borderRadius="md"
                                width="100%"
                                gap={3}
                            >
                                <HStack spacing={3} width={{ base: "auto", sm: "auto" }}>
                                    <Avatar
                                        size={{ base: "xs", md: "sm" }}
                                        name={news.author || "Author"}
                                        bg={colors.midGreen}
                                    />
                                    <Box>
                                        <Text
                                            fontSize={{ base: "xs", md: "xs" }}
                                            fontFamily="'Kantumruy Pro', sans-serif"
                                            color={colors.textLight}
                                        >
                                            {news.author || "Say Vathanak"}
                                        </Text>
                                        <HStack fontSize={{ base: "2xs", md: "xs" }} color={colors.textMuted} spacing={1}>
                                            <Icon as={FaCalendarAlt} boxSize={{ base: "8px", md: "10px" }} />
                                            <Text fontFamily="'Kantumruy Pro', sans-serif">{formattedDate}</Text>
                                            {news.readTime && (
                                                <>
                                                    <Text>•</Text>
                                                    <Text fontFamily="'Kantumruy Pro', sans-serif">{news.readTime}</Text>
                                                </>
                                            )}
                                        </HStack>
                                    </Box>
                                </HStack>

                                <HStack
                                    spacing={3}
                                    width={{ base: "auto", sm: "auto" }}
                                    justify="flex-end"
                                >
                                    <Icon
                                        as={FaShare}
                                        color={colors.textMuted}
                                        cursor="pointer"
                                        _hover={{ color: colors.brightGold }}
                                        boxSize={{ base: "14px", md: "16px" }}
                                    />
                                    <Icon
                                        as={FaBookmark}
                                        color={colors.textMuted}
                                        cursor="pointer"
                                        _hover={{ color: colors.brightGold }}
                                        boxSize={{ base: "14px", md: "16px" }}
                                    />
                                </HStack>
                            </Flex>

                            <Divider my={10} opacity={0.3} />

                            <Flex justify="space-between" align="center" mb={8}>
                                <Button
                                    variant="outline"
                                    isDisabled
                                    borderColor={colors.midGreen}
                                    color={colors.gold}
                                    _hover={{ bg: colors.darkGreen }}
                                >
                                    Previous Article
                                </Button>
                                <Button
                                    variant="outline"
                                    isDisabled
                                    borderColor={colors.midGreen}
                                    color={colors.gold}
                                    _hover={{ bg: colors.darkGreen }}
                                >
                                    Next Article
                                </Button>
                            </Flex>

                            {/* Mobile-only Related News Section */}
                            <Box display={{ base: "block", lg: "none" }} mt={10}>
                                <Text
                                    as="h3"
                                    size="md"
                                    mb={6}
                                    color={colors.gold}
                                    fontFamily="'Kantumruy Pro', sans-serif"
                                >
                                    ព័តមានទាក់ទង
                                </Text>
                                <NewsGrid
                                    newsItems={relatedNews}
                                    getReadTime={getReadTime}
                                    limit={4}
                                />
                            </Box>
                        </MotionBox>
                    </GridItem>

                    {/* Right Sidebar - Related News */}
                    <GridItem display={{ base: "none", lg: "block" }}>
                        <MotionBox
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            position="sticky"
                            top="100px"
                        >
                            <VStack align="stretch" spacing={6}>
                                <Box>
                                    <Text
                                        as="h3"
                                        size="md"
                                        fontSize={{ base: "md", md: "xl" }}
                                        fontWeight={"medium"}
                                        mb={4}
                                        pb={2}
                                        borderBottom="2px solid"
                                        borderColor={colors.brightGold}
                                        color={colors.gold}
                                        fontFamily="'Kantumruy Pro', sans-serif"
                                    >
                                        ព័តមានទាក់ទង
                                    </Text>
                                    <NewsGrid
                                        newsItems={relatedNews}
                                        getReadTime={getReadTime}
                                        limit={5}
                                    />
                                </Box>

                                <Box
                                    p={4}
                                    bg={colors.darkBgAlt}
                                    borderRadius="md"
                                    borderLeft="4px solid"
                                    borderColor={colors.brightGold}
                                >
                                    <Heading
                                        as="h4"
                                        size="sm"
                                        mb={3}
                                        color={colors.gold}
                                        fontFamily="'Kantumruy Pro', sans-serif"
                                    >
                                        Defense Newsletter
                                    </Heading>
                                    <Text
                                        fontSize="sm"
                                        mb={4}
                                        color={colors.textMuted}
                                        fontFamily="'Kantumruy Pro', sans-serif"
                                    >
                                        Stay updated with the latest news from the Ministry of National Defense
                                    </Text>
                                    <Button
                                        size="sm"
                                        width="100%"
                                        colorScheme="green"
                                        bg={colors.midGreen}
                                        _hover={{ bg: colors.darkGreen }}
                                        color={colors.brightGold}
                                        fontFamily="'Kantumruy Pro', sans-serif"
                                    >
                                        Subscribe
                                    </Button>
                                </Box>
                            </VStack>
                        </MotionBox>
                    </GridItem>
                </Grid>
            </Container>
        </>
    );
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const { id } = context.params!;

    try {
        // Use absolute URL that works in any environment
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const host = context.req.headers.host || 'localhost:3000';
        const baseUrl = `${protocol}://${host}`;
        const url = `${baseUrl}/api/news/${id}`;

        console.log(`Fetching news from: ${url}`);

        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Failed to fetch: ${res.status}`);
        }

        const news = await res.json();

        if (!news) {
            return {
                props: {
                    news: null,
                    error: "Article not found"
                }
            };
        }

        // Fetch related news (you might want to implement an actual related news API)
        let relatedNews = [];
        try {
            const relatedRes = await fetch(`${baseUrl}/api/news?limit=5&exclude=${id}`);
            if (relatedRes.ok) {
                relatedNews = await relatedRes.json();
            }
        } catch (error) {
            console.error("Error fetching related news:", error);
        }

        return {
            props: {
                news,
                relatedNews,
                // Add readTime if not present
                ...(!news.readTime && {
                    readTime: calculateReadTime(news.body)
                })
            }
        };
    } catch (error) {
        console.error("Error fetching news:", error);
        return {
            props: {
                news: null,
                relatedNews: [],
                error: error instanceof Error ? error.message : "Failed to load article"
            }
        };
    }
};

// Helper function to calculate read time
function calculateReadTime(text: string): string {
    const wordsPerMinute = 200;
    const wordCount = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
}