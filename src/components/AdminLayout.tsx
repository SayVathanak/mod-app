// components/AdminLayout.tsx

import { ReactNode, useState, useRef } from "react";
import {
    Box,
    Flex,
    Text,
    Heading,
    Icon,
    Link,
    HStack,
    VStack,
    Tooltip,
    IconButton,
    Drawer,
    DrawerBody,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    useBreakpointValue,
    Container,
} from "@chakra-ui/react";
import NextLink from "next/link";
import {
    FaNewspaper,
    FaBook,
    FaMap,
    FaVideo,
    FaHome,
    FaUser,
    FaCog,
    FaBars,
} from "react-icons/fa";
import { useRouter } from "next/router";
import { KhmerTitle } from "./shared/KhmerTitle";

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

interface AdminLayoutProps {
    children: ReactNode;
}

// Define the NavItem type
interface NavItemType {
    name: string;
    icon: React.ElementType;
    path: string;
}

// Props for the NavItem component
interface NavItemProps {
    item: NavItemType;
    isMobileView?: boolean;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const router = useRouter();
    const currentPath = router.pathname;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = useRef<HTMLButtonElement>(null);
    const isMobile = useBreakpointValue({ base: true, md: false });

    const navItems: NavItemType[] = [
        { name: "Dashboard", icon: FaHome, path: "/admin" },
        { name: "News", icon: FaNewspaper, path: "/admin/news" },
        { name: "Books", icon: FaBook, path: "/admin/books" },
        { name: "Maps", icon: FaMap, path: "/admin/maps" },
        { name: "Videos", icon: FaVideo, path: "/admin/videos" },
        { name: "Settings", icon: FaCog, path: "/admin/settings" },
        { name: "User Management", icon: FaUser, path: "/admin/users" },
    ];

    const isActive = (path: string) => currentPath === path;

    // Navigation item component with proper typing
    const NavItem = ({ item, isMobileView = false }: NavItemProps) => (
        <Tooltip
            label={item.name}
            placement="bottom"
            hasArrow
            isDisabled={!isMobile || isMobileView}
            openDelay={300}
        >
            <Link
                as={NextLink}
                href={item.path}
                py={isMobileView ? 4 : 2}
                px={isMobileView ? 4 : 3}
                borderRadius="md"
                _hover={{
                    bg: isActive(item.path) ? COLORS.greenAccentHover : COLORS.darkLayerTwo,
                }}
                display="flex"
                alignItems="center"
                justifyContent={isMobileView ? "flex-start" : "center"}
                flexDirection={isMobileView ? "row" : { base: "column", lg: "row" }}
                fontWeight={isActive(item.path) ? "bold" : "normal"}
                bg={isActive(item.path) ? COLORS.greenAccent : "transparent"}
                color={isActive(item.path) ? COLORS.goldAccent : COLORS.textPrimary}
                transition="all 0.2s"
                w={isMobileView ? "full" : "auto"}
                onClick={isMobileView ? onClose : undefined}
            >
                <Icon
                    as={item.icon}
                    boxSize={5}
                    mr={isMobileView ? 3 : { base: 0, lg: 2 }}
                    mb={{ base: isMobileView ? 0 : 1, lg: 0 }}
                />
                <Text
                    display={{ base: isMobileView ? "block" : "none", lg: "block" }}
                    whiteSpace="nowrap"
                >
                    {item.name}
                </Text>
            </Link>
        </Tooltip>
    );

    return (
        <Flex direction="column" bg={COLORS.darkBg} color={COLORS.textPrimary} minHeight="100vh">
            {/* Top Navigation Bar */}
            <Box
                as="header"
                bg={COLORS.darkLayerOne}
                borderBottomWidth="1px"
                borderBottomColor={COLORS.darkBorder}
                position="fixed"
                top="0"
                left="0"
                right="0"
                zIndex="10"
                px={4}
                py={2}
                boxShadow="sm"
            >
                <Flex justify="space-between" align="center" maxW="container.xl" mx="auto">
                    <Flex align="center">
                        <img src="/images/logo.svg" alt="ក្រសួង Logo" width="36" height="36" />
                        <Heading size="md" color={COLORS.goldAccent} display={{ base: "block", sm: "block" }}>
                            <KhmerTitle size={'sm'} >ក្រសួងការពារជាតិ</KhmerTitle>
                        </Heading>
                    </Flex>

                    {/* Desktop Navigation */}
                    <HStack
                        spacing={1}
                        display={{ base: "none", md: "flex" }}
                        alignItems="center"
                        justifyContent="center"
                    >
                        {navItems.map((item) => (
                            <NavItem key={item.name} item={item} />
                        ))}
                    </HStack>

                    {/* Mobile Menu Button */}
                    <IconButton
                        ref={btnRef}
                        icon={<Icon as={FaBars} />}
                        aria-label="Open Menu"
                        variant="ghost"
                        display={{ base: "flex", md: "none" }}
                        color={COLORS.goldAccent}
                        onClick={onOpen}
                        _hover={{ bg: COLORS.darkLayerTwo }}
                    />
                </Flex>
            </Box>

            {/* Mobile Drawer */}
            <Drawer
                isOpen={isOpen}
                placement="right"
                onClose={onClose}
                finalFocusRef={btnRef}
                size={isMobile ? "full" : "xs"}
            >
                <DrawerOverlay />
                <DrawerContent bg={COLORS.darkLayerOne} color={COLORS.textPrimary}>
                    <DrawerBody p={0}>
                        <VStack spacing={0} align="stretch" pt={0} pb={6}>
                            <Box py={4} px={4} borderBottomWidth="1px" borderBottomColor={COLORS.darkBorder}>
                                <Flex align="center" justify="space-between">
                                    <Flex align="center">
                                        <img src="/images/logo.svg" alt="ក្រសួង Logo" width="36" height="36" />
                                        <Heading size="md" color={COLORS.goldAccent}>
                                            <KhmerTitle size="sm">ក្រសួងការពារជាតិ</KhmerTitle>
                                        </Heading>
                                    </Flex>
                                    <DrawerCloseButton position="static" color={COLORS.goldAccent} />
                                </Flex>
                            </Box>
                            {navItems.map((item) => (
                                <Box key={item.name}>
                                    <NavItem item={item} isMobileView={true} />
                                </Box>
                            ))}
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            {/* Main Content */}
            <Box
                as="main"
                flex="1"
                mt="60px"
                width="100%"
                bg={COLORS.darkBg}
                minHeight="calc(100vh - 60px)"
                pt={6}
                px={4}
            >
                <Container maxW="container.xl" px={{ base: 2, md: 4 }}>
                    {children}
                </Container>
            </Box>
        </Flex>
    );
};

export default AdminLayout;