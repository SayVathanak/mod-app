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
} from "@chakra-ui/react";
import { FaCalendarAlt, FaArrowLeft, FaShare, FaBookmark } from "react-icons/fa";
import NextLink from "next/link";
import { motion } from "framer-motion";

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
    news: NewsItem;
};

export default function NewsDetailPage({ news }: Props) {
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/news/${id}`);
        const news = await res.json();

        return { props: { news } };
    } catch (error) {
        console.error("Error fetching news:", error);
        return {
            notFound: true,
        };
    }
};