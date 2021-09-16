const tailwindCssConfig = {
    purge: {
        enabled: true,
        layers: ["components", "utilities"],
        content: [
            "./src/**/*.html",
            "./src/**/*.js",
            "./src/**/*.jsx",
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
