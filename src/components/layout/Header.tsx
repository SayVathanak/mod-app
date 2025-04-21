// Header.tsx
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
  Image,
  Tooltip,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import { HamburgerIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { useUser, useAuth, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Books', href: '/books', hasDropdown: true },
  { label: 'Maps', href: '/maps' },
  { label: 'News', href: '/news', hasDropdown: true },
  { label: 'Videos', href: '/videos' },
];

const Header = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);
  const { user, isLoaded: isUserLoaded } = useUser();
  const { isLoaded: isAuthLoaded } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Check if we're in admin area
  const isAdminPage = router.pathname.startsWith('/admin');

  // Header colors based on scroll state
  const bgColor = useColorModeValue(
    scrolled ? 'white' : 'rgba(255, 255, 255, 0.95)',
    scrolled ? 'dark.800' : 'rgba(26, 32, 44, 0.95)'
  );
  const borderColor = useColorModeValue('gray.200', 'dark.700');

  // Detect scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  type DropdownType = 'books' | 'news';

  const recentContent: Record<DropdownType, { id: string; title: string; slug: string }[]> = {
    books: [
      { id: '1', title: 'Military Strategy', slug: 'military-strategy' },
      { id: '2', title: 'Defense Policy', slug: 'defense-policy' },
    ],
    news: [
      { id: '1', title: 'Recent Training Exercise', slug: 'training-exercise' },
      { id: '2', title: 'Defense Cooperation', slug: 'defense-cooperation' },
    ],
  };


  // Get dropdown content based on item type
  const getDropdownContent = (type: string) => {
    if (type in recentContent) {
      return recentContent[type as DropdownType];
    }
    return [];
  };

  return (
    <Box
      as="header"
      bg={bgColor}
      boxShadow={scrolled ? "md" : "none"}
      position="sticky"
      top={0}
      zIndex={10}
      transition="all 0.3s ease"
      backdropFilter="blur(10px)"
      borderBottom="1px solid"
      borderBottomColor={scrolled ? borderColor : 'transparent'}
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
          <Flex align="center" mr={{ base: 0, md: 5 }} flex="0 0 auto">
            <Link href="/" passHref>
              <Box display="flex" alignItems="center">
                <Box
                  bg="brand.500"
                  w={{ base: "36px", md: "40px" }}
                  h={{ base: "36px", md: "40px" }}
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="white"
                  fontWeight="bold"
                  boxShadow="sm"
                >
                  Logo
                </Box>
                <Text
                  className="khmer-heading"
                  ml={3}
                  fontSize={{ base: "md", md: "lg" }}
                  fontWeight="medium"
                  color="gray.800"
                  display={{ base: "none", sm: "block" }}
                  sx={{
                    fontFamily: "'Moul', 'Dangrek', 'Battambang', sans-serif"
                  }}
                >
                  ក្រសួងការពារជាតិ
                </Text>
              </Box>
            </Link>
          </Flex>

          {/* Desktop Navigation */}
          <HStack
            spacing={{ base: 1, lg: 3 }}
            display={{ base: 'none', md: 'flex' }}
            flex="1"
            justify="center"
          >
            {navItems.map((item) => (
              item.hasDropdown ? (
                <Menu key={item.href} strategy="fixed">
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    variant="ghost"
                    px={3}
                    py={2}
                    fontWeight="medium"
                    color={router.pathname.startsWith(item.href) ? 'brand.500' : 'gray.600'}
                    _hover={{ bg: 'transparent' }}
                    size="sm"
                  >
                    {item.label}
                  </MenuButton>
                  <Portal>
                    <MenuList minWidth="200px" zIndex={20}>
                      {getDropdownContent(item.href.substring(1)).map((content) => (
                        <MenuItem
                          key={content.id}
                          as={Link}
                          href={`${item.href}/${content.slug}`}
                          fontSize="sm"
                          _hover={{ bg: 'gray.50', color: 'brand.500' }}
                        >
                          {content.title}
                        </MenuItem>
                      ))}
                      <MenuItem
                        as={Link}
                        href={item.href}
                        fontSize="sm"
                        fontWeight="medium"
                        color="brand.500"
                        _hover={{ bg: 'gray.50' }}
                      >
                        View all {item.label}
                      </MenuItem>
                    </MenuList>
                  </Portal>
                </Menu>
              ) : (
                <Link key={item.href} href={item.href} passHref>
                  <Button
                    as="a"
                    variant="ghost"
                    px={3}
                    py={2}
                    size="sm"
                    fontWeight="medium"
                    color={router.pathname === item.href ? 'brand.500' : 'gray.600'}
                    _hover={{ bg: 'transparent' }}
                    aria-current={router.pathname === item.href ? 'page' : undefined}
                    position="relative"
                    _after={router.pathname === item.href ? {
                      content: '""',
                      position: 'absolute',
                      width: '60%',
                      height: '2px',
                      bottom: '0',
                      left: '20%',
                      bg: 'brand.500',
                      borderRadius: 'full'
                    } : undefined}
                  >
                    {item.label}
                  </Button>
                </Link>
              )
            ))}
          </HStack>

          {/* Authentication - Desktop */}
          <HStack spacing={3} display={{ base: 'none', md: 'flex' }} justify="flex-end" flex={{ base: "1", lg: "0 0 auto" }}>
            {isAuthLoaded && user ? (
              <>
                {isAdmin && (
                  <Link href="/admin" passHref>
                    <Tooltip label="Admin Panel" placement="bottom">
                      <Button
                        colorScheme="green"
                        variant="outline"
                        size="sm"
                        leftIcon={<Box as="span" fontSize="sm">👑</Box>}
                      >
                        Admin
                      </Button>
                    </Tooltip>
                  </Link>
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
                  <Button variant="outline" colorScheme="brand" size="sm">Login</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button colorScheme="brand" size="sm">Register</Button>
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
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px" px={4}>
            <Flex justify="space-between" align="center">
              <Flex align="center">
                <Box
                  bg="brand.500"
                  w="36px"
                  h="36px"
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="white"
                  fontWeight="bold"
                >
                  Logo
                </Box>
                <Text
                  className="khmer-heading"
                  ml={3}
                  fontSize="lg"
                  fontWeight="medium"
                  color="gray.800"
                  sx={{
                    fontFamily: "'Moul', 'Dangrek', 'Battambang', sans-serif"
                  }}
                >
                  ក្រសួងការពារជាតិ
                </Text>
              </Flex>
              <DrawerCloseButton position="static" />
            </Flex>
          </DrawerHeader>
          <DrawerBody p={0}>
            <VStack spacing={0} align="stretch">
              {navItems.map((item) => (
                <Box key={item.href}>
                  <Link href={item.href} passHref>
                    <Box
                      as="a"
                      px={6}
                      py={4}
                      fontWeight="medium"
                      borderBottomWidth="1px"
                      color={router.pathname.startsWith(item.href) ? 'brand.500' : 'gray.700'}
                      bg={router.pathname.startsWith(item.href) ? 'gray.50' : 'white'}
                      _hover={{ bg: 'gray.50' }}
                      onClick={onClose}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      {item.label}
                      {item.hasDropdown && (
                        <ChevronDownIcon />
                      )}
                    </Box>
                  </Link>

                  {/* Dropdown items for mobile */}
                  {item.hasDropdown && (
                    <VStack
                      spacing={0}
                      align="stretch"
                      bg="gray.50"
                      borderBottomWidth="1px"
                    >
                      {getDropdownContent(item.href.substring(1)).map((content) => (
                        <Link key={content.id} href={`${item.href}/${content.slug}`} passHref>
                          <Box
                            as="a"
                            px={8}
                            py={3}
                            fontSize="sm"
                            color="gray.600"
                            _hover={{ bg: 'gray.100' }}
                            onClick={onClose}
                            borderBottomWidth="1px"
                            borderBottomColor="gray.100"
                          >
                            {content.title}
                          </Box>
                        </Link>
                      ))}
                      <Link href={item.href} passHref>
                        <Box
                          as="a"
                          px={8}
                          py={3}
                          fontSize="sm"
                          fontWeight="medium"
                          color="brand.500"
                          _hover={{ bg: 'gray.100' }}
                          onClick={onClose}
                        >
                          View All {item.label}
                        </Box>
                      </Link>
                    </VStack>
                  )}
                </Box>
              ))}

              {/* Authentication - Mobile */}
              <Box px={6} py={6}>
                {isAuthLoaded && user ? (
                  <VStack align="stretch" spacing={4}>
                    <Flex alignItems="center" gap={3}>
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
                      <Text fontWeight="medium">
                        {user.fullName || user.username || 'Account'}
                      </Text>
                    </Flex>

                    {isAdmin && (
                      <Link href="/admin" passHref>
                        <Button
                          as="a"
                          w="full"
                          colorScheme="green"
                          leftIcon={<Box as="span" fontSize="sm">👑</Box>}
                          onClick={onClose}
                        >
                          Admin Panel
                        </Button>
                      </Link>
                    )}
                  </VStack>
                ) : (
                  <VStack spacing={4}>
                    <SignInButton mode="modal">
                      <Button as="a" w="full" variant="outline" colorScheme="brand" onClick={onClose}>
                        Login
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button as="a" w="full" colorScheme="brand" onClick={onClose}>
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