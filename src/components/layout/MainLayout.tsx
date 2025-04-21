import { ReactNode, useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Link,
  Icon,
  HStack,
  Button,
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
  HeadingProps
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { FaNewspaper, FaBook, FaMap, FaVideo, FaUser, FaBars } from "react-icons/fa";
import Head from "next/head";
import { useUser, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";

// Define a proper type for the KhmerTitle component
interface KhmerTitleProps extends HeadingProps {
  children: ReactNode;
}

// Define a style component for the Khmer title to ensure consistent application
const KhmerTitle = ({ children, ...props }: KhmerTitleProps) => (
  <Heading
    size="md"
    sx={{
      fontFamily: "'Moul', 'Dangrek', 'Battambang', sans-serif !important",
      color: "brand.500",
      fontWeight: "400",
      letterSpacing: "0.5px"
    }}
    ml={3}
    {...props}
  >
    {children}
  </Heading>
);

type NavItemProps = {
  icon: React.ElementType;
  href: string;
  label: string;
  isActive: boolean;
};

const NavItem = ({ icon, href, label, isActive }: NavItemProps) => (
  <Link
    as={NextLink}
    href={href}
    display="flex"
    alignItems="center"
    py={2}
    px={4}
    borderRadius="md"
    fontWeight="medium"
    bg={isActive ? "brand.500" : "transparent"}
    color={isActive ? "white" : "gray.300"}
    _hover={{ bg: isActive ? "brand.600" : "dark.700", color: "white" }}
    transition="all 0.2s"
  >
    <Icon as={icon} mr={3} />
    {label}
  </Link>
);

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, isLoaded } = useUser();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check if admin page
  const isAdminPage = router.pathname.startsWith('/admin');

  // Force font preloading
  useEffect(() => {
    // Create a preloaded font style element
    const preloadFonts = () => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = 'https://fonts.googleapis.com/css2?family=Moul&display=swap';
      link.as = 'style';
      document.head.appendChild(link);
      
      // Force load the font
      const style = document.createElement('style');
      style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Moul&display=swap');
        
        /* Define and force the font-face */
        @font-face {
          font-family: 'Moul';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: url(https://fonts.gstatic.com/s/moul/v25/nuF2D__FSo_3E-RYiJCy.woff2) format('woff2');
          unicode-range: U+1780-17FF, U+200C, U+25CC;
        }
      `;
      document.head.appendChild(style);
    };

    preloadFonts();
  }, []);

  const navItems = [
    { icon: FaNewspaper, href: "/news", label: "News" },
    { icon: FaBook, href: "/books", label: "Books" },
    { icon: FaMap, href: "/maps", label: "Maps" },
    { icon: FaVideo, href: "/videos", label: "Videos" },
  ];

  return (
    <>
      <Head>
        <title>ក្រសួងការពារជាតិ | Digital Media Platform</title>
        {/* Load multiple Khmer fonts to ensure at least one works */}
        <link href="https://fonts.googleapis.com/css2?family=Moul&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Dangrek&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Battambang&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@300;400;600&display=swap" rel="stylesheet" />
        
        {/* Add explicit font-face definitions */}
        <style jsx global>{`
          @font-face {
            font-family: 'Moul';
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: url(https://fonts.gstatic.com/s/moul/v25/nuF2D__FSo_3E-RYiJCy.woff2) format('woff2');
            unicode-range: U+1780-17FF, U+200C, U+25CC;
          }
          
          /* Ensure consistent application of fonts */
          .khmer-heading {
            font-family: 'Moul', 'Dangrek', 'Battambang', sans-serif !important;
          }
        `}</style>
      </Head>

      <Flex direction="column" minH="100vh">
        {!isAdminPage && (
          <Box as="header" bg="dark.800" borderBottom="1px solid" borderColor="dark.700" position="sticky" top={0} zIndex={10}>
            <Flex justify="space-between" align="center" p={4} maxW="container.xl" mx="auto">
              <Flex align="center">
                <Link as={NextLink} href="/" _hover={{ textDecoration: "none" }}>
                  <img src="/images/logo.svg" alt="Your Logo" width="60" />
                </Link>
                <KhmerTitle>ក្រសួងការពារជាតិ</KhmerTitle>
              </Flex>

              {/* Mobile menu button */}
              {isMobile ? (
                <Button onClick={onOpen} variant="ghost" color="gray.300">
                  <Icon as={FaBars} fontSize="xl" />
                </Button>
              ) : (
                <HStack spacing={4}>
                  {navItems.map((item) => (
                    <NavItem key={item.href} icon={item.icon} href={item.href} label={item.label} isActive={router.pathname.startsWith(item.href)} />
                  ))}
                  {isLoaded ? (
                    user ? (
                      <UserButton afterSignOutUrl="/" />
                    ) : (
                      <>
                        <SignInButton mode="modal">
                          <Button variant="outline" colorScheme="brand">Login</Button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                          <Button colorScheme="brand">Register</Button>
                        </SignUpButton>
                      </>
                    )
                  ) : null}
                </HStack>
              )}
            </Flex>
          </Box>
        )}

        {/* Mobile Drawer - Only render if not on admin page */}
        {!isAdminPage && (
          <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent bg="dark.800" color="white">
              <DrawerCloseButton />
              <DrawerHeader borderBottomWidth="1px" color="brand.500" className="khmer-heading">
                ក្រសួងការពារជាតិ
              </DrawerHeader>
              <DrawerBody>
                <VStack align="stretch" spacing={4} mt={4}>
                  {navItems.map((item) => (
                    <NavItem key={item.href} icon={item.icon} href={item.href} label={item.label} isActive={router.pathname.startsWith(item.href)} />
                  ))}
                  <Box pt={4} borderTopWidth="1px">
                    {isLoaded ? (
                      user ? (
                        <UserButton afterSignOutUrl="/" />
                      ) : (
                        <>
                          <SignInButton mode="modal">
                            <Button as="a" w="full">Login</Button>
                          </SignInButton>
                          <SignUpButton mode="modal">
                            <Button as="a" w="full" colorScheme="brand">Register</Button>
                          </SignUpButton>
                        </>
                      )
                    ) : null}
                  </Box>
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        )}

        {/* Main content */}
        <Box as="main" flex="1" bg="dark.900">
          <Container maxW="container.xl" py={6}>
            {children}
          </Container>
        </Box>

        {/* Footer - Only render if not on admin page */}
        {!isAdminPage && (
          <Box as="footer" bg="dark.800" p={6} borderTop="1px solid" borderColor="dark.700">
            <Flex direction={["column", "row"]} maxW="container.xl" mx="auto" justify="space-between" align="center" fontSize="sm" color="gray.400">
              <Text className="khmer-heading">© {new Date().getFullYear()} ក្រសួងការពារជាតិ. All rights reserved.</Text>
              <HStack mt={[4, 0]} spacing={6}>
                <Link href="#">Privacy</Link>
                <Link href="#">Terms</Link>
                <Link href="#">Contact</Link>
              </HStack>
            </Flex>
          </Box>
        )}
      </Flex>
    </>
  );
}