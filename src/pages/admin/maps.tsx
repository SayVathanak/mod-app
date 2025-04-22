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
import AdminLayout from "@/components/AdminLayout";

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
  const [imagesLoading, setImagesLoading] = useState<{ [key: string]: boolean }>({});
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

  const fetchMaps = async () => {
    try {
      const res = await fetch("/api/maps");
      if (!res.ok) throw new Error("Failed to fetch maps");
      const data = await res.json();
      setMaps(data);

      // Initialize loading state for each map image
      const loadingState: { [key: string]: boolean } = {};
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
    <AdminLayout>
      <Box p={{ base: 0, md: 6 }}>
        <Heading
          color={COLORS.textPrimary}
          size={{ base: "md", md: "lg" }}
          mb={6}
        >
          Map Management
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
              <Icon as={FaMap} boxSize={6} color={COLORS.goldAccent} mr={3} />
              <Heading size="sm" color={COLORS.textPrimary}>{editingId ? "Edit Map" : "Upload New Map"}</Heading>
            </Flex>

            <VStack spacing={5} align="stretch">
              <FormControl isRequired>
                <FormLabel color={COLORS.textPrimary}>Map Title</FormLabel>
                <Input
                  placeholder="Enter map title"
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
                  placeholder="Enter map description"
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
                <FormLabel color={COLORS.textPrimary}>Map File</FormLabel>
                <Button
                  leftIcon={<FaUpload />}
                  variant="outline"
                  borderColor={COLORS.goldAccent}
                  color={COLORS.goldAccent}
                  _hover={{ bg: COLORS.darkLayerTwo }}
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
                  bg={COLORS.greenAccent}
                  color={COLORS.textPrimary}
                  _hover={{ bg: COLORS.greenAccentHover }}
                  leftIcon={editingId ? <FaEdit /> : <FaPlus />}
                  flex="1"
                >
                  {editingId ? "Update Map" : "Upload Map"}
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

          {/* Maps List Section */}
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
              <Heading size="lg" color={COLORS.textPrimary}>Map Library</Heading>
              <Badge bg={COLORS.greenAccent} color={COLORS.textPrimary} fontSize="md" px={3} py={1} borderRadius="full">
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
                <Icon as={FaMapMarkedAlt} boxSize={12} mb={4} color={COLORS.goldAccent} />
                <Text fontSize="sm" color={COLORS.textPrimary}>No maps have been uploaded yet</Text>
                <Text color={COLORS.textSecondary}>Maps you upload will appear here</Text>
              </Flex>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
                {maps.map((map) => (
                  <Card
                    key={map._id}
                    borderRadius="lg"
                    overflow="hidden"
                    borderWidth="1px"
                    borderColor={COLORS.darkBorder}
                    bgColor={COLORS.darkLayerTwo}
                    transition="all 0.3s"
                    _hover={{ transform: "translateY(-4px)", boxShadow: "dark-lg", borderColor: COLORS.goldAccent }}
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
                            bg={COLORS.goldAccent}
                            color="white"
                            position="absolute"
                            top="2"
                            right="2"
                            opacity={0.8}
                            _hover={{ opacity: 1, bg: COLORS.goldAccentHover }}
                            as="a"
                            href={map.mapUrl}
                            target="_blank"
                          />
                        </>
                      ) : (
                        <Flex
                          height="100%"
                          bgGradient={`linear(to-r, ${COLORS.greenAccent}, ${COLORS.darkLayerOne})`}
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
                        <Heading size="md" noOfLines={1} color={COLORS.textPrimary}>{map.title}</Heading>
                        <Text noOfLines={3} fontSize="sm" color={COLORS.textPrimary}>{map.description}</Text>
                      </Stack>
                    </CardBody>

                    <Divider borderColor={COLORS.darkBorder} />

                    <CardFooter pt={2}>
                      <HStack spacing={3} width="100%">
                        <IconButton
                          aria-label="Edit map"
                          icon={<FaEdit />}
                          variant="ghost"
                          color={COLORS.goldAccent}
                          _hover={{ bg: COLORS.darkLayerOne }}
                          flex="1"
                          onClick={() => handleEdit(map)}
                        />
                        <IconButton
                          aria-label="Delete map"
                          icon={<FaTrash />}
                          variant="ghost"
                          color="red.400"
                          _hover={{ bg: COLORS.darkLayerOne }}
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
    </AdminLayout>
  );
}