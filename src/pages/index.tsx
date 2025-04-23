import { Box, Container } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { HeroSlider } from "../components/HeroSlider";
import { ResourcesSection } from "../components/ResourcesSection";
import { NewsSection } from "../components/NewsSection";
import { BooksSection } from "../components/BooksSection";
import { VideosSection } from "../components/VideosSection";
import { colors } from "../theme/colors";

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
  const [isLoading, setIsLoading] = useState(true);

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
  }, []);

  // Function to estimate read time
  const getReadTime = (text: string) => {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  return (
    <Box bg={colors.darkBg} color={colors.textLight} minH="100vh">
      {/* Hero Slider */}
      <HeroSlider slides={slides} />

      <Container maxW="container.xl" py={{ base: 10, md: 16 }} px={{ base: 4, md: 6 }}>

        {/* News Section */}
        <NewsSection
          featuredNews={featuredNews}
          news={news}
          getReadTime={getReadTime}
        />

        {/* Featured Books */}
        <BooksSection books={books} />

        {/* Featured Videos */}
        <VideosSection videos={videos} />

        {/* Resources Section */}
        <ResourcesSection
          books={books}
          videos={videos}
          news={news}
          featuredNews={featuredNews}
        />
      </Container>
    </Box>
  );
}