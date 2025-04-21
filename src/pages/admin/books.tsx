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
  useColorModeValue,
  SimpleGrid,
  Flex,
  Icon,
  Badge,
  Divider,
  useToast,
  FormControl,
  FormLabel,
  Card,
  CardBody,
  CardFooter,
  Stack,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { FaBook, FaPlus, FaTrash, FaEdit, FaUpload } from "react-icons/fa";

type Book = {
  _id?: string;
  title: string;
  author: string;
  description: string;
  coverUrl?: string;
  pdfUrl?: string;
};

export default function AdminBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const toast = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);

  // Chakra UI color mode values
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentColor = "green.600";
  const secondaryColor = "green.400";

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/books");
      if (!res.ok) throw new Error("Failed to fetch books");
      const data = await res.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
      toast({
        title: "Error fetching books",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpload = async (file: File | null, folder: string): Promise<string | null> => {
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
      return data.url;
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return null;
    }
  };

  const createBook = async () => {
    if (!title || !author || !description) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setUploading(true);
    try {
      const coverUrl = await handleUpload(cover, "mediaverse/books/covers");
      const pdfUrl = await handleUpload(pdf, "mediaverse/books/pdfs");

      const method = editingId ? "PUT" : "POST";
      const endpoint = editingId ? `/api/books/${editingId}` : "/api/books";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          author, 
          description, 
          coverUrl: coverUrl || (editingId ? books.find(b => b._id === editingId)?.coverUrl : undefined),
          pdfUrl: pdfUrl || (editingId ? books.find(b => b._id === editingId)?.pdfUrl : undefined)
        }),
      });

      if (!response.ok) throw new Error("Failed to save book");

      toast({
        title: editingId ? "Book updated" : "Book created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      resetForm();
      fetchBooks();
    } catch (error) {
      console.error("Error saving book:", error);
      toast({
        title: "Error saving book",
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
    setAuthor("");
    setDescription("");
    setCover(null);
    setPdf(null);
    setEditingId(null);
  };

  const handleEdit = (book: Book) => {
    setTitle(book.title);
    setAuthor(book.author);
    setDescription(book.description);
    setEditingId(book._id || null);
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    
    try {
      const res = await fetch(`/api/books/${id}`, {
        method: "DELETE",
      });
      
      if (!res.ok) throw new Error("Failed to delete book");
      
      toast({
        title: "Book deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
      toast({
        title: "Error deleting book",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchBooks();
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
            <Icon as={FaBook} boxSize={6} color={accentColor} mr={3} />
            <Heading size="lg">{editingId ? "Edit Book" : "Add New Book"}</Heading>
          </Flex>

          <VStack spacing={5} align="stretch">
            <FormControl isRequired>
              <FormLabel>Book Title</FormLabel>
              <Input
                placeholder="Enter book title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                focusBorderColor={accentColor}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Author</FormLabel>
              <Input
                placeholder="Enter author name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                focusBorderColor={accentColor}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Enter book description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                minH="150px"
                focusBorderColor={accentColor}
              />
            </FormControl>

            <FormControl>
              <FormLabel>PDF File</FormLabel>
              <Button
                leftIcon={<FaUpload />}
                variant="outline"
                color={accentColor}
                onClick={() => document.getElementById("pdf-upload")?.click()}
                width="full"
              >
                {pdf ? pdf.name : "Select PDF File"}
              </Button>
              <Input
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdf(e.target.files?.[0] || null)}
                display="none"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Cover Image</FormLabel>
              <Button
                leftIcon={<FaUpload />}
                variant="outline"
                color={accentColor}
                onClick={() => document.getElementById("cover-upload")?.click()}
                width="full"
              >
                {cover ? cover.name : "Select Cover Image"}
              </Button>
              <Input
                id="cover-upload"
                type="file"
                accept="image/*"
                onChange={(e) => setCover(e.target.files?.[0] || null)}
                display="none"
              />
            </FormControl>

            <HStack spacing={4} pt={4}>
              <Button
                onClick={createBook}
                isLoading={uploading}
                loadingText={editingId ? "Updating..." : "Publishing..."}
                colorScheme="green"
                leftIcon={editingId ? <FaEdit /> : <FaPlus />}
                flex="1"
              >
                {editingId ? "Update Book" : "Publish Book"}
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

        {/* Book List Section */}
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
            <Heading size="lg">Book Library</Heading>
            <Badge colorScheme="green" fontSize="md" px={3} py={1} borderRadius="full">
              {books.length} Books
            </Badge>
          </Flex>

          {books.length === 0 ? (
            <Flex 
              direction="column" 
              align="center" 
              justify="center" 
              py={10}
              opacity={0.7}
            >
              <Icon as={FaBook} boxSize={12} mb={4} color={secondaryColor} />
              <Text fontSize="lg">No books have been added yet</Text>
              <Text>Books you publish will appear here</Text>
            </Flex>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
              {books.map((book) => (
                <Card 
                  key={book._id} 
                  borderRadius="lg" 
                  overflow="hidden" 
                  borderWidth="1px" 
                  borderColor={borderColor}
                  bgColor={cardBgColor}
                  transition="all 0.3s"
                  _hover={{ transform: "translateY(-4px)", boxShadow: "xl" }}
                >
                  <Box position="relative" height="180px" overflow="hidden">
                    {book.coverUrl ? (
                      <Image 
                        src={book.coverUrl} 
                        alt={book.title} 
                        width="100%" 
                        height="100%" 
                        objectFit="cover" 
                      />
                    ) : (
                      <Flex 
                        height="100%" 
                        bgGradient={`linear(to-r, ${accentColor}, ${secondaryColor})`}
                        color="white"
                        justify="center"
                        align="center"
                      >
                        <Icon as={FaBook} boxSize={12} />
                      </Flex>
                    )}
                  </Box>
                  
                  <CardBody>
                    <Stack spacing={3}>
                      <Heading size="md" noOfLines={1}>{book.title}</Heading>
                      <Text fontSize="sm" color="gray.500">by {book.author}</Text>
                      <Text noOfLines={3} fontSize="sm">{book.description}</Text>
                    </Stack>
                  </CardBody>
                  
                  <Divider />
                  
                  <CardFooter pt={2}>
                    <HStack spacing={3} width="100%">
                      <IconButton
                        aria-label="Edit book"
                        icon={<FaEdit />}
                        colorScheme="green"
                        variant="ghost"
                        flex="1"
                        onClick={() => handleEdit(book)}
                      />
                      <IconButton
                        aria-label="Delete book"
                        icon={<FaTrash />}
                        colorScheme="red"
                        variant="ghost"
                        flex="1"
                        onClick={() => handleDelete(book._id)}
                      />
                    </HStack>
                  </CardFooter>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </Box>
      </Flex>
    </Box>
  );
}