// components/shared/KhmerTitle.tsx
import { Heading, HeadingProps } from "@chakra-ui/react";
import { ReactNode } from "react";

// Define a proper type for the KhmerTitle component
interface KhmerTitleProps extends HeadingProps {
    children: ReactNode;
}

// Define color constants
export const COLORS = {
    darkGreen: {
        500: "#004d40", // Main dark green
        600: "#00352c", // Darker green
        700: "#002419", // Even darker green
    },
    black: {
        900: "#121212", // Main black
        800: "#1a1a1a", // Slightly lighter black
        700: "#282828", // Even lighter black
    },
    accent: {
        gold: "#BFA26C", // Military-inspired gold accent
    }
};

// KhmerTitle component
export const KhmerTitle = ({ children, ...props }: KhmerTitleProps) => {
    return (
        <Heading
            size="md"
            ml={3}
            fontWeight="400"
            letterSpacing="0.5px"
            color={COLORS.accent.gold} // Military gold accent
            fontFamily="'Moul', 'Dangrek', 'Battambang', sans-serif"
            {...props}
        >
            {children}
        </Heading>
    );
};