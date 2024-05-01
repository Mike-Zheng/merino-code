<template>
  <div class="icons-container">
    <div class="grid-wrapper">
      <div class="grid">
        <div
          v-for="item of svgIconsList"
          :key="item"
          @click="handleClipboard(generateIconCode(item), $event)"
        >
          <!-- <div>{{ generateIconCode(item) }}</div> -->

          <div class="icon-item">
            <svg-icon :icon-class="item" />
            <span>{{ item }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
// import clipboard from "@/utils/clipboard.js";
import copy from "copy-to-clipboard";
import svgIcons from "./svg-icons.js";
// import svgPics from "./svg-pics.js";
// import elementIcons from "./element-icons.js";
// import fontawesomeIcons from "./fontawesome-icons.js";

const handleClipboard = (text: string, event: MouseEvent) => {
  console.log(text, event);
  // clipboard(text, event);
  copy(text);
};

const generateIconCode = (symbol: string) =>
  `<svg-icon icon-class="${symbol}" />`;

const svgIconsList = ref(svgIcons);
// const svgPics = ref(svgPics);

// const fontawesomeIcons = ref(fontawesomeIcons);
</script>

<style lang="scss" scoped>
.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;

  .grid-wrapper {
    overflow: auto;
    height: calc(100vh + 80px);
  }
  .grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .icon-item {
    margin: 20px;
    height: 85px;
    text-align: center;
    width: 100px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
  }

  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }

  .disabled {
    pointer-events: none;
  }
}
</style>
