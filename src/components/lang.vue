<!--
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-05-20 09:18:28
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-07-29 22:24:03
-->
<template>
  <v-dropdown @on-click="setLang">
    <v-btn type="text">
      {{ lang }}
      <!-- <Icon type="ios-arrow-down"></Icon> -->
      icon down
    </v-btn>
    <template #list>
      <v-dropdown-menu>
        <v-dropdown-item
          v-for="lang in langList"
          :key="lang.langType"
          :name="lang.langType"
        >
          {{ lang.langName }}
        </v-dropdown-item>
      </v-dropdown-menu>
    </template>
  </v-dropdown>
</template>

<script setup name="saveBar">
import { setLocal } from "@/utils/local";
import { LANG } from "@/config/constants/app";

import { useI18n } from "vue-i18n";
const { locale } = useI18n();

const LANGMAP = {
  zh: "中文",
  en: "En"
};

let langList = reactive(
  Object.keys(LANGMAP).map((key) => ({ langType: key, langName: LANGMAP[key] }))
);

const lang = computed(() => {
  return LANGMAP[locale.value];
});

// 设置语言
const setLang = (type) => {
  locale.value = type;
  setLocal(LANG, type);
};
</script>

<style scoped lang="scss"></style>
