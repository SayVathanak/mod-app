// pages/maps/index.tsx
import { useEffect, useState } from "react";
import {
    Box,
    Heading,
    Text,
    Image,
    Grid,
    GridItem,
    Spinner,
    Flex,
    Icon,
    Badge,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Container,
    useBreakpointValue,
    HStack
} from "@chakra-ui/react";
import { FaMapMarkedAlt, FaSearch, FaEye } from "react-icons/fa";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

type MapType = {
    _id: string;
    title: string;
    description: string;
    mapUrl?: string;
    category?: string;
    region?: string;
};

export default function MapsPage() {
    const [maps, setMaps] = useState<MapType[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMap, setSelectedMap] = useState<MapType | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const columnCount = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 3 });

    const fetchMaps = async () => {
        try {
            const res = await fetch("/api/maps");
            const data = await res.json();
            setMaps(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching maps:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaps();
    }, []);

    const handleMapClick = (map: MapType) => {
        setSelectedMap(map);
        onOpen();
    };

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
                        Explore Maps
                    </Heading>

                    <HStack spacing={4} mt={[4, 0]}>
                        <Button
                            leftIcon={<FaSearch />}
                            variant="outline"
                            size="sm"
                        >
                            Search
                        </Button>
                    </HStack>
                </Flex>

                <Grid
                    templateColumns={[`repeat(2, 1fr)`, `repeat(2, 1fr)`, `repeat(${columnCount}, 1fr)`]}
                    gap={[3, 4, 6]}
                >
                    {maps.map((map, index) => (
                        <MotionBox
                            key={map._id}
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
                                cursor="pointer"
                                onClick={() => handleMapClick(map)}
                            >
                                <Box position="relative">
                                    <Image
                                        src={map.mapUrl || "/default-map.jpg"}
                                        alt={map.title}
                                        borderTopRadius="lg"
                                        w="100%"
                                        h="200px"
                                        objectFit="cover"
                                    />
                                    <Box
                                        position="absolute"
                                        top={0}
                                        left={0}
                                        right={0}
                                        bottom={0}
                                        bg="rgba(0, 0, 0, 0.4)"
                                        opacity={0}
                                        _hover={{ opacity: 1 }}
                                        transition="opacity 0.3s"
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        <Button
                                            leftIcon={<Icon as={FaEye} />}
                                            variant="solid"
                                            size="sm"
                                        >
                                            View Map
                                        </Button>
                                    </Box>
                                </Box>
                                <Box p={4}>
                                    <Flex justify="space-between" mb={2}>
                                        {map.category && (
                                            <Badge colorScheme="green">
                                                {map.category}
                                            </Badge>
                                        )}
                                        {map.region && (
                                            <Badge variant="outline" colorScheme="blue">
                                                {map.region}
                                            </Badge>
                                        )}
                                    </Flex>
                                    <Heading size="md" mb={2} noOfLines={1}>
                                        {map.title}
                                    </Heading>
                                    <Text fontSize="sm" color="gray.400" noOfLines={3}>
                                        {map.description}
                                    </Text>
                                </Box>
                            </GridItem>
                        </MotionBox>
                    ))}
                </Grid>

                {maps.length === 0 && (
                    <Box textAlign="center" py={10}>
                        <Text fontSize="lg" color="gray.500">No maps available.</Text>
                    </Box>
                )}
            </Box>

            {/* Map Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
                <ModalOverlay bg="rgba(0, 0, 0, 0.8)" />
                <ModalContent bg="dark.800" color="white">
                    <ModalHeader>
                        <Flex align="center">
                            <Icon as={FaMapMarkedAlt} mr={2} color="brand.500" />
                            {selectedMap?.title}
                        </Flex>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        {selectedMap && (
                            <Box>
                                <Box borderRadius="md" overflow="hidden" mb={4}>
                                    <Image
                                        src={selectedMap.mapUrl || "/default-map.jpg"}
                                        alt={selectedMap.title}
                                        w="100%"
                                    />
                                </Box>
                                <Text fontSize="md" color="gray.300" mb={4}>
                                    {selectedMap.description}
                                </Text>
                                <Flex justify="space-between">
                                    {selectedMap.category && (
                                        <Badge colorScheme="green">
                                            {selectedMap.category}
                                        </Badge>
                                    )}
                                    {selectedMap.region && (
                                        <Badge variant="outline" colorScheme="blue">
                                            {selectedMap.region}
                                        </Badge>
                                    )}
                                </Flex>
                            </Box>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Container>
    );
}