// pages/books/index.tsx
import { useEffect, useState } from "react";
import {
    Box,
    Heading,
    Text,
    Image,
    Grid,
    GridItem,
    Spinner,
    Flex,
    Icon,
    Badge,
    Button,
    HStack,
    Container,
    useBreakpointValue,
    Input,
    InputGroup,
    InputLeftElement
} from "@chakra-ui/react";
import { FaSearch, FaBookOpen, FaFilter, FaDownload } from "react-icons/fa";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

type Book = {
    _id?: string;
    title: string;
    author: string;
    description: string;
    coverUrl?: string;
    pdfUrl?: string;
    category?: string;
};

export default function BooksPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const columnCount = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 3 });

    const fetchBooks = async () => {
        try {
            const res = await fetch("/api/books");
            const data = await res.json();
            setBooks(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching books:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <Flex justify="center" align="center" height="50vh">
                <Spinner size="xl" color="brand.500" thickness="4px" />
            </Flex>
        );
    }

    return (
        <Container maxW="container.xl">
            <Box mb={8}>
                <Flex
                    direction={["column", "row"]}
                    justify="space-between"
                    align={["flex-start", "center"]}
                    mb={8}
                    width="100%"
                >
                    <Heading
                        size="xl"
                        borderBottom="4px solid"
                        borderColor="brand.500"
                        pb={2}
                        display="inline-block"
                        mb={[4, 0]}
                    >
                        Books Library
                    </Heading>

                    <HStack spacing={4} mt={[4, 0]} w={["100%", "auto"]}>
                        <InputGroup maxW={["100%", "300px"]}>
                            <InputLeftElement pointerEvents="none">
                                <Icon as={FaSearch} color="gray.500" />
                            </InputLeftElement>
                            <Input
                                placeholder="Search books..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                bg="dark.800"
                                borderColor="dark.700"
                                _hover={{ borderColor: "brand.500" }}
                                _focus={{ borderColor: "brand.500", boxShadow: "none" }}
                                size={["sm", "md"]}
                            />
                        </InputGroup>
                        <Button
                            leftIcon={<FaFilter />}
                            variant="outline"
                            size="sm"
                            display={["none", "flex"]}
                        >
                            Filter
                        </Button>
                    </HStack>
                </Flex>

                <Grid
                    templateColumns={[`repeat(2, 1fr)`, `repeat(2, 1fr)`, `repeat(${columnCount}, 1fr)`]}
                    gap={[3, 4, 6]}
                >
                    {filteredBooks.map((book, index) => (
                        <MotionBox
                            key={book._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
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
                                height="100%"
                                display="flex"
                                flexDirection="column"
                            >
                                <Box height={["180px", "250px", "300px"]} overflow="hidden">
                                    <Image
                                        src={book.coverUrl || "/default-book-cover.jpg"}
                                        alt={book.title}
                                        borderTopRadius="lg"
                                        w="100%"
                                        h="100%"
                                        objectFit="cover"
                                        transition="transform 0.5s"
                                        _hover={{ transform: "scale(1.05)" }}
                                    />
                                </Box>
                                <Box p={4} flex="1" display="flex" flexDirection="column">
                                    {book.category && (
                                        <Badge colorScheme="green" mb={2}>
                                            {book.category}
                                        </Badge>
                                    )}
                                    <Heading size="md" mb={1} noOfLines={2}>
                                        {book.title}
                                    </Heading>
                                    <Text fontSize="sm" mb={2} color="brand.400">
                                        by {book.author}
                                    </Text>
                                    <Text fontSize="sm" color="gray.400" noOfLines={3} mb={4} flex="1">
                                        {book.description}
                                    </Text>

                                    {book.pdfUrl ? (
                                        <Button
                                            as="a"
                                            href={book.pdfUrl}
                                            download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            size="sm"
                                            w="full"
                                            leftIcon={<Icon as={FaDownload} />}
                                            colorScheme="green"
                                            variant="outline"
                                        >
                                            Download PDF
                                        </Button>
                                    ) : (
                                        <Button
                                            size="sm"
                                            w="full"
                                            leftIcon={<Icon as={FaBookOpen} />}
                                            variant="outline"
                                        >
                                            Read Preview
                                        </Button>
                                    )}
                                </Box>
                            </GridItem>
                        </MotionBox>
                    ))}
                </Grid>

                {filteredBooks.length === 0 && (
                    <Box textAlign="center" py={10}>
                        <Text fontSize="lg" color="gray.500">
                            {searchTerm ? "No books match your search." : "No books available."}
                        </Text>
                    </Box>
                )}
            </Box>
        </Container>
    );
}