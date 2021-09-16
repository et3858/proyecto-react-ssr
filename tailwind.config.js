require("dotenv").config();

const tailwindCssConfig = {
    purge: {
        layers: ["components", "utilities"],
        content: [
            "./dist/**/*.html",
            "./dist/**/*.js",
        ],
    },
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [],
};

module.exports = tailwindCssConfig;
