/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#00D9B5',
                'primary-dark': '#00B89A',
                'primary-light': '#00FFD1',
                dark: {
                    100: '#1A1A1A',
                    200: '#0F0F0F',
                    300: '#050505',
                },
                glass: {
                    light: 'rgba(255, 255, 255, 0.05)',
                    medium: 'rgba(255, 255, 255, 0.1)',
                    dark: 'rgba(0, 0, 0, 0.3)',
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-primary': 'linear-gradient(135deg, #00D9B5 0%, #00FFD1 100%)',
                'glass-gradient': 'linear-gradient(135deg, rgba(0, 217, 181, 0.1) 0%, rgba(0, 255, 209, 0.05) 100%)',
            },
            boxShadow: {
                'glow': '0 0 20px rgba(0, 217, 181, 0.3)',
                'glow-lg': '0 0 40px rgba(0, 217, 181, 0.4)',
            },
            animation: {
                'float': 'float 3s ease-in-out infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}
