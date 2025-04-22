import {
  Box,
  Flex,
  Button,
  IconButton,
  HStack,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Text,
  Container,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
  Tooltip,
  Icon,
  useBreakpointValue,
  Skeleton
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { useRef, useEffect, useState } from 'react';
import { HamburgerIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { useUser, useAuth, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';
import {
  FaNewspaper,
  FaBook,
  FaMap,
  FaVideo,
  FaCog,
  FaUsers,
  FaFileAlt
} from "react-icons/fa";

// Types for our data
interface ContentItem {
  id: string;
  title: string;
  slug: string;
  publishedAt?: string;
  author?: string;
}

// Define color constants for consistent theming
const COLORS = {
  darkBg: "#0A0D0B",
  darkBgAlt: "#121A14",
  darkGreen: {
    500: "#1A2C1F",
    600: "#264D33",
    700: "#3E7E50",
  },
  black: {
    900: "#0A0D0B",
    800: "#121A14",
    700: "#1A2C1F",
  },
  accent: {
    gold: "#BFA46F",
    brightGold: "#D4B86A",
    mutedGold: "#8F7B4E",
  },
  text: {
    light: "#E0E0E0",
    muted: "#A0A0A0",
  }
};

// Define navigation items with icons and dropdown flags
const navItems = [
  {
    label: 'News',
    href: '/news',
    icon: FaNewspaper,
    hasDropdown: true
  },
  {
    label: 'Books',
    href: '/books',
    icon: FaBook,
    hasDropdown: true
  },
  {
    label: 'Maps',
    href: '/maps',
    icon: FaMap,
    hasDropdown: false
  },
  {
    label: 'Videos',
    href: '/videos',
    icon: FaVideo,
    hasDropdown: false
  },
];

// Admin navigation items
const adminNavItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: FaCog,
    hasDropdown: false
  },
  {
    label: 'Content',
    href: '/admin/content',
    icon: FaFileAlt,
    hasDropdown: false
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: FaUsers,
    hasDropdown: false
  }
];

interface HeaderProps {
  news?: ContentItem[];
  books?: ContentItem[];
  isLoading?: boolean;
}

const Header = ({ news = [], books = [], isLoading = false }: HeaderProps) => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);
  const { user, isLoaded: isUserLoaded } = useUser();
  const { isLoaded: isAuthLoaded } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check if we're in admin area
  const isAdminPage = router.pathname.startsWith('/admin');

  // Responsive variables
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Header colors based on scroll state
  const headerBg = useColorModeValue(
    scrolled ? COLORS.black[900] : 'rgba(10, 13, 11, 0.95)',
    scrolled ? COLORS.black[900] : 'rgba(10, 13, 11, 0.95)'
  );
  const borderColor = COLORS.darkGreen[500];

  // Detect scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Set mounted state to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine if user is an admin based on Clerk role
  useEffect(() => {
    if (isUserLoaded && user) {
      setIsAdmin(user.publicMetadata.role === 'admin');
    }
  }, [isUserLoaded, user]);

  // Skip rendering header on admin pages
  if (isAdminPage) {
    return null;
  }

  // Content mapping for dropdowns
  const contentMap: Record<string, ContentItem[]> = {
    '/news': news,
    '/books': books
  };

  // Get dropdown content based on path
  const getDropdownContent = (path: string): ContentItem[] => {
    if (isLoading) {
      // Return empty array when loading
      return [];
    }
    return contentMap[path] || [];
  };

  // Final navigation items
  const finalNavItems = isAdmin ? [...navItems, ...adminNavItems] : navItems;

  if (!mounted) {
    return (
      <Box
        as="header"
        bg={headerBg}
        boxShadow={scrolled ? "md" : "none"}
        position="sticky"
        top={0}
        zIndex={10}
        transition="all 0.3s ease"
        backdropFilter="blur(10px)"
        borderBottom="1px solid"
        borderBottomColor={borderColor}
      >
        <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
          <Flex
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            py={{ base: 3, md: 4 }}
            gap={4}
          >
            <Skeleton height="40px" width="150px" />
            <Skeleton height="40px" width="40px" />
          </Flex>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      as="header"
      bg={headerBg}
      boxShadow={scrolled ? "md" : "none"}
      position="sticky"
      top={0}
      zIndex={10}
      transition="all 0.3s ease"
      backdropFilter="blur(10px)"
      borderBottom="1px solid"
      borderBottomColor={borderColor}
    >
      <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
        <Flex
          as="nav"
          align="center"
          justify="space-between"
          wrap="wrap"
          py={{ base: 3, md: 4 }}
          gap={4}
        >
          {/* Logo and Site Title */}
          {/* Logo - Left side */}
          <Flex align="center" flex="0 0 auto" mr={{ base: 0, md: 5 }}>
            <NextLink href="/" passHref>
              <Box display="flex" alignItems="center">
                <img
                  src="/images/logo.svg"
                  alt="ក្រសួងការពារជាតិ Logo"
                  width={isMobile ? "36" : "40"}
                  height={isMobile ? "36" : "40"}
                />
                <Text
                  className="khmer-heading"
                  ml={3}
                  fontSize={{ base: "md", md: "md" }}
                  fontWeight="medium"
                  color={COLORS.accent.gold}
                  display={{ base: "block", sm: "block" }}
                  sx={{
                    fontFamily: "'Moul', 'Dangrek', 'Battambang', sans-serif"
                  }}
                >
                  ក្រសួងការពារជាតិ
                </Text>
              </Box>
            </NextLink>
          </Flex>

          {/* Desktop Navigation */}
          <HStack
            spacing={{ base: 1, lg: 3 }}
            display={{ base: 'none', md: 'flex' }}
            flex="1"
            justify="center"
            px={4}
          >
            {finalNavItems.map((item) => (
              item.hasDropdown ? (
                <Menu key={item.href} strategy="fixed">
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    variant="ghost"
                    px={3}
                    py={2}
                    fontWeight="medium"
                    color={router.pathname.startsWith(item.href) ? COLORS.accent.brightGold : COLORS.accent.gold}
                    _hover={{
                      bg: 'transparent',
                      color: COLORS.text.light
                    }}
                    size="sm"
                  >
                    <Icon as={item.icon} mr={2} />
                    {item.label}
                  </MenuButton>
                  <Portal>
                    <MenuList
                      minWidth="200px"
                      zIndex={20}
                      bg={COLORS.black[800]}
                      borderColor={COLORS.darkGreen[500]}
                    >
                      {isLoading ? (
                        // Show loading skeletons when content is loading
                        Array(3).fill(0).map((_, i) => (
                          <MenuItem key={i} bg={COLORS.black[800]}>
                            <Skeleton height="20px" width="100%" />
                          </MenuItem>
                        ))
                      ) : (
                        // Original content rendering
                        getDropdownContent(item.href).map((content) => (
                          <MenuItem
                            key={content.id}
                            as={NextLink}
                            href={`${item.href}/${content.slug}`}
                            fontSize="sm"
                            bg={COLORS.black[800]}
                            color={COLORS.text.light}
                            _hover={{ bg: COLORS.black[700], color: COLORS.accent.brightGold }}
                          >
                            {content.title}
                          </MenuItem>
                        ))
                      )}
                      <MenuItem
                        as={NextLink}
                        href={item.href}
                        fontSize="sm"
                        fontWeight="medium"
                        bg={COLORS.black[800]}
                        color={COLORS.accent.gold}
                        _hover={{ bg: COLORS.black[700], color: COLORS.accent.brightGold }}
                      >
                        View all {item.label}
                      </MenuItem>
                    </MenuList>
                  </Portal>
                </Menu>
              ) : (
                <NextLink key={item.href} href={item.href} passHref>
                  <Button
                    as="a"
                    variant="ghost"
                    px={3}
                    py={2}
                    size="sm"
                    fontWeight="medium"
                    color={router.pathname.startsWith(item.href) ? COLORS.accent.brightGold : COLORS.accent.gold}
                    _hover={{
                      bg: 'transparent',
                      color: COLORS.text.light
                    }}
                    aria-current={router.pathname === item.href ? 'page' : undefined}
                    position="relative"
                    _after={router.pathname.startsWith(item.href) ? {
                      content: '""',
                      position: 'absolute',
                      width: '60%',
                      height: '2px',
                      bottom: '0',
                      left: '20%',
                      bg: COLORS.darkGreen[500],
                      borderRadius: 'full'
                    } : undefined}
                  >
                    <Icon as={item.icon} mr={2} />
                    {item.label}
                  </Button>
                </NextLink>
              )
            ))}
          </HStack>

          {/* Authentication - Desktop */}
          <HStack spacing={3} display={{ base: 'none', md: 'flex' }} flex="0 0 auto">
            {!isAuthLoaded ? (
              <Skeleton height="40px" width="100px" />
            ) : user ? (
              <>
                {isAdmin && (
                  <NextLink href="/admin" passHref>
                    <Tooltip label="Admin Panel" placement="bottom">
                      <Button
                        colorScheme="green"
                        variant="outline"
                        size="sm"
                        // leftIcon={<Box as="span" fontSize="sm">👑</Box>}
                        borderColor={COLORS.darkGreen[500]}
                        color={COLORS.text.light}
                        _hover={{
                          bg: COLORS.darkGreen[600],
                          borderColor: COLORS.accent.gold,
                          color: COLORS.accent.brightGold
                        }}
                      >
                        Admin
                      </Button>
                    </Tooltip>
                  </NextLink>
                )}
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: {
                        width: '36px',
                        height: '36px'
                      }
                    }
                  }}
                />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button
                    variant="outline"
                    size="sm"
                    borderColor={COLORS.darkGreen[500]}
                    color={COLORS.text.light}
                    _hover={{
                      bg: COLORS.darkGreen[600],
                      borderColor: COLORS.accent.gold,
                      color: COLORS.accent.brightGold
                    }}
                  >
                    Login
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button
                    size="sm"
                    bg={COLORS.darkGreen[500]}
                    color={COLORS.text.light}
                    _hover={{
                      bg: COLORS.darkGreen[600],
                      color: COLORS.accent.brightGold
                    }}
                  >
                    Register
                  </Button>
                </SignUpButton>
              </>
            )}
          </HStack>

          {/* Mobile Menu Button */}
          <Box display={{ base: 'flex', md: 'none' }} justifyContent="flex-end" flex="1">
            <IconButton
              ref={btnRef}
              onClick={onOpen}
              icon={<HamburgerIcon />}
              variant="ghost"
              aria-label="Open menu"
              size="lg"
              color={COLORS.accent.gold}
              _hover={{
                bg: 'transparent',
                color: COLORS.text.light
              }}
            />
          </Box>
        </Flex>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        size={{ base: "full", sm: "xs" }}
      >
        <DrawerOverlay />
        <DrawerContent bg={COLORS.darkBgAlt} color={COLORS.text.light}>
          <DrawerHeader borderBottomWidth="1px" borderColor={borderColor} px={4}>
            <Flex justify="space-between" align="center">
              <Flex align="center">
                <img src="/images/logo.svg" alt="ក្រសួងការពារជាតិ Logo" width="36" height="36" />
                <Text
                  className="khmer-heading"
                  ml={3}
                  fontSize="lg"
                  fontWeight="medium"
                  color={COLORS.accent.gold}
                  sx={{
                    fontFamily: "'Moul', 'Dangrek', 'Battambang', sans-serif"
                  }}
                >
                  ក្រសួងការពារជាតិ
                </Text>
              </Flex>
              <DrawerCloseButton position="static" color={COLORS.accent.gold} />
            </Flex>
          </DrawerHeader>
          <DrawerBody p={0}>
            <VStack spacing={0} align="stretch">
              {finalNavItems.map((item) => (
                <Box key={item.href}>
                  <NextLink href={item.href} passHref>
                    <Box
                      as="a"
                      px={6}
                      py={4}
                      fontWeight="medium"
                      borderBottomWidth="1px"
                      borderColor={COLORS.darkGreen[500]}
                      color={router.pathname.startsWith(item.href) ? COLORS.accent.brightGold : COLORS.accent.gold}
                      bg={router.pathname.startsWith(item.href) ? COLORS.black[700] : 'transparent'}
                      _hover={{ bg: COLORS.black[700] }}
                      onClick={onClose}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Flex align="center">
                        <Icon as={item.icon} mr={3} />
                        {item.label}
                      </Flex>
                      {item.hasDropdown && (
                        <ChevronDownIcon />
                      )}
                    </Box>
                  </NextLink>

                  {/* Dropdown items for mobile */}
                  {item.hasDropdown && (
                    <VStack
                      spacing={0}
                      align="stretch"
                      bg={COLORS.black[900]}
                      borderBottomWidth="1px"
                      borderColor={COLORS.darkGreen[500]}
                    >
                      {isLoading ? (
                        // Show loading skeletons for mobile
                        Array(3).fill(0).map((_, i) => (
                          <Box
                            key={i}
                            px={8}
                            py={3}
                            borderBottomWidth="1px"
                            borderBottomColor={COLORS.black[800]}
                          >
                            <Skeleton height="20px" width="100%" />
                          </Box>
                        ))
                      ) : (
                        getDropdownContent(item.href).map((content) => (
                          <NextLink key={content.id} href={`${item.href}/${content.slug}`} passHref>
                            <Box
                              as="a"
                              px={8}
                              py={3}
                              fontSize="sm"
                              color={COLORS.text.muted}
                              _hover={{ bg: COLORS.black[800], color: COLORS.accent.brightGold }}
                              onClick={onClose}
                              borderBottomWidth="1px"
                              borderBottomColor={COLORS.black[800]}
                            >
                              {content.title}
                            </Box>
                          </NextLink>
                        ))
                      )}
                      <NextLink href={item.href} passHref>
                        <Box
                          as="a"
                          px={8}
                          py={3}
                          fontSize="sm"
                          fontWeight="medium"
                          color={COLORS.accent.gold}
                          _hover={{ bg: COLORS.black[800], color: COLORS.accent.brightGold }}
                          onClick={onClose}
                        >
                          View All {item.label} →
                        </Box>
                      </NextLink>
                    </VStack>
                  )}
                </Box>
              ))}

              {/* Authentication - Mobile */}
              <Box px={6} py={6} borderTopWidth="1px" borderColor={COLORS.darkGreen[500]}>
                {!isAuthLoaded ? (
                  <VStack spacing={4}>
                    <Skeleton height="40px" width="100%" />
                    <Skeleton height="40px" width="100%" />
                  </VStack>
                ) : user ? (
                  <VStack align="stretch" spacing={4}>
                    <Flex alignItems="center" justify="space-between">
                      <Box>
                        <Text fontWeight="medium">{user.fullName || user.username || 'Account'}</Text>
                        <Text fontSize="sm" color={COLORS.text.muted}>
                          {user.primaryEmailAddress?.emailAddress}
                          {isAdmin && (
                            <Text as="span" color={COLORS.accent.brightGold} ml={2}>(Admin)</Text>
                          )}
                        </Text>
                      </Box>
                      <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            userButtonAvatarBox: {
                              width: '40px',
                              height: '40px'
                            }
                          }
                        }}
                      />
                    </Flex>

                    {isAdmin && (
                      <NextLink href="/admin" passHref>
                        <Button
                          as="a"
                          w="full"
                          colorScheme="green"
                          leftIcon={<Box as="span" fontSize="sm">👑</Box>}
                          onClick={onClose}
                          bg={COLORS.darkGreen[500]}
                          color={COLORS.text.light}
                          _hover={{
                            bg: COLORS.darkGreen[600],
                            color: COLORS.accent.brightGold
                          }}
                        >
                          Admin Panel
                        </Button>
                      </NextLink>
                    )}
                  </VStack>
                ) : (
                  <VStack spacing={4}>
                    <SignInButton mode="modal">
                      <Button
                        as="a"
                        w="full"
                        variant="outline"
                        onClick={onClose}
                        borderColor={COLORS.darkGreen[500]}
                        color={COLORS.text.light}
                        _hover={{
                          bg: COLORS.darkGreen[600],
                          borderColor: COLORS.accent.gold,
                          color: COLORS.accent.brightGold
                        }}
                      >
                        Login
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button
                        as="a"
                        w="full"
                        onClick={onClose}
                        bg={COLORS.darkGreen[500]}
                        color={COLORS.text.light}
                        _hover={{
                          bg: COLORS.darkGreen[600],
                          color: COLORS.accent.brightGold
                        }}
                      >
                        Register
                      </Button>
                    </SignUpButton>
                  </VStack>
                )}
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Header;