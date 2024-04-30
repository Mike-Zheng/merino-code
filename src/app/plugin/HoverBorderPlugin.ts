/*
 * @Author: 秦少卫
 * @Date: 2023-06-27 12:26:41
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-04-10 17:33:58
 * @Description: 画布区域插件
 */

import { fabric } from "fabric";
import Editor from "../Editor";
import { throttle, clone } from "lodash-es";
import { computed, watch } from "vue";
type IEditor = Editor;

const isCollection = (
  thing?: unknown
): thing is fabric.Group | fabric.ActiveSelection | fabric.Canvas => {
  return !!thing && Array.isArray((thing as fabric.Group)._objects);
};

const borderColor = "#179DE3";

class HoverBorderPlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  static pluginName = "HoverBorderPlugin";
  // static events = ["sizeChange"];
  // static apis = ["big", "small", "auto", "one", "setSize"];
  workspaceEl!: HTMLElement;
  workspace: null | fabric.Rect;
  option: any;
  // constructor(canvas: fabric.Canvas, editor: IEditor) {
  //   this.canvas = canvas;
  //   this.editor = editor;
  //   this.workspace = null;
  //   this.init({
  //     width: 900,
  //     height: 2000
  //   });
  // }

  private canvasEvents;

  private lineWidth = 1.5;
  private hoveredTarget: fabric.Object | undefined;

  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;

    this.init();
  }

  init() {
    const workspaceEl = document.querySelector("#workspace") as HTMLElement;
    if (!workspaceEl) {
      throw new Error("element #workspace is missing, plz check!");
    }
    this.workspaceEl = workspaceEl;
    // this.workspace = null;

    // this.canvasEvents = {
    //   "mouse:out": this.drawBorder.bind(this),
    //   "mouse:over": this.clearBorder.bind(this)
    // };

    // this.canvas.on(this.canvasEvents);

    // this.canvas.on("mouse:out", this.drawBorder.bind(this));
    // this.canvas.on("mouse:over", this.clearBorder.bind(this));

    this.canvas.on("mouse:over", this.drawBorder.bind(this));
    this.canvas.on("mouse:out", this.clearBorder.bind(this));

    // this._register(
    //   addDisposableListener(this.canvas.upperCanvasEl, "mouseout", () => {
    //     if (this.canvas.contextTopDirty && this.hoveredTarget) {
    //       this.clearContextTop(this.hoveredTarget.group || this.hoveredTarget);
    //       this.hoveredTarget = undefined;
    //     }
    //   })
    // );
    // this.initWatch();
  }

  private clearContextTop(target: fabric.Object, restoreManually = false) {
    const ctx = this.canvas.contextTop;
    ctx.save();
    ctx.transform(...this.canvas.viewportTransform);
    target.transform(ctx);
    const { strokeWidth, scaleX, scaleY, strokeUniform } = target;
    const zoom = this.canvas.getZoom();
    // we add 4 pixel, to be sure to do not leave any pixel out
    const width =
      target.width +
      4 / zoom +
      (strokeUniform ? strokeWidth / scaleX : strokeWidth);
    const height =
      target.height +
      4 / zoom +
      (strokeUniform ? strokeWidth / scaleY : strokeWidth);
    ctx.clearRect(-width / 2, -height / 2, width, height);
    restoreManually || ctx.restore();
    return ctx;
  }

  private clearBorder(e: fabric.IEvent) {
    const target = e.target;

    this.hoveredTarget = undefined;

    if (!target || target === this.canvas._activeObject) return;

    this.clearBorderByObject(target);
  }

  private clearBorderByObject(target: fabric.Object) {
    console.log("clearBorderByObject");
    if (this.canvas.contextTopDirty) {
      this.clearContextTop(target);
    }
  }

  private drawBorder(e: fabric.IEvent) {
    const target = e.target;
    console.log("drawBorder");

    if (!target || target === this.canvas._activeObject) return;

    this.drawBorderByObject(target);
  }

  private drawBorderByObject(target: fabric.Object) {
    this.hoveredTarget = target;

    const ctx = this.clearContextTop(target, true);
    if (!ctx) return;

    const object = clone(target);

    // 文字特殊处理，显示下划线
    if (object instanceof fabric.Textbox) {
      object.underline = true;
      object.fill = borderColor;
      object._renderTextDecoration(ctx, "underline");
      object._drawClipPath(ctx, object.clipPath);
      ctx.restore();
      this.canvas.contextTopDirty = true;
      return;
    }
    // 分组特殊处理，显示矩形边框
    if (isCollection(object) || object.isType("ArcText")) {
      object._render = fabric.Rect.prototype._render;
    }

    const { strokeWidth, strokeUniform } = object;

    let { width, height } = object;

    width += strokeUniform ? strokeWidth / object.scaleX : strokeWidth || 0;
    height += strokeUniform ? strokeWidth / object.scaleY : strokeWidth || 0;
    console.log(width, height);

    const totalObjectScaling = object.getTotalObjectScaling();

    const lineWidth = Math.min(
      this.lineWidth,
      width * totalObjectScaling.scaleX,
      height * totalObjectScaling.scaleY
    );

    width -= lineWidth / totalObjectScaling.scaleX;
    height -= lineWidth / totalObjectScaling.scaleY;

    object.set({
      width,
      height,
      stroke: borderColor,
      strokeWidth: lineWidth,
      strokeDashArray: [],
      strokeDashOffset: 0,
      strokeLineCap: "butt",
      strokeLineJoin: "miter",
      strokeMiterLimit: 4
    });

    object._renderPaintInOrder = () => {
      ctx.save();
      const scaling = object.getTotalObjectScaling();
      console.log("scaling", scaling);
      ctx.scale(1 / scaling.scaleX, 1 / scaling.scaleY);
      object._setLineDash(ctx, object.strokeDashArray || []);
      object._setStrokeStyles(ctx, object);
      ctx.stroke();
      ctx.restore();
    };

    object._render(ctx);
    console.log("drawBorderByObject");
    ctx.restore();
    this.canvas.contextTopDirty = true;
  }

  // public initWatch() {
  //   const mainStore = useMainStore();
  //   const { hoveredObject, leavedObject } = storeToRefs(mainStore);
  //   computed(() => {
  //     if (hoveredObject.value)
  //       this.drawBorderByObject(hoveredObject.value as fabric.Object);
  //     else this.clearBorderByObject(leavedObject.value as fabric.Object);
  //   });
  // }

  destroy() {
    console.log("pluginDestroy");
  }
}

export default HoverBorderPlugin;
