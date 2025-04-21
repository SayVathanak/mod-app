import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Heading,
    Input,
    Textarea,
    VStack,
    Image,
    Text,
} from "@chakra-ui/react";

type Book = {
    _id?: string;
    title: string;
    author: string;
    description: string;
    coverUrl?: string;
};

export default function AdminBooks() {
    const [books, setBooks] = useState<Book[]>([]);
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [description, setDescription] = useState("");
    const [cover, setCover] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [pdf, setPdf] = useState<File | null>(null);

    const fetchBooks = async () => {
        const res = await fetch("/api/books");
        const data = await res.json();
        setBooks(data);
    };

    const handleUpload = async (file: File | null, folder: string): Promise<string | null> => {
        if (!file) return null;
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });
        const data = await res.json();
        return data.url;
    };

    const createBook = async () => {
        setUploading(true);
        const coverUrl = await handleUpload(cover, "mediaverse/news");
        const pdfUrl = await handleUpload(pdf, "mediaverse/books");
        setUploading(false);

        await fetch("/api/books", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, author, description, coverUrl, pdfUrl }),
        });

        setTitle("");
        setAuthor("");
        setDescription("");
        setCover(null);
        setPdf(null);
        fetchBooks();
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    return (
        <Box p={6}>
            <Heading mb={4}>Manage Books</Heading>

            <VStack spacing={4} align="stretch" mb={6}>
                <Input
                    placeholder="Book Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                    placeholder="Author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                />
                <Textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setPdf(e.target.files?.[0] || null)}
                />
                <Input
                    type="file"
                    onChange={(e) => setCover(e.target.files?.[0] || null)}
                />
                <Button onClick={createBook} isLoading={uploading} colorScheme="teal">
                    Publish Book
                </Button>
            </VStack>

            <Heading size="md" mb={2}>
                Existing Books
            </Heading>

            <VStack spacing={4} align="stretch">
                {books.map((book) => (
                    <Box
                        key={book._id}
                        p={4}
                        borderWidth="1px"
                        borderRadius="md"
                        _hover={{ shadow: "md" }}
                    >
                        {book.coverUrl && (
                            <Image src={book.coverUrl} alt={book.title} mb={3} borderRadius="md" />
                        )}
                        <Text fontWeight="bold">{book.title}</Text>
                        <Text fontSize="sm">by {book.author}</Text>
                        <Text noOfLines={2}>{book.description}</Text>
                    </Box>
                ))}
            </VStack>
        </Box>
    );
}
