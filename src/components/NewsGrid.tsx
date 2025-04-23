import { VStack, Box, HStack, Badge, Heading, Text, LinkBox, LinkOverlay, Image, Button, Flex, Icon } from "@chakra-ui/react";
import NextLink from "next/link";
import { FaArrowRight, FaCalendarAlt, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";
import { colors } from "../theme/colors";

const MotionFlex = motion(Flex);
const MotionBox = motion(Box);

interface NewsGridProps {
    newsItems: any[];
    getReadTime: (text: string) => string;
    limit?: number;
}

export const NewsGrid = ({ newsItems, getReadTime, limit = 4 }: NewsGridProps) => {
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    const displayItems = newsItems.slice(0, limit);

    return (
        <VStack spacing={3} align="stretch" height="100%">
            {displayItems.length > 0 ? (
                displayItems.map((item, index) => (
                    <MotionBox
                        key={item._id}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        as={LinkBox}
                        borderWidth="1px"
                        borderRadius="md"
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
                        <HStack spacing={2} align="center">
                            {item.imageUrl && (
                                <Box
                                    width={{ base: "80px", md: "120px" }}
                                    height={{ base: "60px", md: "90px" }}
                                    flexShrink={0}
                                    overflow="hidden"
                                    position="relative"
                                >
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.title}
                                        height="100%"
                                        width="100%"
                                        objectFit="cover"
                                        borderRadius="sm"
                                    />
                                </Box>
                            )}
                            <Box py={0} pr={3} flex="1">
                                <Badge
                                    mb={0.5}
                                    size="xs"
                                    colorScheme="green"
                                    variant="subtle"
                                    bg={colors.darkGreen}
                                    color={colors.brightGold}
                                >
                                    {item.category || "News"}
                                </Badge>
                                <Text
                                    as="h4"
                                    fontSize="xs"
                                    fontWeight="medium"
                                    mb={0.5}
                                    noOfLines={2}
                                    color={colors.gold}
                                    fontFamily="'Kantumruy Pro', sans-serif"
                                >
                                    <LinkOverlay as={NextLink} href={`/news/${item._id}`}>
                                        {item.title}
                                    </LinkOverlay>
                                </Text>
                                <HStack spacing={2} color={colors.textMuted} fontSize="xs">
                                    <Text fontFamily="'Kantumruy Pro', sans-serif">{new Date(item.createdAt).toLocaleDateString()}</Text>
                                    <Text fontFamily="'Kantumruy Pro', sans-serif">{item.readTime || getReadTime(item.body)}</Text>
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
                    p={8}
                    borderRadius="md"
                    bg={colors.darkBgAlt}
                    borderColor={colors.midGreen}
                    borderWidth="1px"
                >
                    <Text color={colors.textMuted} fontFamily="'Kantumruy Pro', sans-serif">No news articles available</Text>
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
                mt={1}
            >
                <Button
                    as={NextLink}
                    href="/news"
                    variant="outline"
                    rightIcon={<FaArrowRight />}
                    borderColor={colors.gold}
                    color={colors.gold}
                    _hover={{ bg: colors.darkGreen, borderColor: colors.brightGold, color: colors.brightGold }}
                    size={{ base: "xs", md: "sm" }}
                    fontFamily="'Kantumruy Pro', sans-serif"
                >
                    View All News
                </Button>
            </MotionBox>
        </VStack>
    );
};