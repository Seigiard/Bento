import type { SizeLimitConfig } from "size-limit";

module.exports = [
  {
    limit: "45 kB",
    path: ["dist/**/*.*"],
    brotli: true,
  },
] as SizeLimitConfig;
