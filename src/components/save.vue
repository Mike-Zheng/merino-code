<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-07-24 23:12:22
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-04-10 14:33:18
 * @Description: 保存文件
-->

<template>
  <div class="save-box">
    <v-btn style="margin-left: 10px" type="text" @click="beforeClear">
      {{ $t("empty") }}
    </v-btn>
    <v-dropdown style="margin-left: 10px" @on-click="saveWith">
      <v-btn type="primary">
        {{ $t("keep") }}
        <!-- <Icon type="ios-arrow-down"></Icon> -->
        icon down
      </v-btn>
      <template #list>
        <v-dropdown-menu>
          <v-dropdown-item name="clipboard">{{
            $t("copy_to_clipboard")
          }}</v-dropdown-item>
          <v-dropdown-item name="saveImg">{{
            $t("save_as_picture")
          }}</v-dropdown-item>
          <v-dropdown-item name="saveSvg">{{
            $t("save_as_svg")
          }}</v-dropdown-item>
          <v-dropdown-item name="saveJson" divided>{{
            $t("save_as_json")
          }}</v-dropdown-item>
        </v-dropdown-menu>
      </template>
    </v-dropdown>
  </div>
</template>

<script setup name="save-bar">
// import { Modal } from "view-ui-plus";
import useSelect from "@/hooks/select";

import { debounce } from "lodash-es";
import { useI18n } from "vue-i18n";
// import { downloadFile } from '@/utils/utils';

const { t } = useI18n();

const { canvasEditor } = useSelect();
const cbMap = {
  clipboard() {
    canvasEditor.clipboard();
  },

  saveJson() {
    canvasEditor.saveJson();
  },

  saveSvg() {
    canvasEditor.saveSvg();
  },

  saveImg() {
    canvasEditor.saveImg();
  }
};

const saveWith = debounce(function (type) {
  cbMap[type] && typeof cbMap[type] === "function" && cbMap[type]();
}, 300);

/**
 * @desc clear canvas 清空画布
 */
const clear = () => {
  canvasEditor.clear();
};

const beforeClear = () => {
  // Modal.confirm({
  //   title: t("tip"),
  //   content: `<p>${t("clearTip")}</p>`,
  //   okText: t("ok"),
  //   cancelText: t("cancel"),
  //   onOk: () => clear()
  // });
};
</script>

<style scoped lang="scss">
.save-box {
  display: inline-block;
  padding-right: 10px;
}
</style>
