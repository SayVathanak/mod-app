import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Heading,
    Input,
    Textarea,
    VStack,
    Text,
} from "@chakra-ui/react";

type Video = {
    _id?: string;
    title: string;
    description: string;
    videoUrl?: string;
};

export default function AdminVideos() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const fetchVideos = async () => {
        const res = await fetch("/api/videos");
        const data = await res.json();
        setVideos(data);
    };

    const [thumbnail, setThumbnail] = useState<File | null>(null);

    const handleUpload = async (file: File | null): Promise<string | null> => {
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

    const createVideo = async () => {
        setUploading(true);
        const videoUrl = await handleUpload(videoFile);
        const thumbnailUrl = await handleUpload(thumbnail);
        setUploading(false);

        await fetch("/api/videos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description, videoUrl, thumbnailUrl }),
        });

        setTitle("");
        setDescription("");
        setVideoFile(null);
        setThumbnail(null);
        fetchVideos();
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    return (
        <Box p={6}>
            <Heading mb={4}>Manage Videos</Heading>

            <VStack spacing={4} align="stretch" mb={6}>
                <Input
                    placeholder="Video Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <Textarea
                    placeholder="Video Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                />
                <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                />
                <Button onClick={createVideo} isLoading={uploading} colorScheme="teal">
                    Upload Video
                </Button>
            </VStack>

            <Heading size="md" mb={2}>
                Uploaded Videos
            </Heading>

            <VStack spacing={4} align="stretch">
                {videos.map((video) => (
                    <Box
                        key={video._id}
                        p={4}
                        borderWidth="1px"
                        borderRadius="md"
                        _hover={{ shadow: "md" }}
                    >
                        <Text fontWeight="bold">{video.title}</Text>
                        <Text mb={2}>{video.description}</Text>
                        {video.videoUrl && (
                            <video src={video.videoUrl} controls width="100%" />
                        )}
                    </Box>
                ))}
            </VStack>
        </Box>
    );
}
