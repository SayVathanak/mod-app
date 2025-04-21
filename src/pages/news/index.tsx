import { useEffect, useState } from "react";
import {
    Box,
    Heading,
    Text,
    Image,
    Link,
    VStack,
    Spinner,
} from "@chakra-ui/react";
import NextLink from "next/link";

type NewsItem = {
    _id: string;
    title: string;
    body: string;
    imageUrl?: string;
};

export default function NewsPage() {
    const [newsList, setNewsList] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNews = async () => {
        const res = await fetch("/api/news");
        const data = await res.json();
        setNewsList(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchNews();
    }, []);

    return (
        <Box p={6}>
            <Heading mb={6}>Latest News</Heading>

            {loading ? (
                <Spinner />
            ) : (
                <VStack spacing={6} align="stretch">
                    {newsList.map((item) => (
                        <Box
                            key={item._id}
                            p={4}
                            borderWidth="1px"
                            borderRadius="md"
                            _hover={{ shadow: "md" }}
                        >
                            {item.imageUrl && (
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    borderRadius="md"
                                    mb={3}
                                />
                            )}
                            <Heading size="md" mb={2}>
                                <Link as={NextLink} href={`/news/${item._id}`}>
                                    {item.title}
                                </Link>
                            </Heading>
                            <Text noOfLines={3}>{item.body}</Text>
                        </Box>
                    ))}
                </VStack>
            )}
        </Box>
    );
}
