<script lang="ts" setup>
import { PropType } from "vue";

defineProps({
  name: {
    type: String as PropType<string>,
    default: "",
  },
  width: {
    type: String as PropType<string>,
    default: "20px",
  },
  height: {
    type: String as PropType<string>,
    default: "20px",
  },
  color: {
    type: String as PropType<string>,
    default: "#333333",
  },
});
</script>
<template>
  <svg class="icon" aria-hidden="true">
    <use :xlink:href="`#${name}`" :fill="color"></use>
  </svg>
</template>
<style scoped lang="scss">
.icon {
  width: v-bind(width);
  height: v-bind(height);
  display: block;
}
</style>
