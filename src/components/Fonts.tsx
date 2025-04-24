// components/Fonts.tsx
import { Global } from "@emotion/react";

const Fonts = () => (
    <Global
        styles={`
      @font-face {
        font-family: 'Moul Light';
        src: url('/fonts/KhmerMoulLight.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
    `}
    />
);

export default Fonts;