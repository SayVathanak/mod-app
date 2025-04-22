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
    Spinner
} from "@chakra-ui/react";
import { FaCalendarAlt, FaArrowLeft, FaShare, FaBookmark } from "react-icons/fa";
import NextLink from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
    error?: string;
};

export default function NewsDetailPage({ news: initialNews, error }: Props) {
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

    if (isLoading) {
        return (
            <Container maxW="container.md" py={16} centerContent>
                <Spinner size="xl" thickness="4px" speed="0.65s" />
                <Text mt={4}>Loading article...</Text>
            </Container>
        );
    }

    if (!news) {
        return (
            <Container maxW="container.md" py={16}>
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

            <Container maxW="container.md" py={8}>
                <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link as={NextLink} href="/news">
                        <Button
                            variant="ghost"
                            leftIcon={<FaArrowLeft />}
                            mb={6}
                            color="brand.500"
                            _hover={{ bg: "dark.800" }}
                        >
                            Back to News
                        </Button>
                    </Link>

                    {news.category && (
                        <Badge colorScheme="green" mb={4} fontSize="sm" px={2} py={1}>
                            {news.category}
                        </Badge>
                    )}

                    <Heading mb={6} fontSize={["2xl", "3xl", "4xl"]} lineHeight="1.2">
                        {news.title}
                    </Heading>

                    <Flex
                        direction={["column", "row"]}
                        justify="space-between"
                        mb={6}
                        align={["flex-start", "center"]}
                        bg="dark.800"
                        p={4}
                        borderRadius="md"
                    >
                        <HStack spacing={4}>
                            <Avatar
                                size="sm"
                                name={news.author || "Author"}
                                bg="brand.500"
                            />
                            <Box>
                                <Text fontSize="sm" fontWeight="bold">
                                    {news.author || "Say Vathanak"}
                                </Text>
                                <HStack fontSize="xs" color="gray.500">
                                    <Icon as={FaCalendarAlt} />
                                    <Text>{formattedDate}</Text>
                                    {news.readTime && (
                                        <>
                                            <Text>•</Text>
                                            <Text>{news.readTime}</Text>
                                        </>
                                    )}
                                </HStack>
                            </Box>
                        </HStack>

                        <HStack mt={[4, 0]} spacing={4}>
                            <Icon
                                as={FaShare}
                                color="gray.500"
                                cursor="pointer"
                                _hover={{ color: "brand.500" }}
                            />
                            <Icon
                                as={FaBookmark}
                                color="gray.500"
                                cursor="pointer"
                                _hover={{ color: "brand.500" }}
                            />
                        </HStack>
                    </Flex>

                    {news.imageUrl && (
                        <Box
                            mb={8}
                            borderRadius="lg"
                            overflow="hidden"
                            boxShadow="dark-lg"
                            position="relative"
                            minH="300px"
                        >
                            <Image
                                src={news.imageUrl}
                                alt={news.title}
                                w="100%"
                                h="auto"
                                objectFit="cover"
                                fallback={
                                    <Flex
                                        h="300px"
                                        bg="dark.700"
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
                        fontSize={["md", "lg"]}
                        color="gray.300"
                        whiteSpace="pre-wrap"
                        lineHeight="1.8"
                        fontFamily="'Kantumruy Pro', sans-serif"
                    >
                        {news.body.split('\n').map((paragraph, idx) => (
                            <Text key={idx} mb={4}>
                                {paragraph}
                            </Text>
                        ))}
                    </Box>

                    <Divider my={10} opacity={0.3} />

                    <Flex justify="space-between" align="center">
                        <Button variant="outline" isDisabled>
                            Previous Article
                        </Button>
                        <Button variant="outline" isDisabled>
                            Next Article
                        </Button>
                    </Flex>
                </MotionBox>
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
        const url = `${protocol}://${host}/api/news/${id}`;

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

        return {
            props: {
                news,
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