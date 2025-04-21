// import { Box, Heading, SimpleGrid, Link } from "@chakra-ui/react";
// import NextLink from "next/link";

// export default function AdminDashboard() {
//     return (
//         <Box p={6}>
//             <Heading mb={6}>Admin Dashboard</Heading>
//             <SimpleGrid columns={[1, 2, 4]} spacing={5}>
//                 {["news", "books", "maps", "videos"].map((section) => (
//                     <Link key={section} as={NextLink} href={`/admin/${section}`} fontSize="xl" p={4} border="1px solid #ccc" borderRadius="md">
//                         Manage {section}
//                     </Link>
//                 ))}
//             </SimpleGrid>
//         </Box>
//     );
// }
import { Box } from "@chakra-ui/react";
import AdminDashboard from "@/components/AdminDashboard";

export default function AdminPage() {
    return (
        <Box>
            <AdminDashboard />
        </Box>
    );
}