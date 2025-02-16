<template>
  <div
    class="image-container"
    ref="container"
    :style="{
      position: 'relative',
      background: color,
      padding: `${padding}px`,
    }"
  >
    <div class="img-overlay">
      <slot />
    </div>
    <img :style="{ 'object-fit': objectFit }" v-if="src" ref="img" :src="src" :alt="alt" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "ResponsiveImage",
  props: {
    src: {
      type: String,
      required: true,
    },
    ratio: {
      type: Number,
    },
    alt: {
      type: String,
      default: "Image",
    },
    color: {
      type: String,
    },
    height: {
      type: Number,
    },
    objectFit: {
      type: String,
      default: "cover",
    },
    padding: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const container = ref(null);
    const img = ref(null);

    function resizeImage() {
      const conEl = (container.value as unknown) as HTMLImageElement;
      if (!props.src) {
        conEl.style.height = `${props.height}px`;
      } else if (props.ratio) {
        const imgEl = (img.value as unknown) as HTMLImageElement;
        const w = imgEl.getBoundingClientRect().width;
        const h = Math.floor(props.ratio * w);
        conEl.style.height = `${h}px`;
      }
    }

    onMounted(() => {
      resizeImage();
      window.addEventListener("resize", resizeImage);
    });

    onUnmounted(() => {
      window.removeEventListener("resize", resizeImage);
    });

    return { container, img };
  },
});
</script>

<style scoped>
.image-container {
  position: relative;
  overflow: hidden;
}

img {
  width: 100%;
  height: 100%;
}

.img-overlay {
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
