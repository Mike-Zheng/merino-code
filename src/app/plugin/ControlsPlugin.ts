/*
 * @Author: 秦少卫
 * @Date: 2023-06-13 23:00:43
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-04-10 17:32:54
 * @Description: 控制条插件
 */

import Editor from "../Editor";
type IEditor = Editor;
import NP from "number-precision";
import { fabric } from "fabric";
import verticalImg from "../assets/middlecontrol.svg";
// import verticalImg from './middlecontrol.svg';
import horizontalImg from "../assets/middlecontrolhoz.svg";
import edgeImg from "../assets/edgecontrol.svg";
import rotateImg from "../assets/rotateicon.svg";

/**
 * 实际场景: 在进行某个对象缩放的时候，由于fabricjs默认精度使用的是toFixed(2)。
 * 此处为了缩放的精度更准确一些，因此将NUM_FRACTION_DIGITS默认值改为4，即toFixed(4).
 */
fabric.Object.NUM_FRACTION_DIGITS = 4;

function drawImg(
  ctx: CanvasRenderingContext2D,
  left: number,
  top: number,
  img: HTMLImageElement,
  wSize: number,
  hSize: number,
  angle: number | undefined
) {
  if (angle === undefined) return;
  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(fabric.util.degreesToRadians(angle));
  ctx.drawImage(img, -wSize / 2, -hSize / 2, wSize, hSize);
  ctx.restore();
}

// 中间横杠
function intervalControl() {
  const verticalImgIcon = document.createElement("img");
  verticalImgIcon.src = verticalImg;

  const horizontalImgIcon = document.createElement("img");
  horizontalImgIcon.src = horizontalImg;

  function renderIcon(
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    styleOverride: any,
    fabricObject: fabric.Object
  ) {
    drawImg(ctx, left, top, verticalImgIcon, 20, 25, fabricObject.angle);
  }

  function renderIconHoz(
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    styleOverride: any,
    fabricObject: fabric.Object
  ) {
    drawImg(ctx, left, top, horizontalImgIcon, 25, 20, fabricObject.angle);
  }
  // 中间横杠
  fabric.Object.prototype.controls.ml = new fabric.Control({
    x: -0.5,
    y: 0,
    offsetX: -1,
    cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingXOrSkewingY,
    getActionName: fabric.controlsUtils.scaleOrSkewActionName,
    render: renderIcon
  });

  fabric.Object.prototype.controls.mr = new fabric.Control({
    x: 0.5,
    y: 0,
    offsetX: 1,
    cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingXOrSkewingY,
    getActionName: fabric.controlsUtils.scaleOrSkewActionName,
    render: renderIcon
  });

  fabric.Object.prototype.controls.mb = new fabric.Control({
    x: 0,
    y: 0.5,
    offsetY: 1,
    cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingYOrSkewingX,
    getActionName: fabric.controlsUtils.scaleOrSkewActionName,
    render: renderIconHoz
  });

  fabric.Object.prototype.controls.mt = new fabric.Control({
    x: 0,
    y: -0.5,
    offsetY: -1,
    cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingYOrSkewingX,
    getActionName: fabric.controlsUtils.scaleOrSkewActionName,
    render: renderIconHoz
  });
}

// 顶点
function peakControl() {
  const img = document.createElement("img");
  img.src = edgeImg;

  function renderIconEdge(
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    styleOverride: any,
    fabricObject: fabric.Object
  ) {
    drawImg(ctx, left, top, img, 25, 25, fabricObject.angle);
  }
  // 四角图标
  fabric.Object.prototype.controls.tl = new fabric.Control({
    x: -0.5,
    y: -0.5,
    cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingEqually,
    render: renderIconEdge
  });
  fabric.Object.prototype.controls.bl = new fabric.Control({
    x: -0.5,
    y: 0.5,
    cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingEqually,
    render: renderIconEdge
  });
  fabric.Object.prototype.controls.tr = new fabric.Control({
    x: 0.5,
    y: -0.5,
    cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingEqually,
    render: renderIconEdge
  });
  fabric.Object.prototype.controls.br = new fabric.Control({
    x: 0.5,
    y: 0.5,
    cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingEqually,
    render: renderIconEdge
  });
}
// 删除
function deleteControl(canvas: fabric.Canvas) {
  const deleteIcon =
    "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";
  const delImg = document.createElement("img");
  delImg.src = deleteIcon;

  function renderDelIcon(
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    styleOverride: any,
    fabricObject: fabric.Object
  ) {
    drawImg(ctx, left, top, delImg, 24, 24, fabricObject.angle);
  }

  // 删除选中元素
  function deleteObject(mouseEvent: MouseEvent, target: fabric.Transform) {
    if (target.action === "rotate") return true;
    const activeObject = canvas.getActiveObjects();
    if (activeObject) {
      activeObject.map((item) => canvas.remove(item));
      canvas.requestRenderAll();
      canvas.discardActiveObject();
    }
    return true;
  }

  // 删除图标
  fabric.Object.prototype.controls.deleteControl = new fabric.Control({
    x: 0.5,
    y: -0.5,
    offsetY: -16,
    offsetX: 16,
    cursorStyle: "pointer",
    mouseUpHandler: deleteObject,
    render: renderDelIcon
    // cornerSize: 24,
  });
}

