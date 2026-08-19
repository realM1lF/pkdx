import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import postcssZoomMedia from './src/lib/postcss-zoom-media.mjs';

export default {
  plugins: [tailwindcss, autoprefixer, postcssZoomMedia()],
};
