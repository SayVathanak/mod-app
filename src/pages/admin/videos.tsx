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
} from "react-icons/fa";
import AdminLayout from "@/components/AdminLayout";

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

  // Military-inspired color scheme
  const COLORS = {
    darkBg: "#0A0D0B",
    darkLayerOne: "#121712",
    darkLayerTwo: "#1A211C",
    darkBorder: "#2A332C",
    goldAccent: "#BFA46F",
    goldAccentHover: "#D4B86A",
    greenAccent: "#2C3B2D",
    greenAccentHover: "#3A4C3B",
    textPrimary: "#E5E5E0",
    textSecondary: "#A0A29E",
  };

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
      const endpoint = editingId ? `/ api / videos / ${ editingId } ` : "/api/videos";

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
      const res = await fetch(`/ api / videos / ${ id } `, {
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
        <AdminLayout>
            <Box p={{ base: 0, md: 8 }}>
                <Heading
                    color={COLORS.textPrimary}
                    size={{ base: "md", md: "lg" }}
                    mb={8}
                >
                    Video Management
                </Heading>

                <Flex direction={{ base: "column", lg: "row" }} gap={8}>
                    {/* Form Section */}
                    <Box
                        flex="1"
                        maxW={{ lg: "600px" }}
                        p={6}
                        bg={COLORS.darkLayerOne}
                        borderRadius="lg"
                        boxShadow="dark-lg"
                        borderWidth="1px"
                        borderColor={COLORS.darkBorder}
                    >
                        <Flex align="center" mb={6}>
                            <Icon as={FaVideo} boxSize={6} color={COLORS.goldAccent} mr={3} />
                            <Heading size="sm" color={COLORS.textPrimary}>
                                {editingId ? "Edit Video" : "Upload New Video"}
                            </Heading>
                        </Flex>

                        <VStack spacing={5} align="stretch">
                            <FormControl isRequired>
                                <FormLabel color={COLORS.textPrimary}>Video Title</FormLabel>
                                <Input
                                    placeholder="Enter video title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    focusBorderColor={COLORS.goldAccent}
                                    bg={COLORS.darkLayerTwo}
                                    borderColor={COLORS.darkBorder}
                                    _hover={{ borderColor: COLORS.goldAccent }}
                                    color={COLORS.textPrimary}
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel color={COLORS.textPrimary}>Description</FormLabel>
                                <Textarea
                                    placeholder="Enter video description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    minH="150px"
                                    focusBorderColor={COLORS.goldAccent}
                                    bg={COLORS.darkLayerTwo}
                                    borderColor={COLORS.darkBorder}
                                    _hover={{ borderColor: COLORS.goldAccent }}
                                    color={COLORS.textPrimary}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel color={COLORS.textPrimary}>Video File</FormLabel>
                                <Button
                                    leftIcon={<FaUpload />}
                                    variant="outline"
                                    borderColor={COLORS.goldAccent}
                                    color={COLORS.goldAccent}
                                    _hover={{ bg: COLORS.darkLayerTwo }}
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
                                <FormLabel color={COLORS.textPrimary}>Thumbnail Image</FormLabel>
                                <Button
                                    leftIcon={<FaImage />}
                                    variant="outline"
                                    borderColor={COLORS.goldAccent}
                                    color={COLORS.goldAccent}
                                    _hover={{ bg: COLORS.darkLayerTwo }}
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
                                    <Text mb={1} fontSize="sm" color={COLORS.textSecondary}>
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
                                    bg={COLORS.greenAccent}
                                    color={COLORS.textPrimary}
                                    _hover={{ bg: COLORS.greenAccentHover }}
                                    leftIcon={editingId ? <FaEdit /> : <FaPlus />}
                                    flex="1"
                                >
                                    {editingId ? "Update Video" : "Upload Video"}
                                </Button>

                                {editingId && (
                                    <Button
                                        onClick={resetForm}
                                        variant="outline"
                                        borderColor={COLORS.darkBorder}
                                        color={COLORS.textPrimary}
                                        _hover={{ bg: COLORS.darkLayerTwo }}
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </HStack>
                        </VStack>
                    </Box>

                    {/* Videos List Section */}
                    <Box
                        flex="2"
                        p={6}
                        bg={COLORS.darkLayerOne}
                        borderRadius="lg"
                        boxShadow="dark-lg"
                        borderWidth="1px"
                        borderColor={COLORS.darkBorder}
                        maxH={{ base: "auto", lg: "calc(100vh - 180px)" }}
                        overflowY="auto"
                    >
                        <Flex justify="space-between" align="center" mb={6}>
                            <Heading size="lg" color={COLORS.textPrimary}>Video Library</Heading>
                            <Badge bg={COLORS.greenAccent} color={COLORS.textPrimary} fontSize="md" px={3} py={1} borderRadius="full">
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
                                <Icon as={FaVideo} boxSize={12} mb={4} color={COLORS.goldAccent} />
                                <Text fontSize="lg" color={COLORS.textPrimary}>No videos have been uploaded yet</Text>
                                <Text color={COLORS.textSecondary}>Videos you upload will appear here</Text>
                            </Flex>
                        ) : (
                            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
                                {videos.map((video) => (
                                    <Card
                                        key={video._id}
                                        borderRadius="lg"
                                        overflow="hidden"
                                        borderWidth="1px"
                                        borderColor={COLORS.darkBorder}
                                        bgColor={COLORS.darkLayerTwo}
                                        transition="all 0.3s"
                                        _hover={{ transform: "translateY(-4px)", boxShadow: "dark-lg", borderColor: COLORS.goldAccent }}
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
                                                    bgGradient={`linear(to-r, ${COLORS.greenAccent}, ${COLORS.darkLayerOne})`}
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
                                                bg={COLORS.goldAccent}
                                                color="white"
                                                _hover={{ bg: COLORS.goldAccentHover, opacity: 1 }}
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
                                                    {video.duration}
                                                </Tag>
                                            )}
                                        </Box>

                                        <CardBody>
                                            <Stack spacing={3}>
                                                <Heading size="md" noOfLines={1} color={COLORS.textPrimary}>{video.title}</Heading>
                                                <Text noOfLines={2} fontSize="sm" color={COLORS.textSecondary}>{video.description}</Text>
                                            </Stack>
                                        </CardBody>

                                        <Divider borderColor={COLORS.darkBorder} />

                                        <CardFooter pt={2}>
                                            <HStack spacing={3} width="100%">
                                                <Tooltip label="Preview Video">
                                                    <IconButton
                                                        aria-label="Preview video"
                                                        icon={<FaPlayCircle />}
                                                        variant="ghost"
                                                        color={COLORS.goldAccent}
                                                        _hover={{ bg: COLORS.darkLayerOne }}
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
                                                        color={COLORS.goldAccent}
                                                        _hover={{ bg: COLORS.darkLayerOne }}
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
                                                        _hover={{ bg: COLORS.darkLayerOne }}
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
                    <ModalContent bg={COLORS.darkLayerOne} color={COLORS.textPrimary}>
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
                                    bg={COLORS.darkLayerTwo}
                                    borderRadius="md"
                                >
                                    <Icon as={FaExclamationTriangle} boxSize={10} mb={3} color="yellow.500" />
                                    <Text align="center">Video file not available</Text>
                                </Flex>
                            )}
                            {selectedVideo?.description && (
                                <Box mt={4}>
                                    <Text fontWeight="bold" mb={2} color={COLORS.textPrimary}>Description:</Text>
                                    <Text color={COLORS.textSecondary}>{selectedVideo.description}</Text>
                                </Box>
                            )}
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </Box>
        </AdminLayout>
    );
}