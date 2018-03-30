// PostCss plugins
module.exports = {
    plugins: {
        'postcss-easy-import': {},
        'autoprefixer': {
            browsers: ['last 6 versions', '> 95%'],
        },
        'postcss-mixins': {},
        'postcss-nested': {},
        'postcss-custom-properties': {},
        'postcss-custom-media': {},
        'postcss-nesting': {},
        // 'postcss-flexbugs-fixes': {},
        'postcss-input-style': {},
        'postcss-extend': {},
        'postcss-object-fit-images': {},
        'postcss-gradient-transparency-fix': {},
    }
};