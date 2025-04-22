import { Box, Container, Heading, Text, Button, Stack, Flex, SimpleGrid, Image, Icon, VStack, HStack, Badge, useColorModeValue } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import NextLink from "next/link";
import { FaBook, FaVideo, FaMap, FaNewspaper, FaArrowRight, FaCalendarAlt, FaPlay } from "react-icons/fa";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

// Custom color palette - Military dark theme
const colors = {
  darkBg: "#0A0D0B", // Very dark green/black
  darkBgAlt: "#121A14", // Slightly lighter dark green
  darkGreen: "#1A2C1F", // Dark green
  midGreen: "#264D33", // Medium green
  lightGreen: "#3E7E50", // Light green accent
  gold: "#BFA46F", // Military gold
  brightGold: "#D4B86A", // Brighter gold for highlights
  mutedGold: "#8F7B4E", // Muted gold for secondary elements
  textLight: "#E0E0E0", // Light text
  textMuted: "#A0A0A0", // Muted text
};

type NewsItem = {
  _id: string;
  title: string;
  body: string;
  imageUrl?: string;
  createdAt: string;
};

type Book = {
  _id: string;
  title: string;
  author: string;
  coverUrl?: string;
};

type Video = {
  _id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
};

type SlideContent = {
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
};

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fixed color values for dark military theme
  const cardBg = colors.darkBgAlt;
  const cardBorder = colors.midGreen;
  const textColor = colors.textLight;
  const headingColor = colors.gold;
  const accentColor = "green"; // For Chakra UI components

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Slides for the hero slider
  const slides: SlideContent[] = [
    {
      title: "Digital Library Resources",
      description: "Access thousands of books, videos, maps, and academic resources. Expand your knowledge with our comprehensive digital collection.",
      imageUrl: "/images/slider/library.jpg",
      buttonText: "Explore Books",
      buttonLink: "/books",
    },
    {
      title: "Video Learning Center",
      description: "Watch educational videos, tutorials, and lectures from experts in various fields. Visual learning made accessible.",
      imageUrl: "/images/slider/video.jpg",
      buttonText: "Watch Videos",
      buttonLink: "/videos",
    },
    {
      title: "Historical Maps Collection",
      description: "Discover rare historical maps and geographical resources. Navigate through time with our map collection.",
      imageUrl: "/images/slider/maps.jpg",
      buttonText: "View Maps",
      buttonLink: "/maps",
    }
  ];

  const fetchRecentContent = async () => {
    setIsLoading(true);
    try {
      // Fetch recent content in parallel
      const [newsRes, booksRes, videosRes] = await Promise.all([
        fetch("/api/news?limit=3"),
        fetch("/api/books?limit=4"),
        fetch("/api/videos?limit=3")
      ]);

      if (!newsRes.ok || !booksRes.ok || !videosRes.ok) {
        throw new Error("One or more API calls failed");
      }

      const newsData = await newsRes.json();
      const booksData = await booksRes.json();
      const videosData = await videosRes.json();

      setNews(newsData);
      setBooks(booksData);
      setVideos(videosData);
    } catch (error) {
      console.error("Error fetching content:", error);
      // Set empty arrays as fallback
      setNews([]);
      setBooks([]);
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentContent();

    // Auto-advance slides
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const resourceItems = [
    { title: "Books", icon: FaBook, color: colors.brightGold, link: "/books", count: books.length },
    { title: "Videos", icon: FaVideo, color: colors.gold, link: "/videos", count: videos.length },
    { title: "Maps", icon: FaMap, color: colors.gold, link: "/maps", count: 0 },
    { title: "News", icon: FaNewspaper, color: colors.mutedGold, link: "/news", count: news.length },
  ];

  return (
    <Box bg={colors.darkBg} color={textColor} minH="100vh">
      {/* Hero Slider - Adjusted for better mobile view */}
      <Box position="relative" height={{ base: "40vh", sm: "50vh", md: "60vh" }} overflow="hidden">
        {slides.map((slide, index) => (
          <MotionBox
            key={index}
            position="absolute"
            top="0"
            left="0"
            width="100%"
            height="100%"
            initial={{ opacity: 0 }}
            animate={{
              opacity: activeSlide === index ? 1 : 0,
              zIndex: activeSlide === index ? 1 : 0
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            bgImage={`linear-gradient(to bottom, rgba(10,13,11,0.5), rgba(26,44,31,0.85)), url('${slide.imageUrl}')`}
            bgSize="cover"
            bgPosition="center"
          >
            <Container maxW="container.xl" height="100%" px={{ base: 4, md: 6 }}>
              <Flex
                height="100%"
                direction="column"
                justify="center"
                maxW={{ base: "100%", md: "60%" }}
                color={textColor}
              >
                <MotionBox
                  initial={{ y: 30, opacity: 0 }}
                  animate={{
                    y: activeSlide === index ? 0 : 30,
                    opacity: activeSlide === index ? 1 : 0
                  }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Heading
                    size={{ base: "xl", md: "2xl" }}
                    mb={4}
                    color={colors.gold}
                    fontWeight="bold"
                    textShadow="0 2px 4px rgba(0,0,0,0.5)"
                  >
                    {slide.title}
                  </Heading>
                </MotionBox>

                <MotionBox
                  initial={{ y: 30, opacity: 0 }}
                  animate={{
                    y: activeSlide === index ? 0 : 30,
                    opacity: activeSlide === index ? 1 : 0
                  }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Text
                    fontSize={{ base: "md", md: "xl" }}
                    mb={6}
                    textShadow="0 1px 3px rgba(0,0,0,0.7)"
                  >
                    {slide.description}
                  </Text>
                </MotionBox>

                <MotionBox
                  initial={{ y: 30, opacity: 0 }}
                  animate={{
                    y: activeSlide === index ? 0 : 30,
                    opacity: activeSlide === index ? 1 : 0
                  }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Button
                    as={NextLink}
                    href={slide.buttonLink}
                    bg={colors.midGreen}
                    color={colors.brightGold}
                    _hover={{ bg: colors.lightGreen, color: colors.textLight }}
                    size={{ base: "md", md: "lg" }}
                    rightIcon={<Icon as={FaArrowRight} />}
                    fontWeight="medium"
                    borderWidth="1px"
                    borderColor={colors.gold}
                    boxShadow="0 4px 8px rgba(0,0,0,0.3)"
                  >
                    {slide.buttonText}
                  </Button>
                </MotionBox>
              </Flex>
            </Container>
          </MotionBox>
        ))}

        {/* Dots navigation */}
        <HStack
          position="absolute"
          bottom={{ base: 3, md: 6 }}
          left="50%"
          transform="translateX(-50%)"
          spacing={3}
          zIndex={2}
        >
          {slides.map((_, index) => (
            <Box
              key={index}
              w={{ base: "8px", md: "12px" }}
              h={{ base: "8px", md: "12px" }}
              borderRadius="full"
              bg={activeSlide === index ? colors.brightGold : "whiteAlpha.700"}
              cursor="pointer"
              onClick={() => setActiveSlide(index)}
              transition="all 0.2s"
              _hover={{ transform: "scale(1.2)" }}
              borderWidth="1px"
              borderColor={activeSlide === index ? colors.brightGold : "transparent"}
            />
          ))}
        </HStack>
      </Box>

      <Container maxW="container.xl" py={{ base: 10, md: 16 }} px={{ base: 4, md: 6 }}>
        {/* Resources Section */}
        <MotionBox
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
          textAlign="center"
          mb={{ base: 10, md: 16 }}
        >
          <Heading as="h2" mb={4} color={colors.gold} size={{ base: "xl", md: "2xl" }}>
            Our Digital Resources
          </Heading>
          <Text fontSize={{ base: "md", md: "lg" }} maxW="800px" mx="auto" color={colors.textLight}>
            Explore our comprehensive collection of digital resources to enhance your learning experience
          </Text>
        </MotionBox>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={{ base: 5, md: 8 }} mb={{ base: 12, md: 20 }}>
          {resourceItems.map((resource, index) => (
            <MotionBox
              key={resource.title}
              as={NextLink}
              href={resource.link}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.4, delay: index * 0.1, }}
              p={{ base: 5, md: 6 }}
              borderWidth="1px"
              borderRadius="xl"
              borderColor={colors.midGreen}
              bg={colors.darkBgAlt}
              boxShadow="lg"
              _hover={{
                transform: "translateY(-5px)",
                boxShadow: "xl",
                borderColor: resource.color,
                bg: colors.darkGreen
              }}
              transitionProperty="all 0.3s ease"
              textAlign="center"
            >
              <Icon as={resource.icon} boxSize={{ base: 10, md: 14 }} color={resource.color} mb={5} />
              <Heading size="md" mb={3} color={colors.gold}>
                {resource.title}
              </Heading>
              <Text mb={4} color={colors.textLight} fontSize={{ base: "sm", md: "md" }}>
                Access our {resource.title.toLowerCase()} collection
              </Text>
              <Badge
                px={4}
                py={1}
                borderRadius="full"
                fontSize="sm"
                bg={colors.darkGreen}
                color={resource.color}
                borderWidth="1px"
                borderColor={resource.color}
              >
                {resource.count} Items
              </Badge>
            </MotionBox>
          ))}
        </SimpleGrid>

        {/* Latest News */}
        <Box mb={{ base: 12, md: 20 }}>
          <Flex justify="space-between" align="center" mb={{ base: 6, md: 8 }}>
            <MotionBox
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Heading size={{ base: "md", md: "lg" }} color={colors.gold}>Latest News</Heading>
            </MotionBox>
            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Button
                as={NextLink}
                href="/news"
                variant="outline"
                rightIcon={<FaArrowRight />}
                borderColor={colors.gold}
                color={colors.gold}
                _hover={{ bg: colors.darkGreen, borderColor: colors.brightGold, color: colors.brightGold }}
                size={{ base: "sm", md: "md" }}
              >
                View All
              </Button>
            </MotionBox>
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, md: 8 }}>
            {news.length > 0 ? (
              news.map((item, index) => (
                <MotionBox
                  key={item._id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeInUp}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  bg={colors.darkBgAlt}
                  borderColor={colors.midGreen}
                  boxShadow="md"
                  _hover={{
                    transform: "translateY(-5px)",
                    boxShadow: "lg",
                    borderColor: colors.gold
                  }}
                  transitionProperty="all 0.3s ease"
                >
                  {item.imageUrl && (
                    <Box position="relative" height={{ base: "160px", md: "200px" }}>
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        height="100%"
                        width="100%"
                        objectFit="cover"
                        fallback={
                          <Flex
                            height="100%"
                            bg={colors.darkGreen}
                            justify="center"
                            align="center"
                          >
                            <Icon as={FaNewspaper} boxSize={12} color={colors.mutedGold} />
                          </Flex>
                        }
                      />
                      <Box
                        position="absolute"
                        top="0"
                        left="0"
                        width="100%"
                        height="100%"
                        bgGradient={`linear(to-t, ${colors.darkBg}CC, transparent)`}
                      />
                    </Box>
                  )}
                  <Box p={{ base: 4, md: 5 }}>
                    <Heading size="md" mb={2} noOfLines={2} color={colors.gold}>
                      {item.title}
                    </Heading>
                    <HStack fontSize="sm" color={colors.mutedGold} mb={3}>
                      <Icon as={FaCalendarAlt} />
                      <Text>{new Date(item.createdAt).toLocaleDateString()}</Text>
                    </HStack>
                    <Text noOfLines={2} mb={4} color={colors.textLight} fontSize={{ base: "sm", md: "md" }}>
                      {item.body}
                    </Text>
                    <Button
                      as={NextLink}
                      href={`/news/${item._id}`}
                      size="sm"
                      color={colors.brightGold}
                      variant="link"
                      rightIcon={<FaArrowRight />}
                      _hover={{ color: colors.textLight }}
                    >
                      Read More
                    </Button>
                  </Box>
                </MotionBox>
              ))
            ) : (
              <MotionFlex
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                gridColumn="1 / -1"
                justify="center"
                align="center"
                p={10}
                borderRadius="lg"
                bg={colors.darkBgAlt}
                borderColor={colors.midGreen}
                borderWidth="1px"
              >
                <Text color={colors.textMuted}>No news articles available</Text>
              </MotionFlex>
            )}
          </SimpleGrid>
        </Box>

        {/* Featured Books */}
        <Box mb={{ base: 12, md: 20 }}>
          <Flex justify="space-between" align="center" mb={{ base: 6, md: 8 }}>
            <MotionBox
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Heading size={{ base: "md", md: "lg" }} color={colors.gold}>Featured Books</Heading>
            </MotionBox>
            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Button
                as={NextLink}
                href="/books"
                variant="outline"
                rightIcon={<FaArrowRight />}
                borderColor={colors.gold}
                color={colors.gold}
                _hover={{ bg: colors.darkGreen, borderColor: colors.brightGold, color: colors.brightGold }}
                size={{ base: "sm", md: "md" }}
              >
                View All
              </Button>
            </MotionBox>
          </Flex>

          <SimpleGrid columns={{ base: 2, sm: 2, md: 4 }} spacing={{ base: 3, md: 6 }}>
            {books.length > 0 ? (
              books.map((book, index) => (
                <MotionBox
                  key={book._id}
                  as={NextLink}
                  href={`/books/${book._id}`}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeInUp}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  bg={colors.darkBgAlt}
                  borderColor={colors.midGreen}
                  boxShadow="md"
                  _hover={{
                    transform: "translateY(-5px)",
                    boxShadow: "lg",
                    borderColor: colors.gold
                  }}
                  transitionProperty="all 0.3s ease"
                >
                  <Box height={{ base: "160px", sm: "180px", md: "220px" }} overflow="hidden">
                    {book.coverUrl ? (
                      <Image
                        src={book.coverUrl}
                        alt={book.title}
                        width="100%"
                        height="100%"
                        objectFit="cover"
                        transition="transform 0.5s"
                        _groupHover={{ transform: "scale(1.05)" }}
                      />
                    ) : (
                      <Flex
                        height="100%"
                        bg={colors.darkGreen}
                        justify="center"
                        align="center"
                      >
                        <Icon as={FaBook} boxSize={{ base: 8, md: 12 }} color={colors.brightGold} />
                      </Flex>
                    )}
                  </Box>
                  <Box p={{ base: 3, md: 4 }}>
                    <Heading size="sm" mb={1} noOfLines={1} color={colors.gold}>
                      {book.title}
                    </Heading>
                    <Text fontSize={{ base: "xs", md: "sm" }} color={colors.textMuted} noOfLines={1}>
                      by {book.author}
                    </Text>
                  </Box>
                </MotionBox>
              ))
            ) : (
              <MotionFlex
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                gridColumn="1 / -1"
                justify="center"
                align="center"
                p={10}
                borderRadius="lg"
                bg={colors.darkBgAlt}
                borderColor={colors.midGreen}
                borderWidth="1px"
              >
                <Text color={colors.textMuted}>No books available</Text>
              </MotionFlex>
            )}
          </SimpleGrid>
        </Box>

        {/* Featured Videos */}
        <Box>
          <Flex justify="space-between" align="center" mb={{ base: 6, md: 8 }}>
            <MotionBox
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Heading size={{ base: "md", md: "lg" }} color={colors.gold}>Latest Videos</Heading>
            </MotionBox>
            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Button
                as={NextLink}
                href="/videos"
                variant="outline"
                rightIcon={<FaArrowRight />}
                borderColor={colors.gold}
                color={colors.gold}
                _hover={{ bg: colors.darkGreen, borderColor: colors.brightGold, color: colors.brightGold }}
                size={{ base: "sm", md: "md" }}
              >
                View All
              </Button>
            </MotionBox>
          </Flex>

          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={{ base: 5, md: 8 }}>
            {videos.length > 0 ? (
              videos.map((video, index) => (
                <MotionBox
                  key={video._id}
                  as={NextLink}
                  href={`/videos/${video._id}`}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeInUp}
                  transition={{ duration: 0.5, delay: index * 0.1, }}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  bg={colors.darkBgAlt}
                  borderColor={colors.midGreen}
                  boxShadow="md"
                  _hover={{
                    transform: "translateY(-5px)",
                    boxShadow: "lg",
                    borderColor: colors.gold
                  }}
                  transitionProperty="all 0.3s ease"
                >
                  <Box height={{ base: "180px", md: "200px" }} position="relative">
                    {video.thumbnailUrl ? (
                      <Image
                        src={video.thumbnailUrl}
                        alt={video.title}
                        width="100%"
                        height="100%"
                        objectFit="cover"
                        transition="transform 0.5s"
                        _groupHover={{ transform: "scale(1.05)" }}
                      />
                    ) : (
                      <Flex
                        height="100%"
                        bg={colors.darkGreen}
                        justify="center"
                        align="center"
                      >
                        <Icon as={FaVideo} boxSize={{ base: 8, md: 12 }} color={colors.lightGreen} />
                      </Flex>
                    )}
                    <Flex
                      position="absolute"
                      top="0"
                      left="0"
                      right="0"
                      bottom="0"
                      bg="blackAlpha.600"
                      justify="center"
                      align="center"
                      transition="background 0.3s"
                      _hover={{ bg: "blackAlpha.400" }}
                    >
                      <Box
                        p={{ base: 2, md: 3 }}
                        borderRadius="full"
                        bg={colors.darkBg}
                        borderWidth="2px"
                        borderColor={colors.gold}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        transition="transform 0.3s"
                        _hover={{ transform: "scale(1.1)" }}
                      >
                        <Icon as={FaPlay} boxSize={{ base: 4, md: 5 }} color={colors.brightGold} />
                      </Box>
                    </Flex>
                  </Box>
                  <Box p={{ base: 3, md: 4 }}>
                    <Heading size={{ base: "sm", md: "md" }} mb={2} noOfLines={1} color={colors.gold}>
                      {video.title}
                    </Heading>
                    <Text noOfLines={2} color={colors.textLight} fontSize={{ base: "sm", md: "md" }}>
                      {video.description}
                    </Text>
                  </Box>
                </MotionBox>
              ))
            ) : (
              <MotionFlex
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                gridColumn="1 / -1"
                justify="center"
                align="center"
                p={10}
                borderRadius="lg"
                bg={colors.darkBgAlt}
                borderColor={colors.midGreen}
                borderWidth="1px"
              >
                <Text color={colors.textMuted}>No videos available</Text>
              </MotionFlex>
            )}
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  );
}