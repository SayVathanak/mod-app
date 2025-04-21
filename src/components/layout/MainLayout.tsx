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
  HeadingProps,
  Skeleton,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useColorModeValue,
  Grid,
  GridItem,
  Badge,
  useBreakpointValue,
  IconButton
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import {
  FaNewspaper,
  FaBook,
  FaMap,
  FaVideo,
  FaUser,
  FaBars,
  FaChevronRight,
  FaHome,
  FaBell,
  FaSearch
} from "react-icons/fa";
import Head from "next/head";
import { useUser, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import Footer from "./Footer";
import Header from "./Header";

// Types for our data
interface NewsItem {
  id: string;
  title: string;
  slug: string;
  publishedAt: string;
}

interface BookItem {
  id: string;
  title: string;
  slug: string;
  author: string;
}

// Define a proper type for the KhmerTitle component
interface KhmerTitleProps extends HeadingProps {
  children: ReactNode;
}

// Define a style component for the Khmer title to ensure consistent application
const KhmerTitle = ({ children, ...props }: KhmerTitleProps) => {
  const titleColor = useColorModeValue("brand.500", "brand.400");

  return (
    <Heading
      size="md"
      sx={{
        fontFamily: "'Moul', 'Dangrek', 'Battambang', sans-serif !important",
        fontWeight: "400",
        letterSpacing: "0.5px"
      }}
      color={titleColor}
      ml={3}
      {...props}
    >
      {children}
    </Heading>
  );
};

// Type for sidebar navigation items
interface NavItemProps {
  icon: React.ElementType;
  href: string;
  label: string;
  isActive: boolean;
  recentItems?: NewsItem[] | BookItem[];
  onClose?: () => void;
  isMobile?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  href,
  label,
  isActive,
  recentItems = [],
  onClose,
  isMobile = false
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const hasDropdown = recentItems.length > 0;

  const bgColor = useColorModeValue("gray.50", "dark.700");
  const hoverBgColor = useColorModeValue("gray.100", "dark.600");
  const activeColor = useColorModeValue("white", "white");
  const activeBgColor = useColorModeValue("brand.500", "brand.500");
  const dropdownBgColor = useColorModeValue("white", "dark.700");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const activeTextColor = useColorModeValue("white", "white");

  // Determine dropdown position based on viewport size
  const dropdownPosition = useBreakpointValue({ base: "bottom", md: "right" });

  return (
    <Box
      position="relative"
      onMouseEnter={() => hasDropdown && setShowDropdown(true)}
      onMouseLeave={() => setShowDropdown(false)}
      width="100%"
    >
      <Link
        as={NextLink}
        href={href}
        display="flex"
        alignItems="center"
        py={2}
        px={4}
        borderRadius="md"
        fontWeight="medium"
        bg={isActive ? activeBgColor : "transparent"}
        color={isActive ? activeTextColor : textColor}
        _hover={isMobile ?
          { bg: isActive ? activeBgColor : hoverBgColor, color: isActive ? activeTextColor : "brand.500" } :
          { color: isActive ? activeTextColor : "brand.500" }
        }
        transition="all 0.2s"
        onClick={onClose}
        position="relative"
        _after={isActive && !isMobile ? {
          content: '""',
          position: 'absolute',
          height: '2px',
          width: '60%',
          bottom: '0',
          left: '20%',
          bg: 'brand.500',
          borderRadius: 'full'
        } : undefined}
      >
        <Icon as={icon} mr={3} boxSize={5} />
        {label}
      </Link>

      {/* Dropdown for recent items */}
      {hasDropdown && showDropdown && (
        <Box
          position="absolute"
          top={dropdownPosition === "right" ? "0" : "100%"}
          left={dropdownPosition === "right" ? "100%" : "0"}
          bg={dropdownBgColor}
          w="240px"
          borderRadius="md"
          boxShadow="lg"
          zIndex={10}
          py={2}
          ml={dropdownPosition === "right" ? 1 : 0}
          mt={dropdownPosition === "right" ? 0 : 1}
        >
          <VStack align="stretch" spacing={0}>
            {recentItems.map((item) => (
              <Link
                as={NextLink}
                key={item.id}
                href={`${href}/${item.slug}`}
                px={4}
                py={2}
                color={textColor}
                fontSize="sm"
                _hover={{ bg: hoverBgColor, color: "brand.500" }}
                display="block"
                noOfLines={1}
                onClick={onClose}
              >
                {item.title}
              </Link>
            ))}
            <Link
              as={NextLink}
              href={href}
              px={4}
              py={2}
              color="brand.400"
              fontSize="xs"
              fontWeight="medium"
              textAlign="center"
              _hover={{ color: "brand.300" }}
              borderTopWidth="1px"
              borderTopColor={useColorModeValue("gray.100", "dark.600")}
              mt={1}
              onClick={onClose}
            >
              View All {label}
            </Link>
          </VStack>
        </Box>
      )}
    </Box>
  );
};

type MainLayoutProps = {
  children: ReactNode;
  showBreadcrumb?: boolean;
};

export default function MainLayout({ children, showBreadcrumb = false }: MainLayoutProps) {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, isLoaded } = useUser();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [books, setBooks] = useState<BookItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Responsive variables
  const isMobile = useBreakpointValue({ base: true, md: false });
  const headerBg = useColorModeValue("white", "dark.800");
  const borderColor = useColorModeValue("gray.200", "dark.700");
  const mainBg = useColorModeValue("gray.50", "dark.900");
  const drawerBg = useColorModeValue("white", "dark.800");
  const drawerColor = useColorModeValue("gray.800", "white");

  // Fetch news and books data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // In a real application, you'd fetch from your API
        // For now, we'll use mock data

        // Example API calls:
        // const newsResponse = await fetch('/api/news/recent');
        // const newsData = await newsResponse.json();
        // setNews(newsData);

        // const booksResponse = await fetch('/api/books/recent');
        // const booksData = await booksResponse.json();
        // setBooks(booksData);

        // Mock data for demonstration
        setNews([
          {
            id: '1',
            title: 'Recent Military Training Exercise',
            slug: 'military-training-exercise',
            publishedAt: '2025-04-15'
          },
          {
            id: '2',
            title: 'New Defense Strategy Announced',
            slug: 'defense-strategy-announced',
            publishedAt: '2025-04-10'
          },
          {
            id: '3',
            title: 'International Defense Cooperation',
            slug: 'international-defense-cooperation',
            publishedAt: '2025-04-05'
          }
        ]);

        setBooks([
          {
            id: '1',
            title: 'History of National Defense',
            slug: 'history-national-defense',
            author: 'Gen. Sok Samnang'
          },
          {
            id: '2',
            title: 'Military Strategy in the Digital Age',
            slug: 'military-strategy-digital-age',
            author: 'Col. Chhean Veasna'
          },
          {
            id: '3',
            title: 'Defense Policy and Implementation',
            slug: 'defense-policy-implementation',
            author: 'Dr. Hong Siphan'
          }
        ]);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Check if admin page
  const isAdminPage = router.pathname.startsWith('/admin');

  // Generate current path for breadcrumb
  const generateBreadcrumb = () => {
    const pathSegments = router.pathname.split('/').filter(segment => segment !== '');

    if (pathSegments.length === 0) return null;

    return (
      <Breadcrumb
        separator={<Icon as={FaChevronRight} color="gray.500" fontSize="xs" />}
        mb={6}
        fontSize="sm"
        color={useColorModeValue("gray.600", "gray.400")}
      >
        <BreadcrumbItem>
          <BreadcrumbLink as={NextLink} href="/">
            <Icon as={FaHome} mr={1} fontSize="sm" /> Home
          </BreadcrumbLink>
        </BreadcrumbItem>

        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
          const isLast = index === pathSegments.length - 1;

          return (
            <BreadcrumbItem key={segment} isCurrentPage={isLast}>
              <BreadcrumbLink
                as={NextLink}
                href={href}
                isCurrentPage={isLast}
                _activeLink={{ color: "brand.500", fontWeight: "medium" }}
              >
                {segment.charAt(0).toUpperCase() + segment.slice(1)}
              </BreadcrumbLink>
            </BreadcrumbItem>
          );
        })}
      </Breadcrumb>
    );
  };

  const navItems = [
    { icon: FaNewspaper, href: "/news", label: "News", items: news },
    { icon: FaBook, href: "/books", label: "Books", items: books },
    { icon: FaMap, href: "/maps", label: "Maps", items: [] },
    { icon: FaVideo, href: "/videos", label: "Videos", items: [] },
  ];

  return (
    <>
      <Head>
        <title>ក្រសួងការពារជាតិ | Digital Media Platform</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Flex direction="column" minH="100vh">
        {!isAdminPage && (
          <Box
            as="header"
            bg={headerBg}
            borderBottom="1px solid"
            borderColor={borderColor}
            position="sticky"
            top={0}
            zIndex={10}
            boxShadow="sm"
          >
            <Flex justify="space-between" align="center" p={4} maxW="container.xl" mx="auto">
              <Flex align="center">
                <Link as={NextLink} href="/" _hover={{ textDecoration: "none" }}>
                  <img src="/images/logo.svg" alt="ក្រសួងការពារជាតិ Logo" width="60" height="60" />
                </Link>
                <KhmerTitle>ក្រសួងការពារជាតិ</KhmerTitle>
              </Flex>

              {/* Action buttons - visible on all screens */}
              <HStack spacing={2}>
                {!isMobile && (
                  <IconButton
                    aria-label="Search"
                    icon={<FaSearch />}
                    variant="ghost"
                    colorScheme="gray"
                    size="md"
                  />
                )}

                {!isMobile && (
                  <IconButton
                    aria-label="Notifications"
                    icon={<FaBell />}
                    variant="ghost"
                    colorScheme="gray"
                    size="md"
                  />
                )}

                {/* Mobile menu button */}
                {isMobile ? (
                  <Button onClick={onOpen} variant="ghost" color="gray.500">
                    <Icon as={FaBars} fontSize="xl" />
                  </Button>
                ) : (
                  <HStack spacing={4} ml={4}>
                    {navItems.map((item) => (
                      <NavItem
                        key={item.href}
                        icon={item.icon}
                        href={item.href}
                        label={item.label}
                        isActive={router.pathname.startsWith(item.href)}
                        recentItems={item.items}
                        isMobile={false}
                      />
                    ))}

                    {isLoaded ? (
                      user ? (
                        <UserButton afterSignOutUrl="/" />
                      ) : (
                        <>
                          <SignInButton mode="modal">
                            <Button variant="outline" colorScheme="brand" size={useBreakpointValue({ base: "sm", md: "md" })}>
                              Login
                            </Button>
                          </SignInButton>
                          <SignUpButton mode="modal">
                            <Button colorScheme="brand" size={useBreakpointValue({ base: "sm", md: "md" })}>
                              Register
                            </Button>
                          </SignUpButton>
                        </>
                      )
                    ) : (
                      <Skeleton height="40px" width="100px" />
                    )}
                  </HStack>
                )}
              </HStack>
            </Flex>
          </Box>
        )}

        {/* Mobile Drawer - Only render if not on admin page */}
        {!isAdminPage && (
          <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={onClose}
            size={useBreakpointValue({ base: "full", sm: "xs" })}
          >
            <DrawerOverlay />
            <DrawerContent bg={drawerBg} color={drawerColor}>
              <DrawerCloseButton />
              <DrawerHeader borderBottomWidth="1px" borderColor={borderColor}>
                <Flex align="center">
                  <img src="/images/logo.svg" alt="ក្រសួងការពារជាតិ Logo" width="40" height="40" />
                  <KhmerTitle ml={3}>ក្រសួងការពារជាតិ</KhmerTitle>
                </Flex>
              </DrawerHeader>
              <DrawerBody p={0}>
                <VStack align="stretch" spacing={0}>
                  {/* Search box in drawer */}
                  <Box p={4}>
                    <Flex w="full" bg={useColorModeValue("gray.100", "dark.700")} p={2} borderRadius="md">
                      <Icon as={FaSearch} color="gray.400" alignSelf="center" mr={2} />
                      <Text color="gray.500" fontSize="sm">Search...</Text>
                    </Flex>
                  </Box>

                  {/* Navigation items */}
                  {navItems.map((item) => (
                    <Box key={item.href}>
                      <NavItem
                        icon={item.icon}
                        href={item.href}
                        label={item.label}
                        isActive={router.pathname.startsWith(item.href)}
                        onClose={onClose}
                        isMobile={true}
                      />

                      {/* Show recent items as nested menu in mobile */}
                      {item.items && item.items.length > 0 && (
                        <Box
                          pl={10}
                          borderLeftWidth="1px"
                          borderLeftColor={useColorModeValue("gray.200", "dark.700")}
                          ml={6}
                          mt={2}
                          mb={4}
                        >
                          <VStack align="stretch" spacing={2}>
                            {item.items.map((subItem) => (
                              <Link
                                key={subItem.id}
                                as={NextLink}
                                href={`${item.href}/${subItem.slug}`}
                                color={useColorModeValue("gray.600", "gray.400")}
                                fontSize="sm"
                                py={1}
                                _hover={{ color: "brand.400" }}
                                onClick={onClose}
                              >
                                {subItem.title}
                              </Link>
                            ))}
                            <Link
                              as={NextLink}
                              href={item.href}
                              color="brand.400"
                              fontSize="xs"
                              fontWeight="medium"
                              py={1}
                              _hover={{ color: "brand.500" }}
                              onClick={onClose}
                            >
                              View All {item.label} →
                            </Link>
                          </VStack>
                        </Box>
                      )}
                    </Box>
                  ))}

                  {/* Auth buttons */}
                  <Box p={4} borderTopWidth="1px" borderColor={borderColor} mt={4}>
                    {isLoaded ? (
                      user ? (
                        <Flex align="center" justify="space-between">
                          <Box>
                            <Text fontWeight="medium">{user.fullName || user.username}</Text>
                            <Text fontSize="sm" color="gray.500">{user.primaryEmailAddress?.emailAddress}</Text>
                          </Box>
                          <UserButton afterSignOutUrl="/" />
                        </Flex>
                      ) : (
                        <VStack spacing={3} align="stretch">
                          <SignInButton mode="modal">
                            <Button as="a" w="full" variant="outline" colorScheme="brand">Login</Button>
                          </SignInButton>
                          <SignUpButton mode="modal">
                            <Button as="a" w="full" colorScheme="brand">Register</Button>
                          </SignUpButton>
                        </VStack>
                      )
                    ) : (
                      <Skeleton height="40px" />
                    )}
                  </Box>
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        )}

        {/* Main content */}
        <Box as="main" flex="1" bg={mainBg}>
          <Container maxW="container.xl" py={6}>
            {showBreadcrumb && !isAdminPage && generateBreadcrumb()}
            {children}
          </Container>
        </Box>

        {/* Footer component */}
        <Footer />
      </Flex>
    </>
  );
}