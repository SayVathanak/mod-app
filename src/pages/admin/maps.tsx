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
} from "@chakra-ui/react";

type MapType = {
    _id?: string;
    title: string;
    description: string;
    mapUrl?: string;
};

export default function AdminMaps() {
    const [maps, setMaps] = useState<MapType[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [mapFile, setMapFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const fetchMaps = async () => {
        const res = await fetch("/api/maps");
        const data = await res.json();
        setMaps(data);
    };

    const handleUpload = async (): Promise<string | null> => {
        if (!mapFile) return null;
        const formData = new FormData();
        formData.append("file", mapFile);
        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });
        const data = await res.json();
        return data.url;
    };

    const createMap = async () => {
        setUploading(true);
        const mapUrl = await handleUpload();
        setUploading(false);

        await fetch("/api/maps", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description, mapUrl }),
        });

        setTitle("");
        setDescription("");
        setMapFile(null);
        fetchMaps();
    };

    useEffect(() => {
        fetchMaps();
    }, []);

    return (
        <Box p={6}>
            <Heading mb={4}>Manage Maps</Heading>

            <VStack spacing={4} align="stretch" mb={6}>
                <Input
                    placeholder="Map Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <Textarea
                    placeholder="Map Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Input
                    type="file"
                    onChange={(e) => setMapFile(e.target.files?.[0] || null)}
                />
                <Button onClick={createMap} isLoading={uploading} colorScheme="teal">
                    Upload Map
                </Button>
            </VStack>

            <Heading size="md" mb={2}>
                Uploaded Maps
            </Heading>

            <VStack spacing={4} align="stretch">
                {maps.map((map) => (
                    <Box
                        key={map._id}
                        p={4}
                        borderWidth="1px"
                        borderRadius="md"
                        _hover={{ shadow: "md" }}
                    >
                        {map.mapUrl && (
                            <Image src={map.mapUrl} alt={map.title} mb={3} borderRadius="md" />
                        )}
                        <Text fontWeight="bold">{map.title}</Text>
                        <Text noOfLines={2}>{map.description}</Text>
                    </Box>
                ))}
            </VStack>
        </Box>
    );
}
