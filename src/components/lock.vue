<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-04-10 14:43:36
 * @Description: 锁定元素
-->

<template>
  <v-tooltip
    :content="$t('quick.lock')"
    v-if="mixinState.mSelectMode === 'one'"
  >
    <v-btn
      v-if="isLock"
      @click="doLock(false)"
      icon="md-lock"
      type="text"
    ></v-btn>
    <v-btn v-else @click="doLock(true)" icon="md-unlock" type="text"></v-btn>
  </v-tooltip>
</template>

<script setup name="Lock">
import useSelect from "@/hooks/select";
import { onBeforeUnmount, onMounted } from "vue";

const { mixinState, canvasEditor } = useSelect();
const lockAttrs = [
  "lockMovementX",
  "lockMovementY",
  "lockRotation",
  "lockScalingX",
  "lockScalingY"
];
const isLock = ref(false);
const lock = () => {
  // 修改自定义属性
  mixinState.mSelectActive.hasControls = false;
  // 修改默认属性
  lockAttrs.forEach((key) => {
    mixinState.mSelectActive[key] = true;
  });

  mixinState.mSelectActive.selectable = false;

  isLock.value = true;
  canvasEditor.canvas.renderAll();
};
const unLock = () => {
  // 修改自定义属性
  mixinState.mSelectActive.hasControls = true;
  // 修改默认属性
  lockAttrs.forEach((key) => {
    mixinState.mSelectActive[key] = false;
  });
  mixinState.mSelectActive.selectable = true;

  isLock.value = false;
  canvasEditor.canvas.renderAll();
};

const doLock = (isLock) => {
  isLock ? lock() : unLock();
};

const handleSelected = (items) => {
  isLock.value = !items[0].hasControls;
  // eslint-disable-next-line prefer-destructuring
  mixinState.mSelectActive = items[0];
};

onMounted(() => {
  canvasEditor.on("selectOne", handleSelected);
});

onBeforeUnmount(() => {
  canvasEditor.off("selectOne", handleSelected);
});
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
