import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Input,
  Textarea,
  VStack,
  Text,
  Image,
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
} from "@chakra-ui/react";
import {
  FaNewspaper,
  FaPlus,
  FaTrash,
  FaEdit,
  FaUpload,
  FaEye,
  FaCalendarAlt,
} from "react-icons/fa";
import AdminLayout from "@/components/AdminLayout";

type NewsItem = {
  _id?: string;
  title: string;
  body: string;
  imageUrl?: string;
  createdAt?: string;
};

export default function AdminNews() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const toast = useToast();

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

  const fetchNews = async () => {
    try {
      const res = await fetch("/api/news");
      if (!res.ok) throw new Error("Failed to fetch news");
      const data = await res.json();
      setNewsList(data);
    } catch (error) {
      console.error("Error fetching news:", error);
      toast({
        title: "Error fetching news",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUploadImage = async (): Promise<string | null> => {
    if (!image) return null;

    const formData = new FormData();
    formData.append("file", image);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      return data.url;
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Image upload failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return null;
    }
  };

  const createNews = async () => {
    if (!title || !body) {
      toast({
        title: "Missing information",
        description: "Please provide a title and content for the news item",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await handleUploadImage();

      const method = editingId ? "PUT" : "POST";
      const endpoint = editingId ? `/api/news/${editingId}` : "/api/news";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          body,
          imageUrl: imageUrl || (editingId ? newsList.find(item => item._id === editingId)?.imageUrl : undefined),
        }),
      });

      if (!response.ok) throw new Error("Failed to save news item");

      toast({
        title: editingId ? "News updated" : "News published",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      resetForm();
      fetchNews();
    } catch (error) {
      console.error("Error saving news:", error);
      toast({
        title: "Error saving news",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setBody("");
    setImage(null);
    setEditingId(null);
  };

  const handleEdit = (item: NewsItem) => {
    setTitle(item.title);
    setBody(item.body);
    setEditingId(item._id || null);
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;

    if (!window.confirm("Are you sure you want to delete this news item?")) return;

    try {
      const res = await fetch(`/api/news/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete news item");

      toast({
        title: "News item deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      fetchNews();
    } catch (error) {
      console.error("Error deleting news:", error);
      toast({
        title: "Error deleting news",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <AdminLayout>
      <Box p={{ base: 0, md: 6 }}>
        <Heading
          color={COLORS.textPrimary}
          size={{ base: "md", md: "lg" }}
          mb={6}
        >
          News Management
        </Heading>

        <Flex direction={{ base: "column", lg: "row" }} gap={8}>
          {/* Form Section */}
          <Box
            flex="1"
            p={{ base: 4, md: 6 }}
            bg={COLORS.darkLayerOne}
            borderRadius="lg"
            boxShadow="dark-lg"
            borderWidth="1px"
            borderColor={COLORS.darkBorder}
          >
            <Flex align="center" mb={6}>
              <Icon as={FaNewspaper} boxSize={6} color={COLORS.goldAccent} mr={3} />
              <Heading size="sm" color={COLORS.textPrimary}>{editingId ? "Edit News" : "Create News Article"}</Heading>
            </Flex>

            <VStack spacing={5} align="stretch">
              <FormControl isRequired>
                <FormLabel color={COLORS.textPrimary}>News Title</FormLabel>
                <Input
                  placeholder="Enter headline"
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
                <FormLabel color={COLORS.textPrimary}>Content</FormLabel>
                <Textarea
                  placeholder="Enter news content"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  minH="200px"
                  focusBorderColor={COLORS.goldAccent}
                  bg={COLORS.darkLayerTwo}
                  borderColor={COLORS.darkBorder}
                  _hover={{ borderColor: COLORS.goldAccent }}
                  color={COLORS.textPrimary}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={COLORS.textPrimary}>Featured Image</FormLabel>
                <Button
                  leftIcon={<FaUpload />}
                  variant="outline"
                  borderColor={COLORS.goldAccent}
                  color={COLORS.goldAccent}
                  _hover={{ bg: COLORS.darkLayerTwo }}
                  onClick={() => document.getElementById("image-upload")?.click()}
                  width="full"
                >
                  {image ? image.name : "Select Image"}
                </Button>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  display="none"
                />
              </FormControl>

              <HStack spacing={4} pt={4}>
                <Button
                  onClick={createNews}
                  isLoading={uploading}
                  loadingText={editingId ? "Updating..." : "Publishing..."}
                  bg={COLORS.greenAccent}
                  color={COLORS.textPrimary}
                  _hover={{ bg: COLORS.greenAccentHover }}
                  leftIcon={editingId ? <FaEdit /> : <FaPlus />}
                  flex="1"
                >
                  {editingId ? "Update Article" : "Publish Article"}
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

          {/* News List Section */}
          <Box
            flex="1.5"
            p={{ base: 4, md: 6 }}
            bg={COLORS.darkLayerOne}
            borderRadius="lg"
            boxShadow="dark-lg"
            borderWidth="1px"
            borderColor={COLORS.darkBorder}
            maxH={{ base: "auto", lg: "80vh" }}
            overflowY="auto"
          >
            <Flex justify="space-between" align="center" mb={6}>
              <Heading size="sm" color={COLORS.textPrimary}>News Articles</Heading>
              <Badge bg={COLORS.greenAccent} color={COLORS.textPrimary} fontSize="md" px={3} py={1} borderRadius="full">
                {newsList.length} Articles
              </Badge>
            </Flex>

            {newsList.length === 0 ? (
              <Flex
                direction="column"
                align="center"
                justify="center"
                py={10}
                opacity={0.7}
              >
                <Icon as={FaNewspaper} boxSize={12} mb={4} color={COLORS.goldAccent} />
                <Text fontSize="lg" color={COLORS.textPrimary}>No news articles have been published yet</Text>
                <Text color={COLORS.textSecondary}>Articles you publish will appear here</Text>
              </Flex>
            ) : (
              <VStack spacing={5} align="stretch">
                {newsList.map((item) => (
                  <Card
                    key={item._id}
                    direction={{ base: 'column', sm: 'row' }}
                    overflow="hidden"
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor={COLORS.darkBorder}
                    bgColor={COLORS.darkLayerTwo}
                    transition="all 0.3s"
                    _hover={{ transform: "translateY(-2px)", boxShadow: "dark-lg", borderColor: COLORS.goldAccent }}
                  >
                    {item.imageUrl && (
                      <Box w={{ base: "100%", sm: "200px" }} h={{ base: "200px", sm: "auto" }}>
                        <Image
                          objectFit="cover"
                          width="100%"
                          height="100%"
                          src={item.imageUrl}
                          alt={item.title}
                        />
                      </Box>
                    )}

                    <Stack flex="1">
                      <CardBody>
                        <Heading size="md" color={COLORS.textPrimary}>{item.title}</Heading>

                        <HStack spacing={2} mt={2} mb={3}>
                          <Tag size="sm" bg={COLORS.greenAccent} color={COLORS.textPrimary} variant="subtle">
                            <Icon as={FaCalendarAlt} mr={1} />
                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "No date"}
                          </Tag>
                        </HStack>

                        <Text noOfLines={3} color={COLORS.textPrimary}>{item.body}</Text>
                      </CardBody>

                      <CardFooter pt={0}>
                        <HStack spacing={3}>
                          <IconButton
                            aria-label="View article"
                            icon={<FaEye />}
                            color={COLORS.goldAccent}
                            variant="ghost"
                            size="sm"
                            _hover={{ bg: COLORS.darkLayerOne }}
                          />
                          <IconButton
                            aria-label="Edit article"
                            icon={<FaEdit />}
                            color={COLORS.goldAccent}
                            variant="ghost"
                            size="sm"
                            _hover={{ bg: COLORS.darkLayerOne }}
                            onClick={() => handleEdit(item)}
                          />
                          <IconButton
                            aria-label="Delete article"
                            icon={<FaTrash />}
                            color="red.400"
                            variant="ghost"
                            size="sm"
                            _hover={{ bg: COLORS.darkLayerOne }}
                            onClick={() => handleDelete(item._id)}
                          />
                        </HStack>
                      </CardFooter>
                    </Stack>
                  </Card>
                ))}
              </VStack>
            )}
          </Box>
        </Flex>
      </Box>
    </AdminLayout>
  );
}