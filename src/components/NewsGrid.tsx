import {
  VStack,
  Box,
  HStack,
  Badge,
  Heading,
  Text,
  LinkBox,
  LinkOverlay,
  Image,
  Button,
  Flex,
  Icon,
  SimpleGrid
} from "@chakra-ui/react";
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

export const NewsGrid = ({ newsItems, getReadTime, limit = 6 }: NewsGridProps) => {
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
    <VStack spacing={6} align="stretch">
      {/* Section Header */}
      <Flex
        justify={{ base: "center", md: "space-between" }}
        align="center"
        direction={{ base: "column", md: "row" }}
        gap={4}
      >
        <Heading
          size="md"
          color={colors.gold}
          fontFamily="'Kantumruy Pro', sans-serif"
        >
          Latest News
        </Heading>
        <Button
          as={NextLink}
          href="/news"
          variant="outline"
          rightIcon={<FaArrowRight />}
          borderColor={colors.gold}
          color={colors.gold}
          _hover={{
            bg: colors.darkGreen,
            borderColor: colors.brightGold,
            color: colors.brightGold
          }}
          size="sm"
        >
          View All News
        </Button>
      </Flex>

      {/* News Cards Grid */}
      {displayItems.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {displayItems.map((item, index) => (
            <MotionBox
              key={item._id}
              as={LinkBox}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              bg={colors.darkBgAlt}
              borderColor={colors.midGreen}
              _hover={{
                borderColor: colors.gold,
                bg: colors.darkGreen,
                transform: "translateY(-4px)",
                boxShadow: "lg"
              }}
              transition="all 0.3s ease"
            >
              {item.imageUrl && (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  height="160px"
                  width="100%"
                  objectFit="cover"
                />
              )}

              <Box p={4}>
                <Badge
                  mb={2}
                  size="xs"
                  bg={colors.darkGreen}
                  color={colors.brightGold}
                  fontFamily="'Kantumruy Pro', sans-serif"
                >
                  {item.category || "News"}
                </Badge>

                <Text
                  as="h3"
                  fontSize="md"
                  fontWeight="bold"
                  mb={2}
                  color={colors.gold}
                  fontFamily="'Kantumruy Pro', sans-serif"
                  noOfLines={2}
                >
                  <LinkOverlay as={NextLink} href={`/news/${item._id}`}>
                    {item.title}
                  </LinkOverlay>
                </Text>

                <HStack spacing={3} fontSize="sm" color={colors.textMuted}>
                  <HStack spacing={1}>
                    <Icon as={FaCalendarAlt} />
                    <Text fontFamily="'Kantumruy Pro', sans-serif">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                  </HStack>
                  <HStack spacing={1}>
                    <Icon as={FaClock} />
                    <Text fontFamily="'Kantumruy Pro', sans-serif">
                      {item.readTime || getReadTime(item.body)}
                    </Text>
                  </HStack>
                </HStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
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
          <Text color={colors.textMuted} fontFamily="'Kantumruy Pro', sans-serif">
            No news articles available
          </Text>
        </MotionFlex>
      )}
    </VStack>
  );
};