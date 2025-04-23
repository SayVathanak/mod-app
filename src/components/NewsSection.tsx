import { Grid, GridItem, Box, Heading, SimpleGrid } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FeaturedNews } from "./FeaturedNews";
import { NewsGrid } from "./NewsGrid";
import { colors } from "../theme/colors";
import { AdditionalNews } from "./AdditionalNews ";

const MotionBox = motion(Box);

interface NewsSectionProps {
    featuredNews: any;
    news: any[];
    getReadTime: (text: string) => string;
}

export const NewsSection = ({ featuredNews, news, getReadTime }: NewsSectionProps) => {
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
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
                    <FeaturedNews newsItem={featuredNews} getReadTime={getReadTime} />
                </GridItem>

                {/* News Grid - Right Column */}
                <GridItem colSpan={1}>
                    <NewsGrid newsItems={news} getReadTime={getReadTime} limit={4} />
                </GridItem>
            </Grid>

            {/* Additional News Section - Magazine Style Grid */}
            {news.length > 4 && (
                <AdditionalNews newsItems={news.slice(4)} getReadTime={getReadTime} />
            )}
        </Box>
    );
};