import { useEffect, useState, useRef } from "react";
import {
    Box,
    Button,
    Heading,
    Input,
    Textarea,
    VStack,
    Text,
    Flex,
    Icon,
    Badge,
    SimpleGrid,
    Card,
    CardBody,
    CardFooter,
    Stack,
    Divider,
    HStack,
    IconButton,
    FormControl,
    FormLabel,
    useToast,
    Tag,
    AspectRatio,
    Progress,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Image,
    Tooltip,
} from "@chakra-ui/react";
import {
    FaVideo,
    FaPlus,
    FaTrash,
    FaEdit,
    FaUpload,
    FaPlayCircle,
    FaImage,
    FaExclamationTriangle,
    FaCheck,
    FaClock
} from "react-icons/fa";

type Video = {
    _id?: string;
    title: string;
    description: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    duration?: string;
    createdAt?: string;
};

export default function AdminVideos() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [editingId, setEditingId] = useState<string | null>(null);
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

    // Custom color scheme - dark with green accents
    const bgMain = "black";
    const cardBg = "gray.900";
    const cardBorder = "gray.800";
    const accentColor = "green.700"; // Dark green accent
    const accentHover = "green.600";
    const textColor = "gray.100";
    const subTextColor = "gray.400";
    const buttonBg = "green.700";

    const videoInputRef = useRef<HTMLInputElement>(null);
    const thumbnailInputRef = useRef<HTMLInputElement>(null);

    const fetchVideos = async () => {
        try {
            const res = await fetch("/api/videos");
            if (!res.ok) throw new Error("Failed to fetch videos");
            const data = await res.json();
            setVideos(data);
        } catch (error) {
            console.error("Error fetching videos:", error);
            toast({
                title: "Error fetching videos",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const simulateProgress = () => {
        setUploadProgress(0);
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 95) {
                    clearInterval(interval);
                    return 95;
                }
                return prev + 5;
            });
        }, 300);
        return () => clearInterval(interval);
    };

    const handleUpload = async (file: File | null): Promise<string | null> => {
        if (!file) return null;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            setUploadProgress(100);
            return data.url;
        } catch (error) {
            console.error("Upload error:", error);
            toast({
                title: "Upload failed",
                description: "There was an error uploading your file",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return null;
        }
    };

    const createVideo = async () => {
        if (!title || !description) {
            toast({
                title: "Missing information",
                description: "Please provide a title and description for the video",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        if (!videoFile && !editingId) {
            toast({
                title: "Video file required",
                description: "Please upload a video file",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setUploading(true);
        const stopProgress = simulateProgress();

        try {
            const videoUrl = videoFile ? await handleUpload(videoFile) : undefined;
            const thumbnailUrl = thumbnail ? await handleUpload(thumbnail) : undefined;

            const method = editingId ? "PUT" : "POST";
            const endpoint = editingId ? `/api/videos/${editingId}` : "/api/videos";

            const videoData = {
                title,
                description,
                videoUrl: videoUrl || (editingId ? videos.find(v => v._id === editingId)?.videoUrl : undefined),
                thumbnailUrl: thumbnailUrl || (editingId ? videos.find(v => v._id === editingId)?.thumbnailUrl : undefined),
            };

            const response = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(videoData),
            });

            if (!response.ok) throw new Error("Failed to save video");

            toast({
                title: editingId ? "Video updated" : "Video uploaded",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            resetForm();
            fetchVideos();
        } catch (error) {
            console.error("Error saving video:", error);
            toast({
                title: "Error saving video",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            stopProgress();
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setVideoFile(null);
        setThumbnail(null);
        setEditingId(null);
    };

    const handleEdit = (video: Video) => {
        setTitle(video.title);
        setDescription(video.description);
        setEditingId(video._id || null);
    };

    const handleDelete = async (id: string | undefined) => {
        if (!id) return;

        if (!window.confirm("Are you sure you want to delete this video?")) return;

        try {
            const res = await fetch(`/api/videos/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete video");

            toast({
                title: "Video deleted",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            fetchVideos();
        } catch (error) {
            console.error("Error deleting video:", error);
            toast({
                title: "Error deleting video",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const openVideoModal = (video: Video) => {
        setSelectedVideo(video);
        onOpen();
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    return (
        <Box p={6} bg={bgMain} minH="100vh" color={textColor}>
            <Flex direction={{ base: "column", lg: "row" }} gap={8}>
                {/* Form Section */}
                <Box
                    flex="1"
                    p={6}
                    bg={cardBg}
                    borderRadius="lg"
                    boxShadow="dark-lg"
                    borderWidth="1px"
                    borderColor={cardBorder}
                >
                    <Flex align="center" mb={6}>
                        <Icon as={FaVideo} boxSize={6} color={accentColor} mr={3} />
                        <Heading size="lg" color="white">{editingId ? "Edit Video" : "Upload New Video"}</Heading>
                    </Flex>

                    <VStack spacing={5} align="stretch">
                        <FormControl isRequired>
                            <FormLabel color={textColor}>Video Title</FormLabel>
                            <Input
                                placeholder="Enter video title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                focusBorderColor={accentColor}
                                bg="gray.800"
                                borderColor={cardBorder}
                                _hover={{ borderColor: "gray.600" }}
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel color={textColor}>Description</FormLabel>
                            <Textarea
                                placeholder="Enter video description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                minH="150px"
                                focusBorderColor={accentColor}
                                bg="gray.800"
                                borderColor={cardBorder}
                                _hover={{ borderColor: "gray.600" }}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel color={textColor}>Video File</FormLabel>
                            <Button
                                leftIcon={<FaUpload />}
                                variant="outline"
                                borderColor={accentColor}
                                color={accentColor}
                                _hover={{ bg: "gray.800" }}
                                onClick={() => videoInputRef.current?.click()}
                                width="full"
                            >
                                {videoFile ? videoFile.name : "Select Video File"}
                            </Button>
                            <Input
                                ref={videoInputRef}
                                type="file"
                                accept="video/*"
                                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                                display="none"
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel color={textColor}>Thumbnail Image</FormLabel>
                            <Button
                                leftIcon={<FaImage />}
                                variant="outline"
                                borderColor={accentColor}
                                color={accentColor}
                                _hover={{ bg: "gray.800" }}
                                onClick={() => thumbnailInputRef.current?.click()}
                                width="full"
                            >
                                {thumbnail ? thumbnail.name : "Select Thumbnail Image"}
                            </Button>
                            <Input
                                ref={thumbnailInputRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                                display="none"
                            />
                        </FormControl>

                        {uploading && (
                            <Box mt={2}>
                                <Text mb={1} fontSize="sm" color={subTextColor}>
                                    {uploadProgress < 100 ? "Uploading..." : "Processing..."}
                                </Text>
                                <Progress
                                    value={uploadProgress}
                                    size="sm"
                                    colorScheme="green"
                                    borderRadius="full"
                                    isAnimated
                                />
                            </Box>
                        )}

                        <HStack spacing={4} pt={4}>
                            <Button
                                onClick={createVideo}
                                isLoading={uploading}
                                loadingText={editingId ? "Updating..." : "Uploading..."}
                                bg={buttonBg}
                                color="white"
                                _hover={{ bg: accentHover }}
                                leftIcon={editingId ? <FaEdit /> : <FaPlus />}
                                flex="1"
                            >
                                {editingId ? "Update Video" : "Upload Video"}
                            </Button>

                            {editingId && (
                                <Button
                                    onClick={resetForm}
                                    variant="outline"
                                    borderColor={cardBorder}
                                    color={textColor}
                                    _hover={{ bg: "gray.800" }}
                                >
                                    Cancel
                                </Button>
                            )}
                        </HStack>
                    </VStack>
                </Box>

                {/* Videos List Section */}
                <Box
                    flex="1.5"
                    p={6}
                    bg={cardBg}
                    borderRadius="lg"
                    boxShadow="dark-lg"
                    borderWidth="1px"
                    borderColor={cardBorder}
                    maxH="85vh"
                    overflowY="auto"
                >
                    <Flex justify="space-between" align="center" mb={6}>
                        <Heading size="lg" color="white">Video Library</Heading>
                        <Badge bg={accentColor} color="white" fontSize="md" px={3} py={1} borderRadius="full">
                            {videos.length} Videos
                        </Badge>
                    </Flex>

                    {videos.length === 0 ? (
                        <Flex
                            direction="column"
                            align="center"
                            justify="center"
                            py={10}
                            opacity={0.7}
                        >
                            <Icon as={FaVideo} boxSize={12} mb={4} color={accentColor} />
                            <Text fontSize="lg" color={textColor}>No videos have been uploaded yet</Text>
                            <Text color={subTextColor}>Videos you upload will appear here</Text>
                        </Flex>
                    ) : (
                        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
                            {videos.map((video) => (
                                <Card
                                    key={video._id}
                                    borderRadius="lg"
                                    overflow="hidden"
                                    borderWidth="1px"
                                    borderColor={cardBorder}
                                    bgColor="gray.800"
                                    transition="all 0.3s"
                                    _hover={{ transform: "translateY(-4px)", boxShadow: "dark-lg", borderColor: accentColor }}
                                >
                                    <Box position="relative">
                                        {video.thumbnailUrl ? (
                                            <Image
                                                src={video.thumbnailUrl}
                                                alt={video.title}
                                                width="100%"
                                                height="180px"
                                                objectFit="cover"
                                            />
                                        ) : video.videoUrl ? (
                                            <AspectRatio ratio={16 / 9} maxH="180px">
                                                <video src={video.videoUrl} poster="" />
                                            </AspectRatio>
                                        ) : (
                                            <Flex
                                                height="180px"
                                                bgGradient={`linear(to-r, ${accentColor}, green.900)`}
                                                color="white"
                                                justify="center"
                                                align="center"
                                            >
                                                <Icon as={FaVideo} boxSize={12} />
                                            </Flex>
                                        )}

                                        <IconButton
                                            aria-label="Play video"
                                            icon={<FaPlayCircle />}
                                            bg={accentColor}
                                            color="white"
                                            _hover={{ bg: accentHover, opacity: 1 }}
                                            size="lg"
                                            position="absolute"
                                            top="50%"
                                            left="50%"
                                            transform="translate(-50%, -50%)"
                                            borderRadius="full"
                                            opacity={0.9}
                                            onClick={() => openVideoModal(video)}
                                            isDisabled={!video.videoUrl}
                                        />


                                        {video.duration && (
                                            <Tag
                                                position="absolute"
                                                bottom="2"
                                                right="2"
                                                bg="blackAlpha.700"
                                                color="white"
                                                size="sm"
                                            >
                                                <Icon as={FaClock} mr={1} fontSize="xs" />
                                                {video.duration}
                                            </Tag>
                                        )}
                                    </Box>

                                    <CardBody>
                                        <Stack spacing={3}>
                                            <Heading size="md" noOfLines={1} color="white">{video.title}</Heading>
                                            <Text noOfLines={2} fontSize="sm" color={subTextColor}>{video.description}</Text>
                                        </Stack>
                                    </CardBody>

                                    <Divider borderColor="gray.700" />

                                    <CardFooter pt={2}>
                                        <HStack spacing={3} width="100%">
                                            <Tooltip label="Preview Video">
                                                <IconButton
                                                    aria-label="Preview video"
                                                    icon={<FaPlayCircle />}
                                                    variant="ghost"
                                                    color="blue.400"
                                                    _hover={{ bg: "gray.700" }}
                                                    flex="1"
                                                    onClick={() => openVideoModal(video)}
                                                    isDisabled={!video.videoUrl}
                                                />
                                            </Tooltip>
                                            <Tooltip label="Edit Video">
                                                <IconButton
                                                    aria-label="Edit video"
                                                    icon={<FaEdit />}
                                                    variant="ghost"
                                                    color="green.400"
                                                    _hover={{ bg: "gray.700" }}
                                                    flex="1"
                                                    onClick={() => handleEdit(video)}
                                                />
                                            </Tooltip>
                                            <Tooltip label="Delete Video">
                                                <IconButton
                                                    aria-label="Delete video"
                                                    icon={<FaTrash />}
                                                    variant="ghost"
                                                    color="red.400"
                                                    _hover={{ bg: "gray.700" }}
                                                    flex="1"
                                                    onClick={() => handleDelete(video._id)}
                                                />
                                            </Tooltip>
                                        </HStack>
                                    </CardFooter>
                                </Card>
                            ))}
                        </SimpleGrid>
                    )}
                </Box>
            </Flex>

            {/* Video Preview Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
                <ModalOverlay />
                <ModalContent bg="gray.900" color={textColor}>
                    <ModalHeader>{selectedVideo?.title}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        {selectedVideo?.videoUrl ? (
                            <AspectRatio ratio={16 / 9} mb={3}>
                                <video src={selectedVideo.videoUrl} controls autoPlay />
                            </AspectRatio>
                        ) : (
                            <Flex
                                direction="column"
                                align="center"
                                justify="center"
                                py={10}
                                bg="gray.800"
                                borderRadius="md"
                            >
                                <Icon as={FaExclamationTriangle} boxSize={10} mb={3} color="yellow.500" />
                                <Text align="center">Video file not available</Text>
                            </Flex>
                        )}
                        {selectedVideo?.description && (
                            <Box mt={4}>
                                <Text fontWeight="bold" mb={2} color="white">Description:</Text>
                                <Text color={subTextColor}>{selectedVideo.description}</Text>
                            </Box>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
}