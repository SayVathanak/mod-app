// theme/index.ts (or theme.ts)
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    // Customize your theme here
    colors: {
        brand: {
            100: "#f7fafc",
            900: "#1a202c",
        },
    },
});

export default theme;
