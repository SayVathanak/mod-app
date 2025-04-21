module.exports = {
    content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
            },
            fontFamily: {
                sans: ['Arial', 'Helvetica', 'sans-serif'],
                mono: ['Courier', 'monospace'],
            },
        },
    },
    plugins: [],
};