<template>
  <div class="zoom">
    <div class="app-zoom-tools">
      <div class="center-bottom-option">
        <div
          class="fullscreen-button"
          :title="$t('Link_tools.Full_Screen')"
          @click="rSet"
        >
          <svg-icon icon-class="fit-to-screen-outline" />
        </div>
        <div
          class="scale-slider-button"
          :class="{
            'scale-slider-button__disabled': +canvasZoom <= 10
          }"
          :title="$t('Link_tools.Zoom_Out')"
          @click="small"
        >
          <svg-icon icon-class="minus" />
        </div>
        <div class="scale-slider">
          <v-slider
            v-model="canvasZoom"
            :step="5"
            :min="10"
            :max="255"
            thumb-label
          ></v-slider>
        </div>
        <div
          class="scale-slider-button"
          :class="{
            'scale-slider-button__disabled': +canvasZoom >= 500
          }"
          :title="$t('Link_tools.Zoom_In')"
          @click="big"
        >
          <svg-icon icon-class="plus" />
        </div>
        <div
          class="fullscreen-button"
          :title="$t('Link_tools.Full_Screen')"
          @click="setViewport"
        >
          <svg-icon icon-class="fullscreen-exit" />
        </div>

        <div class="scale-value">{{ canvasZoom }}</div>
      </div>
    </div>
  </div>
</template>

<script setup name="Zoom">
import useSelect from "@/hooks/select";
import { ref, onMounted } from "vue";
const { canvasEditor, fabric } = useSelect();
const canvasZoom = ref(100);

// onMounted(() => {
//   canvasEditor.canvas.on("after:render", () => {
//     canvasZoom.value = Math.round(canvasEditor.canvas.getZoom() * 100);
//   });
// });

// const canvasZoom = computed({
//   // getter
//   get() {
//     return Math.round(zoom.value * 100);
//   },
//   // setter
//   set(newValue) {
//     // Note: we are using destructuring assignment syntax here.
//     // [firstName.value, lastName.value] = newValue.split(" ");
//     setCanvasScalePercentage(newValue);
//   }
// });

const rSet = () => {
  canvasEditor.one();

  console.log("canvasEditor", canvasEditor.canvas);
  console.log(canvasEditor.canvas.getZoom());
};
const big = () => {
  canvasEditor.big();
};
const small = () => {
  canvasEditor.small();
};
const setViewport = () => {
  canvasEditor.auto();
};
</script>

<style>
.el-popover.el-popper.viewport-size {
  min-width: 100px;
  padding: 0;
}
</style>

<style lang="scss">
.zoom {
  position: absolute;
  bottom: 15px;
  width: 380px;
  transform: translateX(-50%);
  z-index: 50;
  height: 40px;
  left: 50%;
  color: #fff;
}

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
