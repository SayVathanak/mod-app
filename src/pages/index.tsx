import { Box, Heading, SimpleGrid, Link } from "@chakra-ui/react";
import NextLink from "next/link";

export default function Home() {
  return (
    <Box p={6}>
      <Heading mb={6}>Welcome to MediaVerse</Heading>
      <SimpleGrid columns={[1, 2, 4]} spacing={5}>
        {["news", "books", "maps", "videos"].map((section) => (
          <Link key={section} as={NextLink} href={`/${section}`} fontSize="xl" p={4} border="1px solid #ccc" borderRadius="md">
            {section.toUpperCase()}
          </Link>
        ))}
      </SimpleGrid>
    </Box>
  );
}