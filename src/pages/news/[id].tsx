import { GetServerSideProps } from "next";
import Head from "next/head";
import {
    Box,
    Heading,
    Text,
    Image,
    Container,
} from "@chakra-ui/react";

type NewsItem = {
    _id: string;
    title: string;
    body: string;
    imageUrl?: string;
};

type Props = {
    news: NewsItem;
};

export default function NewsDetailPage({ news }: Props) {
    return (
        <>
            <Head>
                <title>{news.title} | MediaVerse</title>
                <meta name="description" content={news.body.slice(0, 150)} />
            </Head>

            <Container maxW="container.md" p={6}>
                {news.imageUrl && (
                    <Image
                        src={news.imageUrl}
                        alt={news.title}
                        borderRadius="md"
                        mb={4}
                        w="100%"
                        objectFit="cover"
                    />
                )}

                <Heading mb={4} fontSize={["2xl", "3xl", "4xl"]}>
                    {news.title}
                </Heading>

                <Text fontSize={["md", "lg"]} whiteSpace="pre-wrap">
                    {news.body}
                </Text>
            </Container>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.params!;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/news/${id}`);
    const news = await res.json();

    return { props: { news } };
};
