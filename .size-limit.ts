import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    limit: '25 kB',
    path: ['dist/**/*.*'],
    brotli: true,
  },
] as SizeLimitConfig;
