import { useEffect, useState } from "react";
import {
    Box,
    Heading,
    Text,
    Grid,
    GridItem,
    Spinner,
} from "@chakra-ui/react";

type Video = {
    _id: string;
    title: string;
    description: string;
    videoUrl: string;
};

export default function VideosPage() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

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
                <Grid
                    templateColumns={["1fr", "repeat(2, 1fr)", "repeat(3, 1fr)"]}
                    gap={6}
                >
                    {videos.map((video) => (
                        <GridItem
                            key={video._id}
                            p={4}
                            borderWidth="1px"
                            borderRadius="md"
                            _hover={{ shadow: "md" }}
                        >
                            <Box mb={3}>
                                <video
                                    src={video.videoUrl}
                                    controls
                                    width="100%"
                                    style={{ borderRadius: "8px" }}
                                />
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
