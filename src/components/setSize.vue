<template>
  <div v-if="!mixinState.mSelectMode">
    <v-divider plain orientation="left">{{ $t("size") }}</v-divider>
    <v-form :label-width="40" class="form-wrap">
      <v-form-item :label="$t('width')" prop="name">
        <InputNumber
          disabled
          v-model="width"
          @on-change="setSize"
        ></InputNumber>
      </v-form-item>
      <v-form-item :label="$t('height')" prop="name">
        <InputNumber
          disabled
          v-model="height"
          @on-change="setSize"
        ></InputNumber>
      </v-form-item>
    </v-form>
    <v-btn type="primary" @click="() => (showModal = true)">调整尺寸</v-btn>

    <!-- <Modal
      v-model="showModal"
      :title="$t('setSizeTip')"
      @on-ok="handleConfirm"
      @on-cancel="handleClose"
    >
      <p>{{ $t("default_size") }}</p>
      <v-btnGroup vertical style="margin: 10px 0">
        <v-btn
          v-for="(item, i) in presetSize"
          :key="`${i}presetSize`"
          size="small"
          style="text-align: left"
          @click="setSizeBy(item.width, item.height)"
        >
          {{ item.label }}:{{ item.width }}x{{ item.height }}
        </v-btn>
      </v-btnGroup>

      <v-form
        :label-width="40"
        class="form-wrap"
        style="justify-content: flex-start"
      >
        <v-form-item
          :label="$t('width')"
          prop="name"
          style="margin-right: 10px"
        >
          <InputNumber
            :min="1"
            :max="99999999"
            v-model="modalData.width"
          ></InputNumber>
        </v-form-item>
        <v-form-item :label="$t('height')" prop="name">
          <InputNumber
            :min="1"
            :max="99999999"
            v-model="modalData.height"
          ></InputNumber>
        </v-form-item>
      </v-form>
    </Modal> -->
  </div>
</template>

<script setup name="CanvasSize">
// import { Modal } from "view-ui-plus";
import useSelect from "@/hooks/select";
import { useI18n } from "vue-i18n";

const { mixinState, canvasEditor } = useSelect();
const { t } = useI18n();

const DefaultSize = {
  width: 900,
  height: 1200
};

const showModal = ref(false);
const modalData = reactive({
  width: DefaultSize.width,
  height: DefaultSize.height
});
let width = ref(DefaultSize.width);
let height = ref(DefaultSize.height);
let presetSize = reactive([
  {
    label: t("red_book_vertical"),
    width: 900,
    height: 1200
  },
  {
    label: t("red_book_horizontal"),
    width: 1200,
    height: 900
  },
  {
    label: t("phone_wallpaper"),
    width: 1080,
    height: 1920
  },
  {
    label: "kindle",
    width: 1200,
    height: 860
  },
  {
    label: "kindle-resize",
    width: 860,
    height: 1200
  }
]);

onMounted(() => {
  canvasEditor.setSize(width.value, height.value);
  canvasEditor.on("sizeChange", (w, h) => {
    width.value = w;
    height.value = h;
  });

  // canvas.editor.editorWorkspace.setSize(width.value, height.value);
  // canvas.editor.editorWorkspace = new EditorWorkspace(canvas.c, {
  //   width: width.value,
  //   height: height.value,
  // });
});

const setSizeBy = (w, h) => {
  modalData.width = w;
  modalData.height = h;
};
const setSize = () => {
  canvasEditor.setSize(width.value, height.value);
  // canvas.editor.editorWorkspace.setSize(width.value, height.value);
};

const handleClose = () => {
  showModal.value = false;
};

const handleConfirm = () => {
  width.value = modalData.width;
  height.value = modalData.height;
  setSize();
  handleClose();
};
</script>

<style scoped lang="scss">
.form-wrap {
  display: flex;
  justify-content: space-around;
  align-content: center;
  margin-bottom: 10px;
}
</style>
