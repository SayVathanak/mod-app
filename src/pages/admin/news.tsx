import { useEffect, useState } from "react";
import {
    Box,
    Heading,
    Input,
    Button,
    Textarea,
    VStack,
    Text,
    Image,
} from "@chakra-ui/react";

type NewsItem = {
    _id?: string;
    title: string;
    body: string;
    imageUrl?: string;
};

export default function AdminNews() {
    const [newsList, setNewsList] = useState<NewsItem[]>([]);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const fetchNews = async () => {
        const res = await fetch("/api/news");
        const data = await res.json();
        setNewsList(data);
    };

    const handleUploadImage = async (): Promise<string | null> => {
        if (!image) return null;

        const formData = new FormData();
        formData.append("file", image);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        return data.url;
    };

    const createNews = async () => {
        setUploading(true);
        const imageUrl = await handleUploadImage();
        setUploading(false);

        await fetch("/api/news", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, body, imageUrl }),
        });

        setTitle("");
        setBody("");
        setImage(null);
        fetchNews();
    };

    useEffect(() => {
        fetchNews();
    }, []);

    return (
        <Box p={6}>
            <Heading mb={4}>Manage News</Heading>

            <VStack spacing={4} align="stretch" mb={6}>
                <Input
                    placeholder="News Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <Textarea
                    placeholder="News Body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                />
                <Input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} />
                <Button onClick={createNews} colorScheme="teal" isLoading={uploading}>
                    Publish News
                </Button>
            </VStack>

            <Heading size="md" mb={2}>
                Existing News
            </Heading>
            {newsList.map((item) => (
                <Box key={item._id} p={4} borderWidth="1px" borderRadius="md" mb={2}>
                    {item.imageUrl && (
                        <Image src={item.imageUrl} alt="News image" mb={2} borderRadius="md" />
                    )}
                    <Text fontWeight="bold">{item.title}</Text>
                    <Text>{item.body}</Text>
                </Box>
            ))}
        </Box>
    );
}
