import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import antfu from '@antfu/eslint-config'
import tailwind from 'eslint-plugin-tailwindcss'

function findTailwindImportCss(dir) {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== 'dist') {
      const result = findTailwindImportCss(fullPath)
      if (result)
        return result
    }
    else if (file.endsWith('.css')) {
      const content = fs.readFileSync(fullPath, 'utf-8')
      if (content.includes('@import "tailwindcss') || content.includes('@import \'tailwindcss')) {
        return fullPath
      }
    }
  }

  return null
}

export default antfu({
  typescript: true,
  ignores: [
    'dist',
    '.parcel-cache',
    'node_modules',
    '*.min.js',
    'src/service-worker.js',
  ],
}, {
  ...tailwind.configs['flat/recommended'][0],
  settings: {
    tailwindcss: {
      callees: ['classnames', 'clsx', 'ctl', 'cva', 'tv'],
    },
  },
})
