// components/AdminLayout.tsx

import { ReactNode, useEffect } from "react";
import {
    Box,
    Flex,
    Text,
    Heading,
    Icon,
    Link,
    VStack,
    useColorModeValue,
    IconButton,
    Tooltip,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { FaNewspaper, FaBook, FaMap, FaVideo, FaHome, FaUser, FaCog } from "react-icons/fa";
import { useRouter } from "next/router";

// Military-inspired dark theme color palette
const COLORS = {
    darkBg: "#0A0D0B",         // Dark background
    darkLayerOne: "#121712",   // Slightly lighter background for cards
    darkLayerTwo: "#1A211C",   // Lighter background for hover states
    darkBorder: "#2A332C",     // Border color
    goldAccent: "#BFA46F",     // Military gold for accents
    goldAccentHover: "#D4B86A",// Brighter gold for hover states
    greenAccent: "#2C3B2D",    // Dark green for selected items
    greenAccentHover: "#3A4C3B",// Slightly lighter green for hover
    textPrimary: "#E5E5E0",    // Light text
    textSecondary: "#A0A29E",  // Subdued text
};

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const router = useRouter();
    const currentPath = router.pathname;

    // Navigation items for sidebar
    const navItems = [
        { name: "Dashboard", icon: FaHome, path: "/admin" },
        { name: "News", icon: FaNewspaper, path: "/admin/news" },
        { name: "Books", icon: FaBook, path: "/admin/books" },
        { name: "Maps", icon: FaMap, path: "/admin/maps" },
        { name: "Videos", icon: FaVideo, path: "/admin/videos" },
        { name: "Settings", icon: FaCog, path: "/admin/settings" },
        { name: "User Management", icon: FaUser, path: "/admin/users" },
    ];

    // Check if an item is active
    const isActive = (path: string) => currentPath === path;

    return (
        <Flex bg={COLORS.darkBg} color={COLORS.textPrimary} minHeight="100vh">
            {/* Sidebar - Responsive (icon only on smaller screens) */}
            <Box
                bg={COLORS.darkLayerOne}
                height="100vh"
                position="fixed"
                top="0"
                left="0"
                borderRightWidth="1px"
                borderRightColor={COLORS.darkBorder}
                width={{ base: "60px", lg: "300px" }}
                transition="width 0.3s ease"
                zIndex="10"
                overflowY="auto"
                overflowX="hidden"
                css={{
                    '&::-webkit-scrollbar': {
                        width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: COLORS.darkLayerOne,
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: COLORS.darkBorder,
                        borderRadius: '3px',
                    },
                }}
            >
                <VStack py={5} px={{ base: 0, lg: 3 }} align="stretch" spacing={6}>
                    <Box textAlign={{ base: "center", lg: "left" }} px={{ base: 2, lg: 4 }}>
                        {/* <Icon
                            as={FaHome}
                            boxSize={{ base: "24px", lg: "0" }}
                            display={{ base: "block", lg: "none" }}
                            mx="auto"
                            color={COLORS.goldAccent}
                        /> */}
                        <Flex
                            align="center"
                            px={{ base: 2, lg: 4 }}
                            gap={3}
                        >
                            {/* Logo - always visible */}
                            <img
                                src="/images/logo.svg"
                                alt="ក្រសួងការពារជាតិ Logo"
                                width="36"
                                height="36"
                            />

                            {/* Admin Panel heading - hidden on mobile */}
                            <Heading
                                size="md"
                                color={COLORS.goldAccent}
                                display={{ base: "none", lg: "block" }}
                            >
                                Admin Panel
                            </Heading>
                        </Flex>
                    </Box>

                    <VStack spacing={1} align="stretch" px={{ base: 1, lg: 3 }}>
                        {navItems.map((item) => (
                            <Tooltip
                                key={item.name}
                                label={item.name}
                                placement="right"
                                hasArrow
                                isDisabled={false}
                                openDelay={300}
                                display={{ base: "block", lg: "none" }}
                            >
                                <Link
                                    as={NextLink}
                                    href={item.path}
                                    py={3}
                                    px={{ base: 0, lg: 4 }}
                                    borderRadius="md"
                                    _hover={{ bg: isActive(item.path) ? COLORS.greenAccentHover : COLORS.darkLayerTwo }}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent={{ base: "center", lg: "flex-start" }}
                                    fontWeight={isActive(item.path) ? "bold" : "normal"}
                                    bg={isActive(item.path) ? COLORS.greenAccent : "transparent"}
                                    color={isActive(item.path) ? COLORS.goldAccent : COLORS.textPrimary}
                                    transition="all 0.2s"
                                >
                                    <Icon
                                        as={item.icon}
                                        boxSize={{ base: 5, lg: 4 }}
                                        mr={{ base: 0, lg: 3 }}
                                    />
                                    <Text
                                        display={{ base: "none", lg: "block" }}
                                        whiteSpace="nowrap"
                                        overflow="hidden"
                                        textOverflow="ellipsis"
                                    >
                                        {item.name}
                                    </Text>
                                </Link>
                            </Tooltip>
                        ))}
                    </VStack>
                </VStack>
            </Box>

            {/* Main content area */}
            <Box
                flex="1"
                ml={{ base: "60px", lg: "220px" }}
                width={{ base: "calc(100% - 60px)", lg: "calc(100% - 220px)" }}
                bg={COLORS.darkBg}
                minHeight="100vh"
                px={{ base: 0, md: 0 }}
                py={{ base: 0, md: 4 }}
                overflowX="auto"
            >
                {children}
            </Box>
        </Flex>
    );
};

export default AdminLayout;