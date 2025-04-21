// pages/news/index.tsx
import { useEffect, useState } from "react";
import {
    Box,
    Heading,
    Text,
    Image,
    Link,
    VStack,
    Spinner,
    Flex,
    Grid,
    GridItem,
    Icon,
    Badge,
    HStack,
    useBreakpointValue,
    Container
} from "@chakra-ui/react";
import NextLink from "next/link";
import { FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

type NewsItem = {
    _id: string;
    title: string;
    body: string;
    imageUrl?: string;
    createdAt?: string;
    category?: string;
};

export default function NewsPage() {
    const [newsList, setNewsList] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [featured, setFeatured] = useState<NewsItem | null>(null);

    const fetchNews = async () => {
        try {
            const res = await fetch("/api/news");
            const data = await res.json();

            // Set the first item as featured and rest as regular news
            if (data.length > 0) {
                setFeatured(data[0]);
                setNewsList(data.slice(1));
            } else {
                setNewsList([]);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching news:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const columnCount = useBreakpointValue({ base: 1, md: 2, lg: 3 });

    if (loading) {
        return (
            <Flex justify="center" align="center" height="50vh">
                <Spinner size="xl" color="brand.500" thickness="4px" />
            </Flex>
        );
    }

    return (
        <Container maxW="container.xl">
            <Heading
                mb={8}
                size="xl"
                borderBottom="4px solid"
                borderColor="brand.500"
                pb={2}
                display="inline-block"
            >
                Latest News
            </Heading>

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
                    >
                        <Box
                            position="relative"
                            borderRadius="xl"
                            overflow="hidden"
                            height={["200px", "300px", "400px"]}
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
                                p={6}
                                bgGradient="linear(to-t, rgba(0,0,0,0.9), rgba(0,0,0,0.5), transparent)"
                            >
                                {featured.category && (
                                    <Badge colorScheme="green" mb={2}>
                                        {featured.category}
                                    </Badge>
                                )}
                                <Heading size="lg" color="white" mb={2}>
                                    {featured.title}
                                </Heading>
                                <Text color="gray.300" noOfLines={2}>
                                    {featured.body}
                                </Text>
                                <HStack mt={4} color="gray.400" fontSize="sm">
                                    <Icon as={FaCalendarAlt} />
                                    <Text>{featured.createdAt || "Recent"}</Text>
                                </HStack>
                            </Box>
                        </Box>
                    </Link>
                </MotionBox>
            )}
            <Grid
                templateColumns={[`repeat(2, 1fr)`, `repeat(2, 1fr)`, `repeat(${columnCount}, 1fr)`]}
                gap={[3, 4, 6]}>
                {newsList.map((item, index) => (
                    <MotionBox
                        key={item._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <Link
                            as={NextLink}
                            href={`/news/${item._id}`}
                            _hover={{ textDecoration: "none" }}
                        >
                            <GridItem
                                overflow="hidden"
                                borderRadius="lg"
                                bg="dark.800"
                                boxShadow="md"
                                _hover={{
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 0 15px rgba(47, 158, 47, 0.2)"
                                }}
                                transition="all 0.3s ease"
                            >
                                <Box height="200px" overflow="hidden">
                                    <Image
                                        src={item.imageUrl || "/default-news.jpg"}
                                        alt={item.title}
                                        borderTopRadius="lg"
                                        w="100%"
                                        h="100%"
                                        objectFit="cover"
                                        transition="transform 0.5s"
                                        _hover={{ transform: "scale(1.05)" }}
                                    />
                                </Box>
                                <Box p={4}>
                                    {item.category && (
                                        <Badge colorScheme="green" mb={2}>
                                            {item.category}
                                        </Badge>
                                    )}
                                    <Heading size="md" mb={2} noOfLines={2}>
                                        {item.title}
                                    </Heading>
                                    <Text fontSize="sm" color="gray.400" noOfLines={3} mb={3}>
                                        {item.body}
                                    </Text>
                                    <Flex justify="space-between" align="center">
                                        <Text fontSize="sm" color="gray.500">
                                            {item.createdAt || "Recent"}
                                        </Text>
                                        <Icon as={FaArrowRight} color="brand.500" />
                                    </Flex>
                                </Box>
                            </GridItem>
                        </Link>
                    </MotionBox>
                ))}
            </Grid>

            {newsList.length === 0 && !featured && (
                <Box textAlign="center" py={10}>
                    <Text fontSize="lg" color="gray.500">No news articles available.</Text>
                </Box>
            )}
        </Container>
    );
}