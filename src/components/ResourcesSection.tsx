import { Box, Heading, Text, SimpleGrid, Icon, Badge } from "@chakra-ui/react";
import NextLink from "next/link";
import { FaBook, FaVideo, FaMap, FaNewspaper } from "react-icons/fa";
import { motion } from "framer-motion";
import { colors } from "../theme/colors";

const MotionBox = motion(Box);

interface ResourceItem {
    title: string;
    icon: any;
    color: string;
    link: string;
    count: number;
}

interface ResourcesSectionProps {
    books: any[];
    videos: any[];
    news: any[];
    featuredNews: any | null;
}

export const ResourcesSection = ({ books, videos, news, featuredNews }: ResourcesSectionProps) => {
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const resourceItems: ResourceItem[] = [
        { title: "Books", icon: FaBook, color: colors.brightGold, link: "/books", count: books.length },
        { title: "Videos", icon: FaVideo, color: colors.gold, link: "/videos", count: videos.length },
        { title: "Maps", icon: FaMap, color: colors.gold, link: "/maps", count: 0 },
        { title: "News", icon: FaNewspaper, color: colors.mutedGold, link: "/news", count: news.length + (featuredNews ? 1 : 0) },
    ];

    return (
        <>
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

            <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={{ base: 5, md: 8 }}>
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
        </>
    );
};