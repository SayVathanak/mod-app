// components/NewsDetail.tsx
import React, { useMemo } from "react";
import {
    Box,
    Heading,
    Text,
    Image,
    Flex,
    Icon,
    HStack,
    Badge,
    Link,
    Button,
    Divider,
    Avatar,
    Spinner,
    Skeleton,
    useColorModeValue,
} from "@chakra-ui/react";
import { FaCalendarAlt, FaArrowLeft, FaShare, FaBookmark } from "react-icons/fa";
import NextLink from "next/link";
import { motion } from "framer-motion";
import useSWR from "swr";
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

interface NewsDetailProps {
    id: string;
    initialData?: NewsItem;
    onBackClick?: () => void;
}

// Improved fetcher with error handling
const fetcher = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
        const error = new Error(`Error fetching news: ${response.statusText}`);
        error.name = response.status.toString();
        throw error;
    }
    return response.json();
};

// Helper function to calculate read time
const calculateReadTime = (text: string): string => {
    const wordsPerMinute = 200;
    const wordCount = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
};

export const NewsDetail: React.FC<NewsDetailProps> = ({
    id,
    initialData,
    onBackClick,
}) => {
    // Using SWR for data fetching with optimized config
    const { data: news, error, isValidating } = useSWR<NewsItem>(
        `/api/news/${id}`,
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000, // Cache for 1 minute
            fallbackData: initialData,
            suspense: false,
            errorRetryCount: 3,
            errorRetryInterval: 5000,
            onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
                // Don't retry on 404 or 400
                if (error.name === "404" || error.name === "400") return;

                // Only retry up to 3 times
                if (retryCount >= 3) return;

                // Retry after 5 seconds
                setTimeout(() => revalidate({ retryCount }), 5000);
            },
        }
    );

    // Optimize data processing with useMemo
    const { formattedDate, readTime, contentParagraphs } = useMemo(() => {
        // Format date if it exists
        const formattedDate = news?.createdAt
            ? new Date(news.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
            : "Recent";

        // Calculate read time if not provided
        const readTime = news?.readTime || (news?.body ? calculateReadTime(news.body) : "");

        // Pre-process content paragraphs for efficient rendering
        const contentParagraphs = news?.body ? news.body.split('\n').filter(p => p.trim()) : [];

        return { formattedDate, readTime, contentParagraphs };
    }, [news]);

    // Check for loading or error states
    const isLoading = !news && !error;
    const hasError = !!error;

    // If no data is available and not loading
    if (!isLoading && !news) {
        return (
            <Box textAlign="center" py={8}>
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
        );
    }

    // If there's an error
    if (hasError) {
        return (
            <Box textAlign="center" py={8}>
                <Heading mb={4} color="red.500">Error Loading Article</Heading>
                <Text mb={8}>There was a problem loading this article. Please try again.</Text>
                <Button
                    as={NextLink}
                    href="/news"
                    colorScheme="brand"
                    leftIcon={<FaArrowLeft />}
                >
                    Back to News
                </Button>
            </Box>
        );
    }

    return (
        <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            width="100%"
        >
            <Link as={NextLink} href="/news" onClick={onBackClick} display="inline-block">
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

            {/* Category Badge */}
            {isLoading ? (
                <Skeleton height="24px" width="100px" mb={4} />
            ) : (
                news?.category && (
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
                )
            )}

            {/* Title */}
            {isLoading ? (
                <Skeleton height="40px" mb={6} />
            ) : (
                <Heading
                    as="h1"
                    fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
                    lineHeight="1.3"
                    fontFamily="'Kantumruy Pro', sans-serif"
                    color={colors.gold}
                    mb={6}
                >
                    {news?.title}
                </Heading>
            )}

            {/* Main Image */}
            {isLoading ? (
                <Skeleton height={{ base: "200px", md: "400px" }} mb={8} borderRadius="lg" />
            ) : (
                news?.imageUrl && (
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
                            loading="eager" // Prioritize loading
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
                )
            )}

            {/* Article Content */}
            {isLoading ? (
                <>
                    <Skeleton height="20px" mb={4} />
                    <Skeleton height="20px" mb={4} />
                    <Skeleton height="20px" mb={4} />
                    <Skeleton height="20px" mb={4} />
                </>
            ) : (
                <Box
                    fontSize={{ base: "sm", md: "md" }}
                    color={colors.textLight}
                    whiteSpace="pre-wrap"
                    lineHeight="1.8"
                    className="article-content"
                >
                    {contentParagraphs.map((paragraph, idx) => (
                        <Text key={idx} mb={4} fontFamily="'Kantumruy Pro', sans-serif">
                            {paragraph}
                        </Text>
                    ))}
                </Box>
            )}

            {/* Author Info */}
            {isLoading ? (
                <Skeleton height="70px" mb={4} borderRadius="md" />
            ) : (
                <Flex
                    flexWrap="wrap"
                    justify="space-between"
                    mt={8}
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
                            name={news?.author || "Author"}
                            bg={colors.midGreen}
                        />
                        <Box>
                            <Text
                                fontSize={{ base: "xs", md: "sm" }}
                                fontWeight="medium"
                                fontFamily="'Kantumruy Pro', sans-serif"
                                color={colors.textLight}
                            >
                                {news?.author || "Author"}
                            </Text>
                            <HStack fontSize={{ base: "2xs", md: "xs" }} color={colors.textMuted} spacing={1}>
                                <Icon as={FaCalendarAlt} boxSize={{ base: "8px", md: "10px" }} />
                                <Text fontFamily="'Kantumruy Pro', sans-serif">{formattedDate}</Text>
                                {readTime && (
                                    <>
                                        <Text>•</Text>
                                        <Text fontFamily="'Kantumruy Pro', sans-serif">{readTime}</Text>
                                    </>
                                )}
                            </HStack>
                        </Box>
                    </HStack>

                    <HStack
                        spacing={4}
                        width={{ base: "auto", sm: "auto" }}
                        justify="flex-end"
                    >
                        <Icon
                            as={FaShare}
                            color={colors.textMuted}
                            cursor="pointer"
                            _hover={{ color: colors.brightGold }}
                            boxSize={{ base: "14px", md: "16px" }}
                            aria-label="Share"
                            role="button"
                        />
                        <Icon
                            as={FaBookmark}
                            color={colors.textMuted}
                            cursor="pointer"
                            _hover={{ color: colors.brightGold }}
                            boxSize={{ base: "14px", md: "16px" }}
                            aria-label="Bookmark"
                            role="button"
                        />
                    </HStack>
                </Flex>
            )}

            <Divider my={10} opacity={0.3} />

            {/* Article Navigation - Conditionally rendered to save space when not needed */}
            {!isLoading && (
                <Flex justify="space-between" align="center" mb={8}>
                    <Button
                        variant="outline"
                        isDisabled
                        borderColor={colors.midGreen}
                        color={colors.gold}
                        _hover={{ bg: colors.darkGreen }}
                        size={{ base: "sm", md: "md" }}
                    >
                        Previous Article
                    </Button>
                    <Button
                        variant="outline"
                        isDisabled
                        borderColor={colors.midGreen}
                        color={colors.gold}
                        _hover={{ bg: colors.darkGreen }}
                        size={{ base: "sm", md: "md" }}
                    >
                        Next Article
                    </Button>
                </Flex>
            )}
        </MotionBox>
    );
};

export default NewsDetail;