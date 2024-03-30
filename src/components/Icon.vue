<script setup>
import { computed } from 'vue';
import { Moon, Sun, SunMoon } from 'lucide-vue-next';

const icons = {
  Moon,
  Sun,
  SunMoon,
};

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  size: Number,
  color: String,
  strokeWidth: Number,
  class: String,
});

const icon = computed(() => icons[props.name] || icons.SunMoon);
</script>

<template>
  <component
    :is="icon"
    :size="size"
    :color="color"
    :stroke-width="strokeWidth"
    :class="class"
  />
</template>
