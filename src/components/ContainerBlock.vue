<template>
  <div
    :class="class"
    :style="{
      gridArea: position,
    }"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: { position: String, class: String },
};
</script>
