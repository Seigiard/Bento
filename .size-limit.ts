import type { SizeLimitConfig } from 'size-limit'

module.exports = [
  {
    limit: '21 kB',
    path: ['dist/**/*.*'],
    brotli: true,
  },
] as SizeLimitConfig
