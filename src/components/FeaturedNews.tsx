import { Box, Heading, Text, Badge, HStack, Flex, Icon, LinkBox, LinkOverlay, Image } from "@chakra-ui/react";
import NextLink from "next/link";
import { FaNewspaper, FaUser, FaCalendarAlt, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";
import { colors } from "../theme/colors";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

interface FeaturedNewsProps {
    newsItem: any;
    getReadTime: (text: string) => string;
}

export const FeaturedNews = ({ newsItem, getReadTime }: FeaturedNewsProps) => {
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    if (!newsItem) {
        return (
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
        );
    }

    return (
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
            {newsItem.imageUrl && (
                <Box position="relative" height={{ base: "240px", md: "320px" }}>
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
                            {newsItem.category || "News"}
                        </Badge>
                        <Heading
                            as="h3"
                            size={{ base: "md", md: "lg" }}
                            color="white"
                            noOfLines={2}
                            textShadow="0 2px 4px rgba(0,0,0,0.7)"
                        >
                            <LinkOverlay as={NextLink} href={`/news/${newsItem._id}`}>
                                {newsItem.title}
                            </LinkOverlay>
                        </Heading>
                    </Box>
                </Box>
            )}
            <Box p={{ base: 4, md: 6 }}>
                {!newsItem.imageUrl && (
                    <Heading as="h3" size="lg" mb={4} color={colors.gold}>
                        <LinkOverlay as={NextLink} href={`/news/${newsItem._id}`}>
                            {newsItem.title}
                        </LinkOverlay>
                    </Heading>
                )}
                <Text noOfLines={3} mb={4} color={colors.textLight} fontSize={{ base: "md", md: "lg" }}>
                    {newsItem.body}
                </Text>
                <HStack spacing={4} color={colors.textMuted} fontSize="sm" mt={4}>
                    <Flex align="center">
                        <Icon as={FaUser} mr={1} />
                        <Text>{newsItem.author || "Staff"}</Text>
                    </Flex>
                    <Flex align="center">
                        <Icon as={FaCalendarAlt} mr={1} />
                        <Text>{new Date(newsItem.createdAt).toLocaleDateString()}</Text>
                    </Flex>
                    <Flex align="center">
                        <Icon as={FaClock} mr={1} />
                        <Text>{newsItem.readTime || getReadTime(newsItem.body)}</Text>
                    </Flex>
                </HStack>
            </Box>
        </MotionBox>
    );
};