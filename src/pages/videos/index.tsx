// pages/videos/index.tsx
import { useEffect, useState, useCallback } from "react";
import {
    Box,
    Heading,
    Text,
    Grid,
    GridItem,
    Spinner,
    Image,
    Button,
    Flex,
    // Icon,
    Badge,
    Container,
    useBreakpointValue,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    HStack
} from "@chakra-ui/react";
import { FaFilter } from "react-icons/fa";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

type Video = {
    _id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    duration?: string;
    category?: string;
};

export default function VideosPage() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const columnCount = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 3 });

    // Fetch videos from the API
    const fetchVideos = async () => {
        try {
            const res = await fetch("/api/videos");
            const data = await res.json();
            setVideos(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching videos:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    // const handleVideoClick = useCallback((video: Video) => {
    //     setSelectedVideo(video);
    //     onOpen();
    // }, [onOpen]);

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
                >
                    <Heading
                        size="xl"
                        borderBottom="4px solid"
                        borderColor="brand.500"
                        pb={2}
                        display="inline-block"
                    >
                        Video Library
                    </Heading>

                    <HStack spacing={4} mt={[4, 0]}>
                        <Button
                            leftIcon={<FaFilter />}
                            variant="outline"
                            size="sm"
                        >
                            Filter
                        </Button>
                    </HStack>
                </Flex>

                <Grid
                    templateColumns={[`repeat(2, 1fr)`, `repeat(2, 1fr)`, `repeat(${columnCount}, 1fr)`]}
                    gap={[3, 4, 6]}
                >
                    {videos.map((video, index) => (
                        <MotionBox
                            key={video._id}
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
                            >
                                <Box position="relative">
                                    <Image
                                        src={video.thumbnailUrl || "/default-thumbnail.jpg"}
                                        alt={video.title}
                                        borderTopRadius="lg"
                                        objectFit="cover"
                                        w="100%"
                                        h={["120px", "150px", "180px"]} // Responsive height
                                    />
                                    {/* Rest of image overlay content */}
                                </Box>
                                <Box p={[2, 3, 4]}> {/* Responsive padding */}
                                    {video.category && (
                                        <Badge colorScheme="green" mb={2} fontSize={["xs", "xs", "sm"]}>
                                            {video.category}
                                        </Badge>
                                    )}
                                    <Heading size={["xs", "sm", "md"]} mb={2} noOfLines={1}>
                                        {video.title}
                                    </Heading>
                                    <Text fontSize={["xs", "xs", "sm"]} color="gray.400" noOfLines={[1, 2, 2]}>
                                        {video.description}
                                    </Text>
                                </Box>
                            </GridItem>
                        </MotionBox>
                    ))}
                </Grid>

                {videos.length === 0 && (
                    <Box textAlign="center" py={10}>
                        <Text fontSize="lg" color="gray.500">No videos available.</Text>
                    </Box>
                )}
            </Box>

            {/* Video Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
                <ModalOverlay bg="rgba(0, 0, 0, 0.8)" />
                <ModalContent bg="dark.800" color="white">
                    <ModalHeader>{selectedVideo?.title}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        {selectedVideo && (
                            <Box>
                                <Box borderRadius="md" overflow="hidden" mb={4}>
                                    <video
                                        src={selectedVideo.videoUrl}
                                        controls
                                        autoPlay
                                        width="100%"
                                        style={{ borderRadius: "8px" }}
                                    />
                                </Box>
                                <Text fontSize="sm" color="gray.300">
                                    {selectedVideo.description}
                                </Text>
                            </Box>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Container>
    );
}