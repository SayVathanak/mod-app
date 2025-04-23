import { Box, Heading, Text, Image, Icon, HStack, Flex, Badge, LinkBox, LinkOverlay, SimpleGrid } from "@chakra-ui/react";
import { motion } from "framer-motion";
import NextLink from "next/link";
import { FaNewspaper, FaCalendarAlt, FaClock } from "react-icons/fa";
import { colors } from "../theme/colors";

const MotionBox = motion(Box);

interface AdditionalNewsProps {
    newsItems: any[];
    getReadTime: (text: string) => string;
}

export const AdditionalNews = ({ newsItems, getReadTime }: AdditionalNewsProps) => {
    if (!newsItems || newsItems.length === 0) return null;

    return (
        <Box mt={{ base: 12, md: 16 }}>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 6, md: 8 }}>
                {newsItems.map((item, index) => (
                    <NewsItem key={item._id} newsItem={item} index={index} getReadTime={getReadTime} />
                ))}
            </SimpleGrid>
        </Box>
    );
};

interface NewsItemProps {
    newsItem: any;
    index: number;
    getReadTime: (text: string) => string;
}

const NewsItem = ({ newsItem, index, getReadTime }: NewsItemProps) => {
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <MotionBox
            key={newsItem._id}
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
            {newsItem.imageUrl && (
                <Box position="relative" height={{ base: "160px", md: "180px" }}>
                    <Image
                        src={newsItem.imageUrl}
                        alt={newsItem.title}
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
                    {newsItem.category || "News"}
                </Badge>
                <Text size="md" mb={2} noOfLines={2} color={colors.gold}>
                    <LinkOverlay as={NextLink} href={`/news/${newsItem._id}`}>
                        {newsItem.title}
                    </LinkOverlay>
                </Text>
                <Text noOfLines={2} mb={3} color={colors.textLight} fontSize={{ base: "sm", md: "md" }}>
                    {newsItem.body}
                </Text>
                <HStack fontSize="sm" color={colors.mutedGold} mb={3} spacing={3}>
                    <Flex align="center">
                        <Icon as={FaCalendarAlt} size="sm" mr={1} />
                        <Text fontSize="xs">{new Date(newsItem.createdAt).toLocaleDateString()}</Text>
                    </Flex>
                    <Flex align="center">
                        <Icon as={FaClock} size="sm" mr={1} />
                        <Text fontSize="xs">{newsItem.readTime || getReadTime(newsItem.body)}</Text>
                    </Flex>
                </HStack>
            </Box>
        </MotionBox>
    );
};