import {
  Box,
  Container,
  Flex,
  HStack,
  Text,
  Link,
  IconButton,
  VStack,
  Divider,
  SimpleGrid,
  useBreakpointValue,
} from '@chakra-ui/react'
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa'
import NextLink from 'next/link'
import { KhmerTitle, COLORS } from '../shared/KhmerTitle';
// import router from 'next/router';

// Footer navigation items
const footerNavItems = [
  {
    heading: "Resources",
    links: [
      { name: "News", href: "/news" },
      { name: "Books", href: "/books" },
      { name: "Maps", href: "/maps" },
      { name: "Videos", href: "/videos" }
    ]
  },
  {
    heading: "About",
    links: [
      { name: "Mission", href: "/about/mission" },
      { name: "Leadership", href: "/about/leadership" },
      { name: "History", href: "/about/history" },
      { name: "Contact", href: "/contact" }
    ]
  },
  {
    heading: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Use", href: "/terms" },
      { name: "Accessibility", href: "/accessibility" }
    ]
  }
];

// Social media links
const socialLinks = [
  { icon: FaFacebook, href: "https://facebook.com", label: "Facebook" },
  { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn" }
];

// Contact information
const contactInfo = [
  { icon: FaMapMarkerAlt, info: "Phnom Penh, Cambodia" },
  { icon: FaPhone, info: "+855 23 123 456" },
  { icon: FaEnvelope, info: "contact@modoc.gov.kh" }
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // if (router.pathname.startsWith('/admin')) {
  //   return null;
  // }

  // Apply our new color scheme
  const footerBg = COLORS.black[900];
  const borderColor = COLORS.black[700];
  const textColor = "gray.400";
  const headingColor = COLORS.accent.gold;

  // Responsive column count
  // const columnCount = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 4 }) || 1;

  // Responsive layout for footer sections
  const showFullFooter = useBreakpointValue({ base: false, md: true });

  return (
    <Box
      as="footer"
      bg={footerBg}
      py={{ base: 8, md: 12 }}
      borderTop="1px solid"
      borderTopColor={borderColor}
      color="white"
    >
      <Container maxW="container.xl">
        {/* Full footer for larger screens */}
        {showFullFooter ? (
          <>
            <SimpleGrid
              columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
              spacing={{ base: 8, lg: 12 }}
              mb={10}
            >
              {/* Logo and info */}
              <Box>
                <Flex align="center" mb={4}>
                  <img src="/images/logo.svg" alt="ក្រសួងការពារជាតិ Logo" width="40" height="40" />
                  <KhmerTitle ml={3} size="sm">ក្រសួងការពារជាតិ</KhmerTitle>
                </Flex>
                <Text fontSize="sm" color={textColor} mb={4}>
                  The official digital media platform of the Ministry of National Defense of Cambodia.
                </Text>

                {/* Contact info */}
                <VStack align="flex-start" spacing={2}>
                  {contactInfo.map((item, index) => (
                    <Flex key={index} align="center">
                      <Box as={item.icon} mr={2} color={COLORS.accent.gold} />
                      <Text fontSize="sm" color={textColor}>
                        {item.info}
                      </Text>
                    </Flex>
                  ))}
                </VStack>
              </Box>

              {/* Navigation sections */}
              {footerNavItems.map((section, idx) => (
                <Box key={idx}>
                  <Text
                    fontWeight="bold"
                    color={headingColor}
                    mb={4}
                    fontSize="sm"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    {section.heading}
                  </Text>
                  <VStack align="flex-start" spacing={2}>
                    {section.links.map((link) => (
                      <Link
                        as={NextLink}
                        key={link.name}
                        href={link.href}
                        color={textColor}
                        fontSize="sm"
                        _hover={{ color: COLORS.darkGreen[500], textDecoration: "none" }}
                        transition="color 0.2s"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>

            <Divider borderColor={borderColor} />

            {/* Bottom bar */}
            <Flex
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              align={{ base: "center", md: "center" }}
              pt={6}
              gap={{ base: 4, md: 0 }}
            >
              <Text fontSize="sm" color={textColor}>
                © {currentYear} ក្រសួងការពារជាតិ | Ministry of National Defense
              </Text>

              <HStack spacing={3}>
                {socialLinks.map((social) => (
                  <Link href={social.href} key={social.label} isExternal>
                    <IconButton
                      aria-label={social.label}
                      icon={<Box as={social.icon} />}
                      size="sm"
                      variant="ghost"
                      color="white"
                      _hover={{
                        bg: COLORS.black[800],
                        color: COLORS.accent.gold
                      }}
                      borderRadius="full"
                    />
                  </Link>
                ))}
              </HStack>
            </Flex>
          </>
        ) : (
          // Simplified footer for mobile
          <VStack spacing={6}>
            <Flex direction="column" align="center">
              <Flex align="center" mb={3}>
                <Link as={NextLink} href="/" _hover={{ textDecoration: "none" }}>
                  <img src="/images/logo.svg" alt="ក្រសួងការពារជាតិ Logo" width="40" height="40" />
                </Link>
                <KhmerTitle ml={3} size="sm">ក្រសួងការពារជាតិ</KhmerTitle>
              </Flex>

              <Text fontSize="xs" color={textColor} textAlign="center" mb={4}>
                The official digital media platform of the Ministry of National Defense of Cambodia.
              </Text>
            </Flex>

            <HStack spacing={3} justify="center">
              {socialLinks.map((social) => (
                <Link href={social.href} key={social.label} isExternal>
                  <IconButton
                    aria-label={social.label}
                    icon={<Box as={social.icon} />}
                    size="sm"
                    variant="ghost"
                    color="white"
                    _hover={{
                      bg: COLORS.black[800],
                      color: COLORS.accent.gold
                    }}
                    borderRadius="full"
                  />
                </Link>
              ))}
            </HStack>

            <Text fontSize="xs" color={textColor} textAlign="center">
              © {currentYear} ក្រសួងការពារជាតិ | Ministry of National Defense
            </Text>
          </VStack>
        )}
      </Container>
    </Box>
  )
}

export default Footer