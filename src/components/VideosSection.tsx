import { Box, Flex, Heading, SimpleGrid, Text, Button, Icon, Image } from "@chakra-ui/react";
import NextLink from "next/link";
import { FaArrowRight, FaVideo, FaPlay } from "react-icons/fa";
import { motion } from "framer-motion";
import { colors } from "../theme/colors";

const MotionBox = motion(Box);

interface VideosSectionProps {
    videos: any[];
}

export const VideosSection = ({ videos }: VideosSectionProps) => {
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
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
    );
};