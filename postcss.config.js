import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import postcssZoomMedia from './src/lib/postcss-zoom-media.ts';

export default {
  plugins: [tailwindcss, autoprefixer, postcssZoomMedia()],
};
