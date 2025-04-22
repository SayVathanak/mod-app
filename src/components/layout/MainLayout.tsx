import { ReactNode, useEffect, useState } from "react";
import {
  Box,
  Container,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Icon,
  useColorModeValue
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { FaChevronRight, FaHome } from "react-icons/fa";
import Head from "next/head";
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

// Define color constants from the homepage for consistent theming
const COLORS = {
  darkBg: "#0A0D0B", // Very dark green/black
  darkBgAlt: "#121A14", // Slightly lighter dark green
  darkGreen: {
    500: "#1A2C1F", // Dark green
    600: "#264D33", // Medium green
    700: "#3E7E50", // Light green accent
  },
  black: {
    900: "#0A0D0B", // Very dark green/black (same as darkBg)
    800: "#121A14", // Slightly lighter dark green (same as darkBgAlt)
    700: "#1A2C1F", // Dark green (same as darkGreen.500)
  },
  accent: {
    gold: "#BFA46F", // Military gold
    brightGold: "#D4B86A", // Brighter gold for highlights
    mutedGold: "#8F7B4E", // Muted gold for secondary elements
  },
  text: {
    light: "#E0E0E0", // Light text
    muted: "#A0A0A0", // Muted text
  }
};

type MainLayoutProps = {
  children: ReactNode;
  showBreadcrumb?: boolean;
};

export default function MainLayout({ children, showBreadcrumb = false }: MainLayoutProps) {
  const router = useRouter();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [books, setBooks] = useState<BookItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check if admin page
  const isAdminPage = router.pathname.startsWith('/admin');

  // Main background color
  const mainBg = COLORS.darkBg;

  // Fetch news and books data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // In a real application, you'd fetch from your API
        // For now, we'll use mock data

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

  // Generate current path for breadcrumb
  const generateBreadcrumb = () => {
    const pathSegments = router.pathname.split('/').filter(segment => segment !== '');

    if (pathSegments.length === 0) return null;

    return (
      <Breadcrumb
        separator={<Icon as={FaChevronRight} color="gray.500" fontSize="xs" />}
        mb={6}
        fontSize="sm"
        color={COLORS.text.muted}
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
                _activeLink={{ color: COLORS.accent.brightGold, fontWeight: "medium" }}
              >
                {segment.charAt(0).toUpperCase() + segment.slice(1)}
              </BreadcrumbLink>
            </BreadcrumbItem>
          );
        })}
      </Breadcrumb>
    );
  };

  return (
    <>
      <Head>
        <title>ក្រសួងការពារជាតិ | Digital Media Platform</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Box as="div" minH="100vh" bg={COLORS.darkBg} color={COLORS.text.light} display="flex" flexDirection="column">
        {/* Header component with appropriate props */}
        {!isAdminPage && (
          <Header news={news} books={books} isLoading={isLoading} />
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
      </Box>
    </>
  );
}