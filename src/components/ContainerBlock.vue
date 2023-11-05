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
  setup(props) {
    // setup() receives props as the first argument.
    console.log(props.foo);
  },
};
</script>
