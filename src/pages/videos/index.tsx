import { useEffect, useState } from "react";
import { Box, Heading, Text, Grid, GridItem, Spinner, Image, Button } from "@chakra-ui/react";
import { FaPlayCircle } from "react-icons/fa"; // You can remove this if using Chakra UI's icons

type Video = {
    _id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
};

export default function VideosPage() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

    // Fetch videos from the API
    const fetchVideos = async () => {
        const res = await fetch("/api/videos");
        const data = await res.json();
        setVideos(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    return (
        <Box p={[4, 6, 8]}>
            <Heading mb={6}>Watch Videos</Heading>

            {loading ? (
                <Spinner />
            ) : (
                <Grid templateColumns={["1fr", "repeat(2, 1fr)", "repeat(3, 1fr)"]} gap={6}>
                    {videos.map((video) => (
                        <GridItem
                            key={video._id}
                            p={4}
                            borderWidth="1px"
                            borderRadius="md"
                            _hover={{ shadow: "md" }}
                        >
                            <Box mb={3} position="relative" onClick={() => setPlayingVideoId(video._id)}>
                                {playingVideoId === video._id ? (
                                    <video
                                        src={video.videoUrl}
                                        controls
                                        autoPlay
                                        width="100%"
                                        style={{ borderRadius: "8px" }}
                                    />
                                ) : (
                                    <>
                                        <Image
                                            src={video.thumbnailUrl || "/default-thumbnail.jpg"}
                                            alt="Video thumbnail"
                                            borderRadius="md"
                                            objectFit="cover"
                                            w="100%"
                                            h="200px"
                                        />
                                        <Box
                                            position="absolute"
                                            top="50%"
                                            left="50%"
                                            transform="translate(-50%, -50%)"
                                            fontSize="3xl"
                                            color="white"
                                            opacity={0.8}
                                        >
                                            <FaPlayCircle />
                                        </Box>
                                    </>
                                )}
                            </Box>
                            <Heading size="md" mb={1}>
                                {video.title}
                            </Heading>
                            <Text fontSize="sm" noOfLines={3}>
                                {video.description}
                            </Text>
                        </GridItem>
                    ))}
                </Grid>
            )}
        </Box>
    );
}