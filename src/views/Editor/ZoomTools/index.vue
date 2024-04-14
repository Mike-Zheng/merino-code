<template>
  <div>
    <div class="app-zoom-tools">
      <div class="center-bottom-option">
        <div
          class="fullscreen-button"
          :title="$t('Link_tools.Full_Screen')"
          @click="resetCanvas"
        >
          <svg-icon icon-class="fit-to-screen-outline" />
        </div>
        <div
          class="scale-slider-button"
          :class="{
            'scale-slider-button__disabled': +canvasZoom <= 10
          }"
          :title="$t('Link_tools.Zoom_Out')"
          @click="scaleCanvas('-')"
        >
          <svg-icon icon-class="minus" />
        </div>
        <div class="scale-slider">
          <el-slider v-model="canvasZoom" :step="5" :min="10" :max="255" />
        </div>
        <div
          class="scale-slider-button"
          :class="{
            'scale-slider-button__disabled': +canvasZoom >= 500
          }"
          :title="$t('Link_tools.Zoom_In')"
          @click="scaleCanvas('+')"
        >
          <svg-icon icon-class="plus" />
        </div>

        <div class="scale-value">{{ canvasZoom }}</div>
      </div>

      <!-- <el-popover
        placement="bottom"
        trigger="click"
        width="100"
        popper-class="viewport-size"
      >
        <template #reference>
          <span class="text" ref="scaleRef">{{ canvasZoom }}</span>
        </template>
        <div class="viewport-size-preset">
          <div
            class="preset-item"
            v-for="item in canvasZoomPresets"
            :key="item"
            @click="applyCanvasPresetScale(item)"
          >
            {{ item }}%
          </div>
        </div>
      </el-popover> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { ElementNames } from "@/types/elements";
import { storeToRefs } from "pinia";
import { Object as FabricObject, Group } from "fabric";
import {
  useFabricStore,
  useMainStore,
  useSnapshotStore,
  useTemplatesStore
} from "@/store";
import useI18n from "@/hooks/useI18n";
import useCanvas from "@/views/Canvas/useCanvas";
import useHandleTool from "@/hooks/useHandleTool";
import useCanvasScale from "@/hooks/useCanvasScale";
import useHandleElement from "@/hooks/useHandleElement";
import useHistorySnapshot from "@/hooks/useHistorySnapshot";

const fabricStore = useFabricStore();
const mainStore = useMainStore();
const templatesStore = useTemplatesStore();
const { t } = useI18n();
const { alignElement, layerElement } = useHandleTool();
const { setCanvasScalePercentage, scaleCanvas, resetCanvas } = useCanvasScale();
const { combineElements, uncombineElements, intersectElements } =
  useHandleElement();
const { zoom } = storeToRefs(fabricStore);
const { canvasObject } = storeToRefs(mainStore);

const scaleRef = ref();
// const canvasZoom = computed(() => Math.round(zoom.value * 100));
const canvasZoomPresets = [200, 150, 100, 80, 50];

const handleElement = computed(() => canvasObject.value as FabricObject);

// 标尺显示隐藏
const changeRuler = () => {
  const [canvas] = useCanvas();
  if (!canvas.ruler) return;
  canvas.ruler.enabled = !canvas.ruler.enabled;
};

const canvasZoom = computed({
  // getter
  get() {
    return Math.round(zoom.value * 100);
  },
  // setter
  set(newValue) {
    // Note: we are using destructuring assignment syntax here.
    // [firstName.value, lastName.value] = newValue.split(" ");
    setCanvasScalePercentage(newValue);
  }
});

const applyCanvasPresetScale = (value: number) => {
  setCanvasScalePercentage(value);
};
// const setZoom = ()
</script>

<style lang="scss" scoped>
.left-handler {
  display: flex;
  align-items: center;
}
.center-handler {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  .handler-icon {
    font-size: 14px;
    width: 18px;
  }
  .icon-down {
    transition: margin-top 0.05s;
  }
  .handler-item {
    width: 32px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 2px;
    border-radius: $borderRadius;
  }
}
.handler-item {
  margin: 0 10px;
  font-size: 14px;
  overflow: hidden;
  cursor: pointer;

  &.disable {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
.right-handler {
  display: flex;
  align-items: center;

  .text {
    width: 40px;
    text-align: center;
    cursor: pointer;
  }
}
.preset-item {
  padding: 8px 20px;
  text-align: center;
  cursor: pointer;

  &:hover {
    color: $themeColor;
  }
}
.center-handler .handler-dropdown {
  display: flex;
  width: 42px;
  height: 24px;
  align-items: center;
  padding: 2px;
  justify-content: center;
  border-radius: $borderRadius;
  &:hover {
    background: #f1f1f1;
    .icon-down {
      margin-top: 3px;
    }
  }
}
</style>

<style>
.el-popover.el-popper.viewport-size {
  min-width: 100px;
  padding: 0;
}
</style>

<style lang="scss">
.app-zoom-tools {
  top: 0;
  background-color: #181a1e;
  position: relative;
  height: 100%;
  width: 100%;
  border-radius: 10px;
  .el-checkbox {
    .el-checkbox__label {
      color: #555;
    }
    .el-checkbox__inner {
      background-color: #5586e7;
      border-color: #5586e7;
    }
  }
}
.center-bottom-option {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  justify-content: center;
  align-items: center;

  .fullscreen-button {
    cursor: pointer;
    box-shadow: 0 0 3px 0 #27364e1f;
    height: 24px;
    line-height: 24px;
    font-size: 14px;
    background-color: #23232e;
    width: 24px;
    text-align: center;
    border-radius: 3px;
    color: #888;
    &:hover {
      color: #5586e7;
    }
  }

  .scale-slider-button {
    cursor: pointer;
    box-shadow: 0 0 3px 0 #27364e1f;
    height: 24px;
    line-height: 24px;
    font-size: 12px;
    background-color: #23232e;
    width: 24px;
    text-align: center;
    border-radius: 50px;
    color: #888;
    margin-left: 15px;
    margin-right: 15px;
    transition: all 0.2s ease;
    &:hover {
      color: #5586e7;
    }
    .scale-slider-button__disabled {
      color: #eee;
      pointer-events: none;
    }
  }

  .scale-value {
    box-shadow: 0 0 3px 0 #27364e1f;
    height: 24px;
    line-height: 24px;
    font-size: 12px;
    background-color: #23232e;
    padding: 0 10px;
    text-align: center;
    border-radius: 3px;
    color: #888;
    width: 65px;
  }
}

.scale-slider {
  width: 150px;
  /* height: 15px; */
  .el-slider__bar {
    height: 2px;
    background-color: #5586e7;
  }
  .el-slider__runway {
    margin: 0;
    height: 2px;
    background-color: #888;
  }
  .el-slider__button-wrapper {
    top: -17px;
  }
  .el-slider__button {
    width: 14px;
    height: 14px;
    border: 2px solid #5586e7;
    background-color: #23232e;
  }
}

.app-footer__version {
  display: inline-block;
  width: fit-content;
  height: 100%;
  line-height: 40px;
  padding: 0 10px;
  font-size: 12px;
  text-align: center;
  color: #888;
  cursor: pointer;
}
.terms-policies-text {
  margin: 0 10px;
  margin-top: 8px;
  display: inline-block;
  height: 24px;
  text-align: center;
  line-height: 22px;
  color: #5586e7;
  vertical-align: top;
  transition: 0.3s all ease;
  font-size: 12px;
  border-radius: 3px;
  text-decoration: underline;
  cursor: pointer;
}
</style>
