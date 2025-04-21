import { useEffect, useState } from "react";
import {
    Box,
    Heading,
    Text,
    Image,
    VStack,
    Grid,
    GridItem,
    Spinner,
} from "@chakra-ui/react";

type Book = {
    _id?: string;
    title: string;
    author: string;
    description: string;
    coverUrl?: string;
    pdfUrl?: string;
};

export default function BooksPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBooks = async () => {
        const res = await fetch("/api/books");
        const data = await res.json();
        setBooks(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    return (
        <Box p={[4, 6, 8]}>
            <Heading mb={6}>Books Library</Heading>

            {loading ? (
                <Spinner />
            ) : (
                <Grid
                    templateColumns={["1fr", "repeat(2, 1fr)", "repeat(3, 1fr)"]}
                    gap={6}
                >
                    {books.map((book) => (
                        <GridItem
                            key={book._id}
                            p={4}
                            borderWidth="1px"
                            borderRadius="md"
                            _hover={{ shadow: "md" }}
                        >
                            {book.coverUrl && (
                                <Image
                                    src={book.coverUrl}
                                    alt={book.title}
                                    borderRadius="md"
                                    mb={3}
                                    w="100%"
                                    h="250px"
                                    objectFit="cover"
                                />
                            )}
                            <Heading size="md" mb={1}>
                                {book.title}
                            </Heading>
                            <Text fontSize="sm" mb={2} color="gray.600">
                                by {book.author}
                            </Text>
                            <Text fontSize="sm" noOfLines={3}>
                                {book.description}
                            </Text>

                            {book.pdfUrl && (
                                <a
                                    href={book.pdfUrl}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Text color="teal.500" fontWeight="bold" mt={2}>
                                        Download PDF
                                    </Text>
                                </a>
                            )}
                        </GridItem>
                    ))}
                </Grid>
            )}
        </Box>
    );
}
