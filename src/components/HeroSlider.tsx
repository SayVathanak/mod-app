import { Box, Container, Heading, Text, Button, Icon, HStack, Flex } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import NextLink from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { colors } from "../theme/colors";

const MotionBox = motion(Box);

type SlideContent = {
    title: string;
    description: string;
    imageUrl: string;
    buttonText: string;
    buttonLink: string;
};

interface HeroSliderProps {
    slides: SlideContent[];
}

export const HeroSlider = ({ slides }: HeroSliderProps) => {
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        // Auto-advance slides
        const interval = setInterval(() => {
            setActiveSlide(prev => (prev + 1) % slides.length);
        }, 6000);

        return () => clearInterval(interval);
    }, [slides.length]);

    return (
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
    );
};