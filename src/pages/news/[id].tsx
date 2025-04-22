// pages/news/[id].tsx - with improved error handling
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
} from "@chakra-ui/react";
import { FaCalendarAlt, FaArrowLeft, FaShare, FaBookmark } from "react-icons/fa";
import NextLink from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect } from "react";

const MotionBox = motion(Box);

type NewsItem = {
    _id: string;
    title: string;
    body: string;
    imageUrl?: string;
    author?: string;
    createdAt?: string;
    category?: string;
};

type Props = {
    news: NewsItem | null;
    error?: string;
};

export default function NewsDetailPage({ news, error }: Props) {
    const router = useRouter();
    const toast = useToast();

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

    return (
        <>
            <Head>
                <title>{news.title} | MediaVerse</title>
                <meta name="description" content={news.body.slice(0, 150)} />
                <meta property="og:title" content={`${news.title} | MediaVerse`} />
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
                        <Badge colorScheme="green" mb={4}>
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
                                    {news.author || "MediaVerse Staff"}
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                    <Icon as={FaCalendarAlt} mr={1} />
                                    {news.createdAt || "Recent"}
                                </Text>
                            </Box>
                        </HStack>

                        <HStack mt={[4, 0]} spacing={4}>
                            <Icon as={FaShare} color="gray.500" cursor="pointer" />
                            <Icon as={FaBookmark} color="gray.500" cursor="pointer" />
                        </HStack>
                    </Flex>

                    {news.imageUrl && (
                        <Box
                            mb={8}
                            borderRadius="lg"
                            overflow="hidden"
                            boxShadow="dark-lg"
                        >
                            <Image
                                src={news.imageUrl}
                                alt={news.title}
                                w="100%"
                                objectFit="cover"
                            />
                        </Box>
                    )}

                    <Box
                        fontSize={["md", "lg"]}
                        color="gray.300"
                        whiteSpace="pre-wrap"
                        lineHeight="1.8"
                        fontFamily="'Kantumruy Pro', sans-serif" // 👈 Apply font here
                    >
                        {news.body.split('\n').map((paragraph, idx) => (
                            <Text key={idx} mb={4}>
                                {paragraph}
                            </Text>
                        ))}
                    </Box>

                    <Divider my={10} opacity={0.3} />

                    <Flex justify="space-between" align="center">
                        <Button variant="outline">
                            Previous Article
                        </Button>
                        <Button variant="outline">
                            Next Article
                        </Button>
                    </Flex>
                </MotionBox>
            </Container>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.params!;

    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
            process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
            'http://localhost:3000';

        const res = await fetch(`${baseUrl}/api/news/${id}`);

        if (!res.ok) {
            throw new Error(`Failed to fetch news: ${res.status}`);
        }

        const news = await res.json();

        return { props: { news } };
    } catch (error) {
        console.error("Error fetching news:", error);
        // Return null news with error message instead of notFound
        return {
            props: {
                news: null,
                error: "Failed to load the article. Please try again later."
            }
        };
    }
};