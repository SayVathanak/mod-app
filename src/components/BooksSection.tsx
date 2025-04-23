import { Box, Flex, Heading, SimpleGrid, Text, Button, Icon, Image } from "@chakra-ui/react";
import NextLink from "next/link";
import { FaArrowRight, FaBook } from "react-icons/fa";
import { motion } from "framer-motion";
import { colors } from "../theme/colors";
import { KhmerTitle } from "./shared/KhmerTitle";

const MotionBox = motion(Box);

interface BooksSectionProps {
    books: any[];
}

export const BooksSection = ({ books }: BooksSectionProps) => {
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <Box mb={{ base: 12, md: 20 }}>
            <Flex justify="space-between" align="center" mb={{ base: 6, md: 8 }}>
                <MotionBox
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    <KhmerTitle size={{ base: "md", md: "lg" }} color={colors.gold}>កម្រងអត្ថបទ</KhmerTitle>
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
    );
};