import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    limit: '120 kB',
    path: ['dist/**/*.*'],
    brotli: true,
  },
] as SizeLimitConfig;
