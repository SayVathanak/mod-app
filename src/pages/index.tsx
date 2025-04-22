import { Box, Container, Heading, Text, Button, Flex, SimpleGrid, Image, Icon, HStack, VStack, Badge, Grid, GridItem, LinkBox, LinkOverlay } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import NextLink from "next/link";
import { FaBook, FaVideo, FaMap, FaNewspaper, FaArrowRight, FaCalendarAlt, FaPlay, FaUser, FaClock, FaTag } from "react-icons/fa";
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
  author?: string;
  category?: string;
  readTime?: string;
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
  const [featuredNews, setFeaturedNews] = useState<NewsItem | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
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
        fetch("/api/news?limit=7"), // Increased limit for more news items
        fetch("/api/books?limit=6"), // Increased limit for more books
        fetch("/api/videos?limit=4")  // Increased limit for more videos
      ]);

      if (!newsRes.ok || !booksRes.ok || !videosRes.ok) {
        throw new Error("One or more API calls failed");
      }

      const newsData = await newsRes.json();
      const booksData = await booksRes.json();
      const videosData = await videosRes.json();

      // Set featured news as the first item, remaining news for the list
      if (newsData.length > 0) {
        setFeaturedNews(newsData[0]);
        setNews(newsData.slice(1));
      } else {
        setNews([]);
        setFeaturedNews(null);
      }

      setBooks(booksData);
      setVideos(videosData);
    } catch (error) {
      console.error("Error fetching content:", error);
      // Set empty arrays as fallback
      setNews([]);
      setFeaturedNews(null);
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
    { title: "News", icon: FaNewspaper, color: colors.mutedGold, link: "/news", count: news.length + (featuredNews ? 1 : 0) },
  ];

  // Function to estimate read time
  const getReadTime = (text: string) => {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  return (
    <Box bg={colors.darkBg} color={colors.textLight} minH="100vh">
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
                color={colors.textLight}
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
              transitionProperty="all"
              transitionDuration="0.3s"
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

        {/* Magazine-Style News Section */}
        <Box mb={{ base: 16, md: 24 }}>
          <MotionBox
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            mb={{ base: 8, md: 12 }}
          >
            <Heading size={{ base: "lg", md: "xl" }} color={colors.gold} textAlign="center">
              Latest News & Updates
            </Heading>
            <Box width="100px" height="3px" bg={colors.brightGold} mx="auto" mt={3} mb={10} />
          </MotionBox>

          {/* Featured Article + News Grid - Magazine Style Layout */}
          <Grid
            templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
            gap={{ base: 8, md: 10 }}
          >
            {/* Featured Article - Left Column */}
            <GridItem colSpan={1}>
              {featuredNews ? (
                <MotionBox
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  transition={{ duration: 0.6 }}
                  as={LinkBox}
                  borderWidth="1px"
                  borderRadius="xl"
                  overflow="hidden"
                  bg={colors.darkBgAlt}
                  borderColor={colors.midGreen}
                  boxShadow="lg"
                  height="100%"
                  _hover={{
                    borderColor: colors.gold,
                    transform: "translateY(-5px)",
                    boxShadow: "xl"
                  }}
                  transitionProperty="all"
                  transitionDuration="0.3s"
                >
                  {featuredNews.imageUrl && (
                    <Box position="relative" height={{ base: "240px", md: "320px" }}>
                      <Image
                        src={featuredNews.imageUrl}
                        alt={featuredNews.title}
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
                      <Badge
                        position="absolute"
                        top={4}
                        left={4}
                        bg={colors.midGreen}
                        color={colors.brightGold}
                        px={3}
                        py={1}
                        borderRadius="md"
                        fontWeight="bold"
                      >
                        FEATURED
                      </Badge>
                      <Box
                        position="absolute"
                        bottom={0}
                        left={0}
                        width="100%"
                        bgGradient={`linear(to-t, ${colors.darkBg}, transparent)`}
                        p={4}
                      >
                        <Badge
                          mb={2}
                          bg={colors.darkGreen}
                          color={colors.brightGold}
                          borderRadius="full"
                          px={2}
                        >
                          {featuredNews.category || "News"}
                        </Badge>
                        <Heading
                          as="h3"
                          size={{ base: "md", md: "lg" }}
                          color="white"
                          noOfLines={2}
                          textShadow="0 2px 4px rgba(0,0,0,0.7)"
                        >
                          <LinkOverlay as={NextLink} href={`/news/${featuredNews._id}`}>
                            {featuredNews.title}
                          </LinkOverlay>
                        </Heading>
                      </Box>
                    </Box>
                  )}
                  <Box p={{ base: 4, md: 6 }}>
                    {!featuredNews.imageUrl && (
                      <Heading as="h3" size="lg" mb={4} color={colors.gold}>
                        <LinkOverlay as={NextLink} href={`/news/${featuredNews._id}`}>
                          {featuredNews.title}
                        </LinkOverlay>
                      </Heading>
                    )}
                    <Text noOfLines={3} mb={4} color={colors.textLight} fontSize={{ base: "md", md: "lg" }}>
                      {featuredNews.body}
                    </Text>
                    <HStack spacing={4} color={colors.textMuted} fontSize="sm" mt={4}>
                      <Flex align="center">
                        <Icon as={FaUser} mr={1} />
                        <Text>{featuredNews.author || "Staff"}</Text>
                      </Flex>
                      <Flex align="center">
                        <Icon as={FaCalendarAlt} mr={1} />
                        <Text>{new Date(featuredNews.createdAt).toLocaleDateString()}</Text>
                      </Flex>
                      <Flex align="center">
                        <Icon as={FaClock} mr={1} />
                        <Text>{featuredNews.readTime || getReadTime(featuredNews.body)}</Text>
                      </Flex>
                    </HStack>
                  </Box>
                </MotionBox>
              ) : (
                <MotionFlex
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  justify="center"
                  align="center"
                  p={10}
                  borderRadius="lg"
                  bg={colors.darkBgAlt}
                  borderColor={colors.midGreen}
                  borderWidth="1px"
                  height="100%"
                >
                  <Text color={colors.textMuted}>No featured news available</Text>
                </MotionFlex>
              )}
            </GridItem>

            {/* News Grid - Right Column */}
            <GridItem colSpan={1}>
              <VStack spacing={4} align="stretch" height="100%">
                {news.length > 0 ? (
                  news.slice(0, 4).map((item, index) => (
                    <MotionBox
                      key={item._id}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={fadeInUp}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      as={LinkBox}
                      borderWidth="1px"
                      borderRadius="lg"
                      overflow="hidden"
                      bg={colors.darkBgAlt}
                      borderColor={colors.midGreen}
                      _hover={{
                        borderColor: colors.gold,
                        bg: colors.darkGreen,
                        transform: "translateX(5px)"
                      }}
                      transitionProperty="all"
                      transitionDuration="0.3s"
                    >
                      <HStack spacing={4} align="start">
                        {item.imageUrl && (
                          <Box
                            width={{ base: "100px", md: "120px" }}
                            height={{ base: "80px", md: "90px" }}
                            flexShrink={0}
                          >
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              height="100%"
                              width="100%"
                              objectFit="cover"
                              borderRadius="md"
                            />
                          </Box>
                        )}
                        <Box py={3} pr={4} flex="1">
                          <Badge
                            mb={1}
                            size="sm"
                            colorScheme="green"
                            variant="subtle"
                            bg={colors.darkGreen}
                            color={colors.brightGold}
                          >
                            {item.category || "News"}
                          </Badge>
                          <Heading as="h4" size="sm" mb={1} noOfLines={2} color={colors.gold}>
                            <LinkOverlay as={NextLink} href={`/news/${item._id}`}>
                              {item.title}
                            </LinkOverlay>
                          </Heading>
                          <HStack spacing={3} color={colors.textMuted} fontSize="xs">
                            <Text>{new Date(item.createdAt).toLocaleDateString()}</Text>
                            <Text>{item.readTime || getReadTime(item.body)}</Text>
                          </HStack>
                        </Box>
                      </HStack>
                    </MotionBox>
                  ))
                ) : (
                  <MotionFlex
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
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

                {/* View All News Link */}
                <MotionBox
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  display="flex"
                  justifyContent="flex-end"
                  mt={2}
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
                    View All News
                  </Button>
                </MotionBox>
              </VStack>
            </GridItem>
          </Grid>
        </Box>

        {/* Additional News Section - Magazine Style Grid */}
        {news.length > 4 && (
          <Box mb={{ base: 16, md: 20 }}>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 6, md: 8 }}>
              {news.slice(4).map((item, index) => (
                <MotionBox
                  key={item._id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  as={LinkBox}
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
                  transitionProperty="all"
                  transitionDuration="0.3s"
                >
                  {item.imageUrl && (
                    <Box position="relative" height={{ base: "160px", md: "180px" }}>
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
                            <Icon as={FaNewspaper} boxSize={8} color={colors.mutedGold} />
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
                    <Badge
                      mb={2}
                      bg={colors.darkGreen}
                      color={colors.brightGold}
                      borderRadius="full"
                      px={2}
                    >
                      {item.category || "News"}
                    </Badge>
                    <Heading size="md" mb={2} noOfLines={2} color={colors.gold}>
                      <LinkOverlay as={NextLink} href={`/news/${item._id}`}>
                        {item.title}
                      </LinkOverlay>
                    </Heading>
                    <Text noOfLines={2} mb={3} color={colors.textLight} fontSize={{ base: "sm", md: "md" }}>
                      {item.body}
                    </Text>
                    <HStack fontSize="sm" color={colors.mutedGold} mb={3} spacing={3}>
                      <Flex align="center">
                        <Icon as={FaCalendarAlt} size="sm" mr={1} />
                        <Text fontSize="xs">{new Date(item.createdAt).toLocaleDateString()}</Text>
                      </Flex>
                      <Flex align="center">
                        <Icon as={FaClock} size="sm" mr={1} />
                        <Text fontSize="xs">{item.readTime || getReadTime(item.body)}</Text>
                      </Flex>
                    </HStack>
                  </Box>
                </MotionBox>
              ))}
            </SimpleGrid>
          </Box>
        )}

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

          <SimpleGrid columns={{ base: 2, sm: 3, md: 6 }} spacing={{ base: 3, md: 6 }}>
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
                  transitionProperty="all"
                  transitionDuration="0.3s"
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
                        bg={colors.darkGreen} justify="center" align="center">
                        <Icon as={FaBook} boxSize={10} color={colors.gold} />
                      </Flex>
                    )}
                  </Box>
                  <Box p={2} textAlign="center">
                    <Text noOfLines={2} fontSize="sm" fontWeight="medium" color={colors.gold}>
                      {book.title}
                    </Text>
                    <Text fontSize="xs" color={colors.textMuted}>
                      {book.author}
                    </Text>
                  </Box>
                </MotionBox>
              ))
            ) : (
              <MotionBox
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                gridColumn="span 6"
                p={8}
                textAlign="center"
                borderRadius="lg"
                bg={colors.darkBgAlt}
                borderColor={colors.midGreen}
                borderWidth="1px"
              >
                <Text color={colors.textMuted}>No books available</Text>
              </MotionBox>
            )}
          </SimpleGrid>
        </Box>

        {/* Featured Videos */}
        <Box mb={{ base: 12, md: 16 }}>
          <Flex justify="space-between" align="center" mb={{ base: 6, md: 8 }}>
            <MotionBox
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Heading size={{ base: "md", md: "lg" }} color={colors.gold}>Featured Videos</Heading>
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

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={{ base: 4, md: 6 }}>
            {videos.length > 0 ? (
              videos.map((video, index) => (
                <MotionBox
                  key={video._id}
                  as={NextLink}
                  href={`/videos/${video._id}`}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
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
                  transitionProperty="all"
                  transitionDuration="0.3s"
                >
                  <Box position="relative" height={{ base: "180px", md: "160px" }}>
                    {video.thumbnailUrl ? (
                      <Image
                        src={video.thumbnailUrl}
                        alt={video.title}
                        width="100%"
                        height="100%"
                        objectFit="cover"
                      />
                    ) : (
                      <Flex
                        height="100%"
                        bg={colors.darkGreen}
                        justify="center"
                        align="center"
                      >
                        <Icon as={FaVideo} boxSize={10} color={colors.gold} />
                      </Flex>
                    )}
                    <Flex
                      position="absolute"
                      top="0"
                      left="0"
                      width="100%"
                      height="100%"
                      justify="center"
                      align="center"
                      bg="rgba(0,0,0,0.3)"
                      opacity={0.8}
                      _groupHover={{ opacity: 1 }}
                      transition="opacity 0.3s"
                    >
                      <Box
                        as={FaPlay}
                        size="40px"
                        color="white"
                        opacity={0.8}
                        _groupHover={{ opacity: 1, transform: "scale(1.1)" }}
                        transition="all 0.3s"
                      />
                    </Flex>
                  </Box>
                  <Box p={4}>
                    <Heading size="sm" mb={1} noOfLines={2} color={colors.gold}>
                      {video.title}
                    </Heading>
                    <Text fontSize="sm" noOfLines={2} color={colors.textMuted}>
                      {video.description}
                    </Text>
                  </Box>
                </MotionBox>
              ))
            ) : (
              <MotionBox
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                gridColumn="span 4"
                p={8}
                textAlign="center"
                borderRadius="lg"
                bg={colors.darkBgAlt}
                borderColor={colors.midGreen}
                borderWidth="1px"
              >
                <Text color={colors.textMuted}>No videos available</Text>
              </MotionBox>
            )}
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  );
}