// 旋转
function rotationControl() {
  const img = document.createElement("img");
  img.src = rotateImg;
  function renderIconRotate(
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    styleOverride: any,
    fabricObject: fabric.Object
  ) {
    drawImg(ctx, left, top, img, 40, 40, fabricObject.angle);
  }
  // 旋转图标
  fabric.Object.prototype.controls.mtr = new fabric.Control({
    x: 0,
    y: 0.5,
    cursorStyleHandler: fabric.controlsUtils.rotationStyleHandler,
    actionHandler: fabric.controlsUtils.rotationWithSnapping,
    offsetY: 30,
    // withConnecton: false,
    actionName: "rotate",
    render: renderIconRotate
  });
}

// x y 座標
function positionControl(canvas: fabric.Canvas) {
  const toFixed = (v: number, digits = 2): number => NP.round(v, digits);
  const getWidthHeight = (fabricObject: fabric.Object) => {
    const objScale = fabricObject.getObjectScaling();
    console.log("objScale", objScale);

    const point = fabricObject._getTransformedDimensions(
      +objScale.scaleX,
      +objScale.scaleY
    );

    return {
      x: toFixed(point.x),
      y: toFixed(point.y)
    };
  };
  function renderPositionXY(
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    styleOverride: any,
    fabricObject: fabric.Object
  ) {
    const PiBy180 = Math.PI / 180;

    ctx.save();
    ctx.translate(left, top);

    const calcRotate = () => {
      const objectAngle = fabricObject.angle || 0;
      const angleInRadians = objectAngle * PiBy180;
      const x = Math.sin(angleInRadians);
      const y = Math.cos(angleInRadians);
      const angle =
        Math.abs(x) > Math.abs(y) ? Math.sign(x) * 90 : Math.sign(y) * 90 - 90;
      return (objectAngle - angle) * PiBy180;
    };

    ctx.rotate(calcRotate());

    const fontSize = 12;
    ctx.font = `${fontSize}px Tahoma`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const { x, y } = getWidthHeight(fabricObject);

    const text = `${x} × ${y}`;
    const width = ctx.measureText(text).width + 8;
    const height = fontSize + 6;

    // 背景
    ctx.roundRect(-width / 2, -height / 2, width, height, 4);
    // 物件選取後下方顯示size的區塊
    ctx.fillStyle = "#179DE3";
    ctx.fill();

    // 文字
    ctx.fillStyle = "#fff";
    ctx.fillText(text, 0, 1);
    ctx.restore();
  }

  // xy 位置图标
  fabric.Object.prototype.controls.xy = new fabric.Control({
    x: 0,
    y: 0.5,
    cursorStyleHandler: () => "",
    offsetY: 20,
    sizeX: 0.0001,
    sizeY: 0.0001,
    touchSizeX: 0.0001,
    touchSizeY: 0.0001,
    render: renderPositionXY
  });
}

class ControlsPlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  static pluginName = "ControlsPlugin";
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;
    this.init();
  }
  init() {
    // 删除图标
    deleteControl(this.canvas);
    // 顶点图标
    peakControl();
    // 中间横杠图标
    intervalControl();
    // 旋转图标
    rotationControl();
    // // 物件選取後下方顯示size的區塊
    positionControl();

    // 选中样式
    fabric.Object.prototype.set({
      transparentCorners: false,
      borderColor: "#51B9F9",
      cornerColor: "#FFF",
      borderScaleFactor: 2.5,
      cornerStyle: "circle",
      cornerStrokeColor: "#0E98FC",
      borderOpacityWhenMoving: 1
    });
    // textbox保持一致
    // fabric.Textbox.prototype.controls = fabric.Object.prototype.controls;
  }

  destroy() {
    console.log("pluginDestroy");
  }
}

export default ControlsPlugin;
