<script setup>
import { computed } from 'vue';
import {
  Mail,
  Moon,
  Sun,
  Calendar,
  ListTodo,
  Music,
  Coffee,
  PawPrint,
} from "lucide-vue-next";

const icons = {
  Mail,
  Moon,
  Sun,
  Calendar,
  ListTodo,
  Music,
  Coffee,
  PawPrint
};

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: Number,
  color: String,
  strokeWidth: Number,
  class: String
})

const icon = computed(() => icons[props.name] ||  icons.PawPrint);
</script>

<template>
  <component :is="icon" :size="size" :color="color" :stroke-width="strokeWidth" :class="class" />
</template>
