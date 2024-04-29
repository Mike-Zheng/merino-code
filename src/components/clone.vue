<template>
  <v-tooltip
    v-if="mixinState.mSelectMode === 'one'"
    :content="$t('quick.copy')"
  >
    <v-btn @click="clone" icon="ios-copy" type="text"></v-btn>
  </v-tooltip>
</template>

<script setup name="Clone">
import useSelect from "@/hooks/select";
import { debounce } from "lodash-es";

const { mixinState, canvasEditor } = useSelect();
const clone = debounce(function () {
  canvasEditor.clone();
}, 300);
</script>
