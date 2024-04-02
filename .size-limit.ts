import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    limit: '20 kB',
    path: ['dist/**/*.*'],
    brotli: true,
  },
] as SizeLimitConfig;
