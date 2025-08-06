import antfu from '@antfu/eslint-config'
import tailwind from 'eslint-plugin-tailwindcss'

export default [
  {
    ignores: [
      'dist',
      '.parcel-cache',
      'node_modules',
      '*.min.js',
      'src/service-worker.js',
    ],
  },
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
]
