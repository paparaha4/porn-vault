<template>
  <div style="padding: 10px">
    <div>Home</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, useMeta } from "@nuxtjs/composition-api";

export default defineComponent({
  head: {},
  setup() {
    const { title } = useMeta();

    title.value = "Home";

    return {};
  },
});
</script>

<style scoped></style>
