<template>
  <div
    class="editor-main"
    v-drop-image="{
      url: 'YourUploadUrl',
      highlightStyle: { backgroundColor: 'lightblue' }
    }"
  >
    <CanvasHeader class="layout-header" />
    <div class="layout-content">
      <CanvasLeft class="layout-content-left" />
      <CanvasMenu
        class="layout-content-menu"
        :class="{ 'menu-close': poolShow !== true }"
      />
      <!-- <CanvasThumb class="layout-content-thumb" /> -->
      <div
        class="layout-content-center"
        :class="{ 'menu-close': poolShow !== true }"
      >
        <CanvasCenter class="center-body" />

        <CanvasAffix class="center-affix" />
        <ZoomTools class="zoom-tools" />
      </div>
      <CanvasRight class="layout-content-right" />
      <CanvasDom class="layout-content-dom" />
    </div>
    <CanvasTools class="center-tools" />
  </div>
</template>

<script lang="ts" setup>
import CanvasLeft from "./CanvasLeft/index.vue";
import CanvasMenu from "./CanvasMenu/index.vue";
import CanvasThumb from "./CanvasThumb/index.vue";
import CanvasHeader from "./CanvasHeader/index.vue";
import CanvasCenter from "./CanvasCenter/index.vue";
import CanvasRight from "./CanvasRight/index.vue";
import CanvasTools from "./CanvasTools/index.vue";
import CanvasAffix from "./CanvasAffix/index.vue";
import CanvasDom from "./CanvasDom/index.vue";
import ZoomTools from "./ZoomTools/index.vue";
import { useMainStore } from "@/store";
import { storeToRefs } from "pinia";

const mainStore = useMainStore();
const { poolShow } = storeToRefs(mainStore);
</script>

<style lang="scss" scoped>
.editor-main {
  height: 100%;
}

.layout-content {
  height: calc(100% - 30px);
  display: flex;
}
.layout-header {
  position: relative;
  border-left: 1px solid #000;
  background-color: #232323;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  font-size: 13px;
  user-select: none;
  height: 30px;
  color: #fff;
}
.layout-content-left {
  width: 70px;
  height: 100vh;
  z-index: 10;
  background: #181818;
  // border-right: solid 1px $borderColor;
  color: #fff;
}
.layout-content-menu {
  position: absolute;
  position: absolute;
  left: 69px;
  top: 41px;
  width: 245px;
  transition:
    left 150ms linear,
    right 150ms linear;
  &.menu-close {
    position: absolute;
    left: -176px;
    top: 41px;
  }
}
.layout-content-thumb {
  width: 245px;
  height: 100%;
  display: flex;
  flex-shrink: 0;
  background-color: #fff;
  flex-direction: column;
  user-select: none;
}
.layout-content-center {
  position: relative;
  width: calc(100% - 70px - 245px);
  margin-left: 245px;
  transition:
    margin 150ms linear,
    width 150ms linear;
  &.menu-close {
    width: calc(100% - 70px);
    margin-left: 0;
  }

  .center-body {
    height: 100%;
    // margin: 100px;
  }
}
.zoom-tools {
  position: absolute;
  bottom: 15px;
  width: 380px;
  transform: translateX(-50%);
  z-index: 50;
  height: 40px;
  left: 50%;
  color: #fff;
}
.center-tools {
  height: 40px;
  position: absolute;
  top: 80px;
  left: 125px;
  border-top: 1px solid $borderColor;
  background-color: $lightGray;
  line-height: 1.5;
  display: flex;
  justify-content: space-between;
}
.layout-content-right {
  position: absolute;
  top: 80px;
  right: 0;
  background-color: transparent;
  width: 260px;
  // border-left: solid 1px $borderColor;
  display: flex;
  flex-direction: column;
}
.layout-content-dom {
  // background: pink;
  position: absolute;
  z-index: -200;
  // height: 100%;
  // top: -200px;
}
</style>
