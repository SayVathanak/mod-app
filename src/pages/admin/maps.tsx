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
  Skeleton,
} from "@chakra-ui/react";
import { 
  FaMap, 
  FaPlus, 
  FaTrash, 
  FaEdit, 
  FaUpload, 
  FaMapMarkedAlt,
  FaExpand,
} from "react-icons/fa";

type MapType = {
  _id?: string;
  title: string;
  description: string;
  mapUrl?: string;
  createdAt?: string;
};

export default function AdminMaps() {
  const [maps, setMaps] = useState<MapType[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mapFile, setMapFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imagesLoading, setImagesLoading] = useState<{[key: string]: boolean}>({});
  const toast = useToast();

  // Chakra UI color mode values
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentColor = "green.600";
  const secondaryColor = "green.400";

  const fetchMaps = async () => {
    try {
      const res = await fetch("/api/maps");
      if (!res.ok) throw new Error("Failed to fetch maps");
      const data = await res.json();
      setMaps(data);
      
      // Initialize loading state for each map image
      const loadingState: {[key: string]: boolean} = {};
      data.forEach((map: MapType) => {
        if (map._id) loadingState[map._id] = true;
      });
      setImagesLoading(loadingState);
    } catch (error) {
      console.error("Error fetching maps:", error);
      toast({
        title: "Error fetching maps",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpload = async (): Promise<string | null> => {
    if (!mapFile) return null;
    
    const formData = new FormData();
    formData.append("file", mapFile);
    
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
        title: "Map upload failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return null;
    }
  };

  const createMap = async () => {
    if (!title || !description) {
      toast({
        title: "Missing information",
        description: "Please provide a title and description for the map",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setUploading(true);
    try {
      const mapUrl = await handleUpload();
      
      if (!mapUrl && !editingId) {
        toast({
          title: "Map file required",
          description: "Please upload a map file",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        setUploading(false);
        return;
      }

      const method = editingId ? "PUT" : "POST";
      const endpoint = editingId ? `/api/maps/${editingId}` : "/api/maps";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          description, 
          mapUrl: mapUrl || (editingId ? maps.find(m => m._id === editingId)?.mapUrl : undefined),
        }),
      });

      if (!response.ok) throw new Error("Failed to save map");

      toast({
        title: editingId ? "Map updated" : "Map uploaded",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      resetForm();
      fetchMaps();
    } catch (error) {
      console.error("Error saving map:", error);
      toast({
        title: "Error saving map",
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
    setDescription("");
    setMapFile(null);
    setEditingId(null);
  };

  const handleEdit = (map: MapType) => {
    setTitle(map.title);
    setDescription(map.description);
    setEditingId(map._id || null);
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    
    if (!window.confirm("Are you sure you want to delete this map?")) return;
    
    try {
      const res = await fetch(`/api/maps/${id}`, {
        method: "DELETE",
      });
      
      if (!res.ok) throw new Error("Failed to delete map");
      
      toast({
        title: "Map deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      fetchMaps();
    } catch (error) {
      console.error("Error deleting map:", error);
      toast({
        title: "Error deleting map",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleImageLoad = (id: string | undefined) => {
    if (id) {
      setImagesLoading(prev => ({
        ...prev,
        [id]: false
      }));
    }
  };

  useEffect(() => {
    fetchMaps();
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
            <Icon as={FaMap} boxSize={6} color={accentColor} mr={3} />
            <Heading size="lg">{editingId ? "Edit Map" : "Upload New Map"}</Heading>
          </Flex>

          <VStack spacing={5} align="stretch">
            <FormControl isRequired>
              <FormLabel>Map Title</FormLabel>
              <Input
                placeholder="Enter map title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                focusBorderColor={accentColor}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Enter map description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                minH="150px"
                focusBorderColor={accentColor}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Map File</FormLabel>
              <Button
                leftIcon={<FaUpload />}
                variant="outline"
                color={accentColor}
                onClick={() => document.getElementById("map-upload")?.click()}
                width="full"
              >
                {mapFile ? mapFile.name : "Select Map File"}
              </Button>
              <Input
                id="map-upload"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setMapFile(e.target.files?.[0] || null)}
                display="none"
              />
            </FormControl>

            <HStack spacing={4} pt={4}>
              <Button
                onClick={createMap}
                isLoading={uploading}
                loadingText={editingId ? "Updating..." : "Uploading..."}
                colorScheme="green"
                leftIcon={editingId ? <FaEdit /> : <FaPlus />}
                flex="1"
              >
                {editingId ? "Update Map" : "Upload Map"}
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

        {/* Maps List Section */}
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
            <Heading size="lg">Map Library</Heading>
            <Badge colorScheme="green" fontSize="md" px={3} py={1} borderRadius="full">
              {maps.length} Maps
            </Badge>
          </Flex>

          {maps.length === 0 ? (
            <Flex 
              direction="column" 
              align="center" 
              justify="center" 
              py={10}
              opacity={0.7}
            >
              <Icon as={FaMapMarkedAlt} boxSize={12} mb={4} color={secondaryColor} />
              <Text fontSize="lg">No maps have been uploaded yet</Text>
              <Text>Maps you upload will appear here</Text>
            </Flex>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
              {maps.map((map) => (
                <Card 
                  key={map._id} 
                  borderRadius="lg" 
                  overflow="hidden" 
                  borderWidth="1px" 
                  borderColor={borderColor}
                  bgColor={cardBgColor}
                  transition="all 0.3s"
                  _hover={{ transform: "translateY(-4px)", boxShadow: "xl" }}
                >
                  <Box position="relative" height="180px" overflow="hidden">
                    {map.mapUrl ? (
                      <>
                        <Skeleton isLoaded={!imagesLoading[map._id || '']}>
                          <Image 
                            src={map.mapUrl} 
                            alt={map.title} 
                            width="100%" 
                            height="100%" 
                            objectFit="cover" 
                            onLoad={() => handleImageLoad(map._id)}
                            onError={() => handleImageLoad(map._id)}
                          />
                        </Skeleton>
                        <IconButton
                          aria-label="View full map"
                          icon={<FaExpand />}
                          size="sm"
                          colorScheme="green"
                          position="absolute"
                          top="2"
                          right="2"
                          opacity={0.8}
                          _hover={{ opacity: 1 }}
                          as="a"
                          href={map.mapUrl}
                          target="_blank"
                        />
                      </>
                    ) : (
                      <Flex 
                        height="100%" 
                        bgGradient={`linear(to-r, ${accentColor}, ${secondaryColor})`}
                        color="white"
                        justify="center"
                        align="center"
                      >
                        <Icon as={FaMapMarkedAlt} boxSize={12} />
                      </Flex>
                    )}
                  </Box>
                  
                  <CardBody>
                    <Stack spacing={3}>
                      <Heading size="md" noOfLines={1}>{map.title}</Heading>
                      <Text noOfLines={3} fontSize="sm">{map.description}</Text>
                    </Stack>
                  </CardBody>
                  
                  <Divider />
                  
                  <CardFooter pt={2}>
                    <HStack spacing={3} width="100%">
                      <IconButton
                        aria-label="Edit map"
                        icon={<FaEdit />}
                        colorScheme="green"
                        variant="ghost"
                        flex="1"
                        onClick={() => handleEdit(map)}
                      />
                      <IconButton
                        aria-label="Delete map"
                        icon={<FaTrash />}
                        colorScheme="red"
                        variant="ghost"
                        flex="1"
                        onClick={() => handleDelete(map._id)}
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