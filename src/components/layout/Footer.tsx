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
  useColorModeValue
} from '@chakra-ui/react'
import {
  FaGithub,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa'
import NextLink from 'next/link'

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
  const footerBg = useColorModeValue("gray.50", "dark.800");
  const borderColor = useColorModeValue("gray.200", "dark.700");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("gray.700", "gray.300");
  const logoTextColor = useColorModeValue("gray.800", "white");

  // Responsive column count
  const columnCount = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 4 }) || 1;

  // Responsive layout for footer sections
  const showFullFooter = useBreakpointValue({ base: false, md: true });

  return (
    <Box
      as="footer"
      bg={footerBg}
      py={{ base: 8, md: 12 }}
      borderTop="1px solid"
      borderTopColor={borderColor}
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
                  <Box
                    bg="brand.500"
                    w="40px"
                    h="40px"
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
                    ml={3}
                    fontSize="lg"
                    fontWeight="medium"
                    color={logoTextColor}
                    sx={{
                      fontFamily: "'Moul', 'Dangrek', 'Battambang', sans-serif",
                    }}
                  >
                    ក្រសួងការពារជាតិ
                  </Text>
                </Flex>
                <Text fontSize="sm" color={textColor} mb={4}>
                  The official digital media platform of the Ministry of National Defense of Cambodia.
                </Text>

                {/* Contact info */}
                <VStack align="flex-start" spacing={2}>
                  {contactInfo.map((item, index) => (
                    <Flex key={index} align="center">
                      <Box as={item.icon} mr={2} color="brand.500" />
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
                        _hover={{ color: "brand.500", textDecoration: "none" }}
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
                      colorScheme="brand"
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
                <Text
                  ml={2}
                  fontSize="md"
                  fontWeight="medium"
                  color={logoTextColor}
                  sx={{
                    fontFamily: "'Moul', 'Dangrek', 'Battambang', sans-serif",
                  }}
                >
                  ក្រសួងការពារជាតិ
                </Text>
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
                    colorScheme="brand"
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