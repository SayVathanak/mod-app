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
  useColorModeValue,
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
  FaClock
} from "react-icons/fa";

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

  // Chakra UI color mode values
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentColor = "green.600";
  const secondaryColor = "green.400";

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
    <Box p={6} bg={bgColor} minH="100vh">
      <Flex direction={{ base: "column", lg: "row" }} gap={8}>
        {/* Form Section */}
        <Box 
          flex="1" 
          p={6} 
          bg={cardBgColor} 
          borderRadius="lg" 
          boxShadow="md" 
          borderWidth="1px" 
          borderColor={borderColor}
        >
          <Flex align="center" mb={6}>
            <Icon as={FaNewspaper} boxSize={6} color={accentColor} mr={3} />
            <Heading size="lg">{editingId ? "Edit News" : "Create News Article"}</Heading>
          </Flex>

          <VStack spacing={5} align="stretch">
            <FormControl isRequired>
              <FormLabel>News Title</FormLabel>
              <Input
                placeholder="Enter headline"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                focusBorderColor={accentColor}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Content</FormLabel>
              <Textarea
                placeholder="Enter news content"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                minH="200px"
                focusBorderColor={accentColor}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Featured Image</FormLabel>
              <Button
                leftIcon={<FaUpload />}
                variant="outline"
                color={accentColor}
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
                colorScheme="green"
                leftIcon={editingId ? <FaEdit /> : <FaPlus />}
                flex="1"
              >
                {editingId ? "Update Article" : "Publish Article"}
              </Button>
              
              {editingId && (
                <Button
                  onClick={resetForm}
                  variant="outline"
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
          p={6} 
          bg={cardBgColor} 
          borderRadius="lg" 
          boxShadow="md" 
          borderWidth="1px" 
          borderColor={borderColor}
          maxH="85vh"
          overflowY="auto"
        >
          <Flex justify="space-between" align="center" mb={6}>
            <Heading size="lg">News Articles</Heading>
            <Badge colorScheme="green" fontSize="md" px={3} py={1} borderRadius="full">
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
              <Icon as={FaNewspaper} boxSize={12} mb={4} color={secondaryColor} />
              <Text fontSize="lg">No news articles have been published yet</Text>
              <Text>Articles you publish will appear here</Text>
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
                  borderColor={borderColor}
                  bgColor={cardBgColor}
                  transition="all 0.3s"
                  _hover={{ boxShadow: "lg" }}
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
                      <Heading size="md">{item.title}</Heading>
                      
                      <HStack spacing={2} mt={2} mb={3}>
                        <Tag size="sm" colorScheme="green" variant="subtle">
                          <Icon as={FaCalendarAlt} mr={1} />
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "No date"}
                        </Tag>
                      </HStack>
                      
                      <Text noOfLines={3}>{item.body}</Text>
                    </CardBody>

                    <CardFooter pt={0}>
                      <HStack spacing={3}>
                        <IconButton
                          aria-label="View article"
                          icon={<FaEye />}
                          colorScheme="blue"
                          variant="ghost"
                          size="sm"
                        />
                        <IconButton
                          aria-label="Edit article"
                          icon={<FaEdit />}
                          colorScheme="green"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        />
                        <IconButton
                          aria-label="Delete article"
                          icon={<FaTrash />}
                          colorScheme="red"
                          variant="ghost"
                          size="sm"
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
  );
}