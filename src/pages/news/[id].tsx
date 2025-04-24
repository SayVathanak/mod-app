// pages/news/[id].tsx
import { GetServerSideProps } from "next";
import Head from "next/head";
import { Container, Box, Button, Spinner, Text, Grid, GridItem } from "@chakra-ui/react";
import { FaArrowLeft } from "react-icons/fa";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { NewsGrid } from "@/components/NewsGrid";
import { colors } from "@/theme/colors";
import { NewsDetail } from "@/components/NewsDetail";
import { calculateReadTime } from "@/utils/textUtils";

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
    const { id } = router.query;
    const [news, setNews] = useState(initialNews);
    const [isLoading, setIsLoading] = useState(false);

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
                    console.error("Failed to load article:", err);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchNews();
    }, [id, news, error]);

    // SEO metadata
    const pageTitle = news ? `${news.title} | Ministry of National Defense` : "Article | Ministry of National Defense";
    const pageDescription = news ? news.body.slice(0, 150) : "Ministry of National Defense news article";

    if (isLoading) {
        return (
            <Container maxW="container.xl" py={16} centerContent>
                <Spinner size="xl" thickness="4px" speed="0.65s" color={colors.gold} />
                <Text mt={4} color={colors.textLight}>Loading article...</Text>
            </Container>
        );
    }

    if (!news && !isLoading) {
        return (
            <Container maxW="container.xl">
                <Box textAlign="center" py={12}>
                    <Text fontSize="xl" mb={4} color="red.500">Article Not Found</Text>
                    <Text mb={8} color={colors.textLight}>The news article you're looking for could not be found.</Text>
                    <Button
                        as={NextLink}
                        href="/news"
                        colorScheme="brand"
                        leftIcon={<FaArrowLeft />}
                        bg={colors.midGreen}
                        color={colors.brightGold}
                        _hover={{ bg: colors.darkGreen }}
                    >
                        Back to News
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                {news?.imageUrl && <meta property="og:image" content={news.imageUrl} />}
            </Head>

            <Container maxW="container.xl" px={{ base: 4, md: 8 }}>
                <Grid
                    templateColumns={{ base: "1fr", lg: "3fr 2fr" }}
                    gap={{ base: 0, lg: 10 }}
                >
                    {/* Main Content Column */}
                    <GridItem>
                        {news && (
                            <NewsDetail
                                id={id as string}
                                initialData={news}
                            />
                        )}
                    </GridItem>

                    {/* Right Sidebar - Related News */}
                    <GridItem display={{ base: "none", lg: "block" }}>
                        <Box
                            position="sticky"
                            top="100px"
                        >
                            <Box>
                                <Text
                                    fontSize={{ base: "md", md: "xl" }}
                                    fontWeight="medium"
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
                                    getReadTime={calculateReadTime}
                                    limit={5}
                                />
                            </Box>

                            <Box
                                p={4}
                                mt={8}
                                bg={colors.darkBgAlt}
                                borderRadius="md"
                                borderLeft="4px solid"
                                borderColor={colors.brightGold}
                            >
                                <Text
                                    fontSize="sm"
                                    fontWeight="medium"
                                    mb={3}
                                    color={colors.gold}
                                    fontFamily="'Kantumruy Pro', sans-serif"
                                >
                                    Defense Newsletter
                                </Text>
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
                                    bg={colors.midGreen}
                                    _hover={{ bg: colors.darkGreen }}
                                    color={colors.brightGold}
                                    fontFamily="'Kantumruy Pro', sans-serif"
                                >
                                    Subscribe
                                </Button>
                            </Box>
                        </Box>
                    </GridItem>
                </Grid>

                {/* Mobile-only Related News Section */}
                <Box display={{ base: "block", lg: "none" }} mt={10}>
                    <Text
                        fontSize="lg"
                        fontWeight="medium"
                        mb={6}
                        color={colors.gold}
                        fontFamily="'Kantumruy Pro', sans-serif"
                    >
                        ព័តមានទាក់ទង
                    </Text>
                    <NewsGrid
                        newsItems={relatedNews}
                        getReadTime={calculateReadTime}
                        limit={4}
                    />
                </Box>
            </Container>
        </>
    );
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const { id } = context.params!;

    try {
        // Build base URL for API requests based on environment
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const host = context.req.headers.host || 'localhost:3000';
        const baseUrl = `${protocol}://${host}`;

        // Fetch the news article
        const newsResponse = await fetch(`${baseUrl}/api/news/${id}`);

        if (!newsResponse.ok) {
            throw new Error(`Failed to fetch: ${newsResponse.status}`);
        }

        const news = await newsResponse.json();

        // Add read time if not present
        if (news && !news.readTime) {
            news.readTime = calculateReadTime(news.body);
        }

        // Fetch related news in parallel
        const relatedNewsPromise = fetch(`${baseUrl}/api/news?limit=5&exclude=${id}`);

        // Wait for related news response
        const relatedNewsResponse = await relatedNewsPromise;
        const relatedNews = relatedNewsResponse.ok ? await relatedNewsResponse.json() : [];

        return {
            props: {
                news,
                relatedNews
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