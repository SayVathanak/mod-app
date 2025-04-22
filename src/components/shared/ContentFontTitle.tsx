import { Heading, HeadingProps } from "@chakra-ui/react";
import { ReactNode } from "react";

// Define a proper type for the ContentFontTitle component
interface ContentFontTitleProps extends HeadingProps {
    children: ReactNode;
}

// ContentFontTitle component using Kantumruy Pro
export const ContentFontTitle = ({ children, ...props }: ContentFontTitleProps) => {
    return (
        <Heading
            size="md"
            ml={3}
            fontWeight="400"
            letterSpacing="0.3px"
            color="gray.800"
            fontFamily="'Kantumruy Pro', sans-serif"
            {...props}
        >
            {children}
        </Heading>
    );
};
