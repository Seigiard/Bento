import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import tailwind from 'eslint-plugin-tailwindcss'

export default tseslint.config(
  {
    ignores: [
      'dist',
      '.parcel-cache',
      'node_modules',
      '*.min.js',
      'src/service-worker.js',
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    plugins: {
      tailwindcss: tailwind,
    },
    rules: {
      ...tailwind.configs['flat/recommended'].rules,
    },
    settings: {
      tailwindcss: {
        callees: ['classnames', 'clsx', 'ctl', 'cva', 'tv'],
      },
    },
  },
);
