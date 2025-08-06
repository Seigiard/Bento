import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import antfu from '@antfu/eslint-config'
import tailwind from 'eslint-plugin-tailwindcss'
export default antfu(
  {
    typescript: true,
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
)
