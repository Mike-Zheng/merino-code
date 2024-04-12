<template>
  <div class="edit-pool">
    <div class="edit-section">
      <div class="font-bold text-lg mb-6px">文字</div>
      <el-row :gutter="10" class="mt-10">
        <el-col :span="8">
          <div class="item-box" @click="drawText(80)">
            <SvgIcon icon-class="h1" class="icon-font" />
            <div class="mt-5px">标题</div>
          </div>
        </el-col>
        <el-col :span="8" @click="drawText(60)">
          <div class="item-box">
            <SvgIcon icon-class="h3" class="icon-font" />
            <div class="mt-5px">副标题</div>
          </div>
        </el-col>
        <el-col :span="8" @click="drawText(36)">
          <div class="item-box">
            <SvgIcon icon-class="textRotationNone" class="icon-font" />
            <div class="mt-5px">横排正文</div>
          </div>
        </el-col>
        <el-col :span="8" @click="drawVerticalText(36)">
          <div class="item-box">
            <SvgIcon icon-class="textRotationDown" class="icon-font" />
            <div class="mt-5px">竖排正文</div>
          </div>
        </el-col>
        <el-col :span="8" @click="drawText(36, undefined, true)">
          <div class="item-box">
            <SvgIcon icon-class="text" class="icon-font" />
            <div class="mt-5px">镂空正文</div>
          </div>
        </el-col>
        <el-col :span="8" @click="drawArcText">
          <div class="item-box">
            <SvgIcon icon-class="distortion" class="icon-font" />
            <div class="mt-5px">环形正文</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="edit-section">
      <div class="font-bold text-lg mb-6px">形状</div>
      <el-row :gutter="10" class="mt-10">
        <el-col
          :span="8"
          v-for="(shape, index) in PathShapeLibs"
          :key="index"
          @click="drawPath(shape)"
        >
          <div class="item-box">
            <svg overflow="visible" width="20" height="20">
              <g
                :transform="`scale(${20 / shape.viewBox[0]}, ${20 / shape.viewBox[1]}) translate(0,0) matrix(1,0,0,1,0,0)`"
              >
                <path
                  class="shape-path"
                  :class="{ outlined: shape.outlined }"
                  vector-effect="non-scaling-stroke"
                  stroke-linecap="butt"
                  stroke-miterlimit="8"
                  :fill="shape.outlined ? '#999' : 'transparent'"
                  :stroke="shape.outlined ? 'transparent' : '#999'"
                  stroke-width="2"
                  :d="shape.path"
                ></path>
              </g>
            </svg>
          </div>
        </el-col>
        <el-col
          :span="8"
          v-for="(line, j) in LinePoolItems"
          :key="j"
          @click="drawLine(line)"
        >
          <div class="item-box">
            <svg overflow="visible" width="20" height="20">
              <defs>
                <LinePointMarker
                  class="line-marker"
                  v-if="line.points[0]"
                  :id="`preset-line-${j}`"
                  position="start"
                  :type="line.points[0]"
                  color="currentColor"
                  :baseSize="2"
                />
                <LinePointMarker
                  class="line-marker"
                  v-if="line.points[1]"
                  :id="`preset-line-${j}`"
                  position="end"
                  :type="line.points[1]"
                  color="currentColor"
                  :baseSize="2"
                />
              </defs>
              <path
                class="line-path"
                :d="line.path"
                stroke="#999"
                fill="none"
                stroke-width="2"
                :stroke-dasharray="line.style === 'solid' ? '0, 0' : '4, 1'"
                :marker-start="
                  line.points[0]
                    ? `url(#${`preset-line-${j}`}-${line.points[0]}-start)`
                    : ''
                "
                :marker-end="
                  line.points[1]
                    ? `url(#${`preset-line-${j}`}-${line.points[1]}-end)`
                    : ''
                "
              ></path>
            </svg>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ShapePathFormulasKeys, PathListItem } from "@/types/elements";

import { PathPoolItem } from "@/types/elements";

import { LinePoolItems, LinePoolItem } from "@/configs/lines";

import useHandleCreate from "@/hooks/useHandleCreate";

const {
  createTextElement,
  createPathElement,
  createLineElement,
  createArcTextElement,
  createVerticalTextElement
} = useHandleCreate();

const PathShapeLibs: PathPoolItem[] = [
  {
    viewBox: [200, 200],
    path: "M 0 0 L 200 0 L 200 200 L 0 200 Z"
  },
  {
    viewBox: [200, 200],
    path: "M 100 0 L 0 200 L 200 200 L 100 0 Z",
    pathFormula: ShapePathFormulasKeys.TRIANGLE
  },
  {
    viewBox: [200, 200],
    path: "M 100 0 A 50 50 0 1 1 100 200 A 50 50 0 1 1 100 0 Z"
  }
];

// 添加标题文字
const drawText = (
  fontSize: number,
  textStyle: "transverse" | "direction" = "transverse",
  textHollow: boolean = false
) => {
  createTextElement(fontSize, textStyle, textHollow);
};

// 添加环形文字
const drawArcText = () => {
  createArcTextElement(36);
};

const drawVerticalText = (fontSize: number) => {
  createVerticalTextElement(fontSize);
};

// 添加形状
const drawPath = (shape: PathPoolItem) => {
  createPathElement(shape.path);
};

// 添加线条
const drawLine = (line: LinePoolItem) => {
  const strokeDashArray: [number, number] | undefined =
    line.style === "dashed" ? [6, 6] : undefined;
  createLineElement(line.data, line.points[0], line.points[1], strokeDashArray);
};
</script>

<style lang="scss" scoped>
.edit-pool {
  overflow: scroll;
}
.mt-10 {
  margin-top: 10px;
}
.edit-section {
  width: 90%;
  margin: 0px 20px 0px 20px;
  .item-box {
    background-color: #f6f6f6;
    border-radius: 5px;
    padding: 15px 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    flex-direction: column;
    font-size: 12px;
    margin-bottom: 10px;
    &:hover {
      background-color: #e8eaec;
    }
  }
}
.mt-5px {
  margin-top: 5px;
}
.edit-upload {
  .item-box {
    width: 100%;
  }
}
.code-common {
  width: 100%;
  height: 80px;
  border: 1px solid $borderColor;
  border-radius: 5px;
  margin: 0 20px 20px 20px;
  background: #f6f6f6;
  display: flex;
  cursor: pointer;
}
.code-icon {
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.code-text {
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.font-middle {
  font-size: 12px;
  font-weight: 500;
  color: #31363f;
  line-height: 12px;
  margin: 5px 0;
}
.font-little {
  font-size: 12px;
  font-weight: 400;
  color: #31363f;
  line-height: 12px;
  margin: 5px 0;
}
.icon-font {
  font-size: 20px;
}
:deep(.edit-upload .el-upload) {
  width: 100%;
}
</style>
