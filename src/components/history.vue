<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-02-06 17:00:13
 * @Description: 回退重做
-->

<template>
  <div style="display: inline-block">
    <!-- 后退 -->
    <v-tooltip :content="$t('history.revocation') + `(${canUndo})`">
      <v-btn @click="undo" type="text" size="small" :disabled="!canUndo">
        <!-- <Icon type="ios-undo" size="20" /> -->
        icon undo
      </v-btn>
    </v-tooltip>

    <!-- 重做 -->
    <v-tooltip :content="$t('history.redo') + `(${canRedo})`">
      <v-btn @click="redo" type="text" size="small" :disabled="!canRedo">
        <!-- <Icon type="ios-redo" size="20" /> -->
        icon redo
      </v-btn>
    </v-tooltip>
    <!-- <span class="time" v-if="history.length">
      {{ useDateFormat(history[0].timestamp, 'HH:mm:ss').value }}
    </span> -->
  </div>
</template>

<script setup lang="ts">
import useSelect from "@/hooks/select";
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

<style scoped lang="less">
span.active {
  svg.icon {
    fill: #2d8cf0;
  }
}

.time {
  color: #c1c1c1;
}
</style>

<script lang="ts">
export default {
  name: "ToolBar"
};
</script>
