import { useEffect, useState } from "react";
import {
    Box,
    Heading,
    Text,
    Image,
    Grid,
    GridItem,
    Spinner,
} from "@chakra-ui/react";

type MapType = {
    _id: string;
    title: string;
    description: string;
    mapUrl?: string;
};

export default function MapsPage() {
    const [maps, setMaps] = useState<MapType[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMaps = async () => {
        const res = await fetch("/api/maps");
        const data = await res.json();
        setMaps(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchMaps();
    }, []);

    return (
        <Box p={[4, 6, 8]}>
            <Heading mb={6}>Explore Maps</Heading>

            {loading ? (
                <Spinner />
            ) : (
                <Grid
                    templateColumns={["1fr", "repeat(2, 1fr)", "repeat(3, 1fr)"]}
                    gap={6}
                >
                    {maps.map((map) => (
                        <GridItem
                            key={map._id}
                            p={4}
                            borderWidth="1px"
                            borderRadius="md"
                            _hover={{ shadow: "md" }}
                        >
                            {map.mapUrl && (
                                <Image
                                    src={map.mapUrl}
                                    alt={map.title}
                                    borderRadius="md"
                                    mb={3}
                                    w="100%"
                                    h="200px"
                                    objectFit="cover"
                                />
                            )}
                            <Heading size="md" mb={1}>
                                {map.title}
                            </Heading>
                            <Text fontSize="sm" noOfLines={3}>
                                {map.description}
                            </Text>
                        </GridItem>
                    ))}
                </Grid>
            )}
        </Box>
    );
}
