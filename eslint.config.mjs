import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  ignores: [
    'dist',
    '.parcel-cache',
    'node_modules',
    '*.min.js',
    'src/service-worker.js',
  ],
})
