import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    limit: '3 MB',
    path: ['dist/**/*.*'],
    brotli: true,
  },
] as SizeLimitConfig;
