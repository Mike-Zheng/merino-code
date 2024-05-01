<template>
  <!-- 后退 -->

  <div @click="undo" :disabled="!canUndo">
    <!-- <Icon type="ios-undo" size="20" /> -->
    <SvgIcon icon-class="undo" className="svg-size" />
    <!-- icon undo -->
  </div>

  <!-- 重做 -->

  <div @click="redo" :disabled="!canRedo">
    <!-- <Icon type="ios-redo" size="20" /> -->
    <SvgIcon icon-class="redo" className="svg-size" />
    <!-- icon redo -->
  </div>

  <!-- <span class="time" v-if="history.length">
      {{ useDateFormat(history[0].timestamp, 'HH:mm:ss').value }}
    </span> -->
</template>

<script setup lang="ts">
import useSelect from "@/hooks/select";
import { onMounted, ref } from "vue";
const { canvasEditor } = useSelect() as { canvasEditor: any };
const canUndo = ref(0);
const canRedo = ref(0);
// 后退
const undo = () => {
  canvasEditor.undo();
};
// 重做
const redo = () => {
  canvasEditor.redo();
};

onMounted(() => {
  canvasEditor.on(
    "historyUpdate",
    (canUndoParam: number, canRedoParam: number) => {
      canUndo.value = canUndoParam;
      canRedo.value = canRedoParam;
    }
  );
});
</script>

<style scoped lang="scss">
span.active {
  svg.icon {
    fill: #2d8cf0;
  }
}

.time {
  color: #c1c1c1;
}

.history {
  color: #000;
}
</style>

<script lang="ts">
export default {
  name: "ToolBar"
};
</script>
