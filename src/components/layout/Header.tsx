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
  Badge,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useUser, useAuth, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Books', href: '/books' },
  { label: 'Maps', href: '/maps' },
  { label: 'News', href: '/news' },
  { label: 'Videos', href: '/videos' },
];

const Header = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);
  const { user, isLoaded: isUserLoaded } = useUser();
  const { isLoaded: isAuthLoaded } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check if we're in admin area
  const isAdminPage = router.pathname.startsWith('/admin');

  // Determine if user is an admin based on Clerk role
  useEffect(() => {
    if (isUserLoaded && user) {
      setIsAdmin(user.publicMetadata.role === 'admin');
    }
  }, [isUserLoaded, user]);

  return (
    <Box as="header" bg="white" boxShadow="sm" position="sticky" top={0} zIndex={10}>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding={4}
        maxW="container.xl"
        mx="auto"
      >
        <Box fontWeight="bold" fontSize="xl">YourLogo</Box>
        
        {/* Desktop Navigation - Only show if not on admin page */}
        {!isAdminPage && (
          <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} passHref>
                <Box
                  as="a"
                  px={2}
                  py={1}
                  rounded="md"
                  fontWeight="medium"
                  color={router.pathname === item.href ? 'brand.500' : 'gray.600'}
                  _hover={{ color: 'brand.500' }}
                  className="transition-colors duration-200"
                >
                  {item.label}
                </Box>
              </Link>
            ))}
          </HStack>
        )}
        
        {/* Authentication & Admin Access */}
        <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
          {isAuthLoaded && user ? (
            <>
              {isAdmin && !isAdminPage && (
                <Link href="/admin" passHref>
                  <Button 
                    colorScheme="green" 
                    variant="outline"
                    size="sm"
                    leftIcon={<Box as="span" fontSize="sm">👑</Box>}
                  >
                    Admin Panel
                  </Button>
                </Link>
              )}
              {isAdminPage && (
                <Link href="/" passHref>
                  <Button 
                    colorScheme="blue" 
                    variant="outline"
                    size="sm"
                  >
                    Back to Site
                  </Button>
                </Link>
              )}
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="outline" colorScheme="brand">Login</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button colorScheme="brand">Register</Button>
              </SignUpButton>
            </>
          )}
        </HStack>
        
        {/* Mobile Menu Button - Only show if not on admin page */}
        {!isAdminPage && (
          <IconButton
            ref={btnRef}
            display={{ base: 'flex', md: 'none' }}
            onClick={onOpen}
            icon={<HamburgerIcon />}
            variant="ghost"
            aria-label="Open menu"
          />
        )}
      </Flex>
      
      {/* Mobile Drawer - Only render if not on admin page */}
      {!isAdminPage && (
        <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
            <DrawerBody>
              <VStack spacing={4} align="stretch" mt={4}>
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} passHref>
                    <Box
                      as="a"
                      px={2}
                      py={2}
                      rounded="md"
                      fontWeight="medium"
                      color={router.pathname === item.href ? 'brand.500' : 'gray.600'}
                      _hover={{ bg: 'gray.50' }}
                      onClick={onClose}
                    >
                      {item.label}
                    </Box>
                  </Link>
                ))}
                <Box pt={4} borderTopWidth="1px">
                  {isAuthLoaded && user ? (
                    <VStack align="stretch" spacing={4}>
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
                      <Box>
                        <UserButton afterSignOutUrl="/" />
                      </Box>
                    </VStack>
                  ) : (
                    <>
                      <SignInButton mode="modal">
                        <Button as="a" w="full" mb={3} onClick={onClose}>Login</Button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <Button as="a" w="full" colorScheme="brand" onClick={onClose}>Register</Button>
                      </SignUpButton>
                    </>
                  )}
                </Box>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </Box>
  );
};

export default Header;