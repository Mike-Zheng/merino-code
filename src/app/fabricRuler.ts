import { Keybinding } from "./keybinding";
import { Disposable } from "@/utils/lifecycle";
import { computed, watchEffect } from "vue";
import { PiBy180, isMobile } from "@/utils/common";
import {
  TAxis,
  Point,
  Rect as fabricRect,
  Object as FabricObject,
  TPointerEventInfo,
  TPointerEvent,
  Color,
  Canvas,
  util
} from "fabric";
import { ElementNames, LinePoint } from "@/types/elements";
import { throttle } from "lodash-es";
import { useMainStore, useTemplatesStore } from "@/store";
import { storeToRefs } from "pinia";
import { FabricCanvas } from "./fabricCanvas";
import { ReferenceLine } from "@/extension/object/ReferenceLine";
import { WorkSpaceDrawType } from "@/configs/canvas";

/**
 * 配置
 */
export interface RulerOptions {
  /**
   * Canvas
   */
  canvas: Canvas;
  /**
   * 标尺宽高
   * @default 10
   */
  ruleSize?: number;

  /**
   * 字体大小
   * @default 10
   */
  fontSize?: number;

  /**
   * 是否开启标尺
   * @default false
   */
  enabled?: boolean;

  /**
   * 背景颜色
   */
  backgroundColor?: string;

  /**
   * 文字颜色
   */
  textColor?: string;

  /**
   * 边框颜色
   */
  borderColor?: string;

  /**
   * 高亮颜色
   */
  highlightColor?: string;
}

export type Rect = { left: number; top: number; width: number; height: number };

export type HighlightRect = {
  skip?: "x" | "y";
} & Rect;

export class FabricRuler extends Disposable {
  protected ctx: CanvasRenderingContext2D;
  // private canvasEvents;
  public lastCursor: string;
  public workSpaceDraw?: fabricRect;

  /**
   * 配置
   */
  public options: Required<RulerOptions>;

  public tempReferenceLine?: ReferenceLine;

  private activeOn: "down" | "up" = "up";

  /**
   * 选取对象矩形坐标
   */
  private objectRect:
    | undefined
    | {
        x: HighlightRect[];
        y: HighlightRect[];
      };

  /**
   * 事件句柄缓存
   */
  private eventHandler: Record<string, (...args: any) => void> = {
    // calcCalibration: this.calcCalibration.bind(this),
    calcObjectRect: throttle(this.calcObjectRect.bind(this), 15),
    clearStatus: this.clearStatus.bind(this),
    mouseDown: this.mouseDown.bind(this),
    mouseMove: throttle(this.mouseMove.bind(this), 15),
    mouseUp: this.mouseUp.bind(this),
    render: (e: any) => {
      // 避免多次渲染
      if (!e.ctx) return;
      this.render();
    }
  };

  constructor(private readonly canvas: FabricCanvas) {
    super();
    this.lastCursor = this.canvas.defaultCursor;
    // 合并默认配置
    this.options = Object.assign({
      ruleSize: 15,
      fontSize: 8,
      enabled: isMobile() ? false : true,
      backgroundColor: "#181818",
      borderColor: "#888",
      highlightColor: "#5586e73b",
      textColor: "#d2d2d2"
    });

    this.ctx = this.canvas.getContext();

    // this.canvasEvents = {
    //   "after:render": this.render.bind(this),
    //   "mouse:move": this.mouseMove.bind(this),
    //   "mouse:down": this.mouseDown.bind(this),
    //   "mouse:up": this.mouseUp.bind(this),
    //   "referenceline:moving": this.referenceLineMoving.bind(this),
    //   "referenceline:mouseup": this.referenceLineMouseup.bind(this)
    // };
    this.enabled = this.options.enabled;
    canvas.ruler = this;
  }

  // 销毁
  public destroy() {
    this.enabled = false;
  }

  public getPointHover(point: Point): "vertical" | "horizontal" | "" {
    if (
      new fabricRect({
        left: 0,
        top: 0,
        width: this.options.ruleSize,
        height: this.canvas.height,
        absolutePositioned: true
      }).containsPoint(point)
    ) {
      return "vertical";
    } else if (
      new fabricRect({
        left: 0,
        top: 0,
        width: this.canvas.width,
        height: this.options.ruleSize,
        absolutePositioned: true
      }).containsPoint(point)
    ) {
      return "horizontal";
    }
    return "";
  }

  private mouseMove(e: TPointerEventInfo<TPointerEvent>) {
    if (!e.pointer) return;
    if (this.tempReferenceLine && e.absolutePointer) {
      const pos: Partial<ReferenceLine> = {};
      if (this.tempReferenceLine.axis === "horizontal") {
        pos.top = e.pointer.y;
      } else {
        pos.left = e.pointer.x;
      }
      this.tempReferenceLine.set({ ...pos, visible: true });
      // this.canvas.renderAll();
      this.canvas.requestRenderAll();
      const event = this.getCommonEventInfo(e) as any;
      this.canvas.fire("object:moving", event);
      this.tempReferenceLine.fire("moving", event);
    }
    const status = this.getPointHover(e.absolutePointer);
    this.canvas.defaultCursor = this.lastCursor;
    if (!status) return;
    this.lastCursor = this.canvas.defaultCursor;
    this.canvas.defaultCursor =
      status === "horizontal" ? "ns-resize" : "ew-resize";
  }

  private mouseDown(e: TPointerEventInfo<TPointerEvent>) {
    const pointHover = this.getPointHover(e.absolutePointer);
    if (!pointHover) return;
    if (this.activeOn === "up") {
      this.canvas.selection = false;
      this.activeOn = "down";
      const point = pointHover === "horizontal" ? e.pointer.y : e.pointer.x;
      this.tempReferenceLine = new ReferenceLine(point, {
        type: "ReferenceLine",
        axis: pointHover,
        visible: false,
        name: "ReferenceLine",
        hasControls: false,
        hasBorders: false,
        stroke: "pink",
        fill: "pink",
        originX: "center",
        originY: "center",
        padding: 4,
        globalCompositeOperation: "difference"
      });
      this.canvas.add(this.tempReferenceLine);
      const templatesStore = useTemplatesStore();
      templatesStore.modifedElement();
      this.canvas.setActiveObject(this.tempReferenceLine);
      this.canvas._setupCurrentTransform(e.e, this.tempReferenceLine, true);
      this.tempReferenceLine.fire("down", this.getCommonEventInfo(e));
    }
  }

  private getCommonEventInfo(e: TPointerEventInfo<TPointerEvent>) {
    if (!this.tempReferenceLine || !e.absolutePointer) return;
    return {
      e: e.e,
      transform: this.tempReferenceLine.get("transform"),
      pointer: {
        x: e.absolutePointer.x,
        y: e.absolutePointer.y
      },
      target: this.tempReferenceLine
    };
  }

  private mouseUp(e: TPointerEventInfo<TPointerEvent>) {
    if (this.activeOn !== "down") return;
    this.canvas.selection = true;
    this.tempReferenceLine!.selectable = false;
    this.canvas.renderAll();
    this.activeOn = "up";
    // @ts-ignore
    this.tempReferenceLine?.fire("up", this.getCommonEventInfo(e));
    this.tempReferenceLine = undefined;
  }

  public setWorkSpaceDraw() {
    this.workSpaceDraw = this.canvas
      .getObjects()
      .filter((item) => item.id === WorkSpaceDrawType)[0] as fabricRect;
  }

  public isRectOut(object: FabricObject, target: ReferenceLine): boolean {
    // const { top, height, left, width } = object;

    // if (top === undefined || height === undefined || left === undefined || width === undefined) {
    //   return false;
    // }

    // const targetRect = target.getBoundingRect(true, true);
    // const {
    //   top: targetTop,
    //   height: targetHeight,
    //   left: targetLeft,
    //   width: targetWidth,
    // } = targetRect;

    // if (target.isHorizontal() && (top > targetTop + 1 || top + height < targetTop + targetHeight - 1)) {
    //   return true;
    // }
    // else if (!target.isHorizontal() && (left > targetLeft + 1 || left + width < targetLeft + targetWidth - 1)) {
    //   return true;
    // }

    return false;
  }

  referenceLineMoving(e: any) {
    if (!this.workSpaceDraw) {
      this.setWorkSpaceDraw();
      return;
    }
    const { target } = e;
    if (this.isRectOut(this.workSpaceDraw, target)) {
      target.moveCursor = "not-allowed";
    }
  }

  referenceLineMouseup(e: any) {
    if (!this.workSpaceDraw) {
      this.setWorkSpaceDraw();
      return;
    }
    const { target } = e;
    if (this.isRectOut(this.workSpaceDraw, target)) {
      this.canvas.remove(target);
      this.canvas.setCursor(this.canvas.defaultCursor ?? "");
    }
  }

  public get enabled() {
    return this.options.enabled;
  }

  public set enabled(value) {
    this.options.enabled = value;
    if (value) {
      // this.canvas.on(this.canvasEvents);
      // 绑定事件
      this.canvas.on("after:render", this.eventHandler.calcObjectRect);
      this.canvas.on("after:render", this.eventHandler.render);
      this.canvas.on("mouse:down", this.eventHandler.mouseDown);
      this.canvas.on("mouse:move", this.eventHandler.mouseMove);
      this.canvas.on("mouse:up", this.eventHandler.mouseUp);
      this.canvas.on("selection:cleared", this.eventHandler.clearStatus);

      this.canvas.on("after:render", this.calcObjectRect.bind(this));
      this.render();
    } else {
      this.canvas.off("after:render", this.eventHandler.calcObjectRect);
      this.canvas.off("after:render", this.eventHandler.render);
      this.canvas.off("mouse:down", this.eventHandler.mouseDown);
      this.canvas.off("mouse:move", this.eventHandler.mouseMove);
      this.canvas.off("mouse:up", this.eventHandler.mouseUp);
      this.canvas.off("selection:cleared", this.eventHandler.clearStatus);

      // this.canvas.off(this.canvasEvents);
      this.canvas.requestRenderAll();
    }
  }

  /**
   * 清除起始点和矩形坐标
   */
  private clearStatus() {
    // this.startCalibration = undefined;
    this.objectRect = undefined;
  }

  /**
   * 获取画板尺寸
   */
  private getSize() {
    return {
      width: this.canvas.width,
      height: this.canvas.height
    };
  }

  private render() {
    const { viewportTransform: vpt } = this.canvas;
    if (!vpt) return;

    // 计算元素矩形
    this.calcObjectRect();

    // 绘制尺子
    this.draw({
      ctx: this.ctx,
      isHorizontal: true,
      rulerLength: this.getSize().width,
      startCalibration: -(vpt[4] / vpt[0])
    });
    this.draw({
      ctx: this.ctx,
      isHorizontal: false,
      rulerLength: this.getSize().height,
      startCalibration: -(vpt[5] / vpt[3])
    });

    const { borderColor, backgroundColor, ruleSize, textColor } = this.options;

    this.darwRect(this.ctx, {
      left: 0,
      top: 0,
      width: ruleSize,
      height: ruleSize,
      fill: backgroundColor,
      stroke: backgroundColor
    });

    this.darwText(this.ctx, {
      text: "",
      left: ruleSize / 2,
      top: ruleSize / 2,
      align: "center",
      baseline: "middle",
      fill: textColor
    });
  }

  private draw(opt: {
    ctx: CanvasRenderingContext2D;
    isHorizontal: boolean;
    rulerLength: number;
    startCalibration: number;
  }) {
    const { ctx, isHorizontal, rulerLength, startCalibration } = opt;
    const zoom = this.canvas.getZoom();

    const gap = this.getGap(zoom);
    const unitLength = Math.ceil(rulerLength / zoom);
    const startValue = Math.floor(startCalibration / gap) * gap;
    const startOffset = startValue - startCalibration;

    const canvasSize = this.getSize();

    const { textColor, borderColor, ruleSize, highlightColor } = this.options;

    // 文字顶部偏移
    const padding = 2.5;

    // 背景
    this.darwRect(this.ctx, {
      left: 0,
      top: 0,
      width: isHorizontal ? canvasSize.width : ruleSize,
      height: isHorizontal ? ruleSize : canvasSize.height,
      fill: this.options.backgroundColor,
      stroke: this.options.backgroundColor
    });

    // 标尺文字显示
    for (let pos = 0; pos + startOffset <= unitLength; pos += gap) {
      const position = (startOffset + pos) * zoom;
      const textValue = (startValue + pos).toString();

      const [left, top, angle] = isHorizontal
        ? [position + 6, padding, 0]
        : [padding, position - 6, -90];

      this.darwText(this.ctx, {
        text: textValue,
        left,
        top,
        fill: textColor,
        angle
      });
    }

    // 标尺蓝色遮罩
    if (this.objectRect) {
      const axis = isHorizontal ? "x" : "y";
      this.objectRect[axis].forEach((rect) => {
        // 跳过指定矩形
        if (rect.skip === axis) {
          return;
        }

        // 获取数字的值
        const roundFactor = (x: number) =>
          Math.round(x / zoom + startCalibration) + "";
        const leftTextVal = roundFactor(isHorizontal ? rect.left : rect.top);
        const rightTextVal = roundFactor(
          isHorizontal ? rect.left + rect.width : rect.top + rect.height
        );

        const isSameText = leftTextVal === rightTextVal;

        // 背景遮罩
        const maskOpt = {
          isHorizontal,
          width: isHorizontal ? 80 : this.options.ruleSize - 0,
          height: isHorizontal ? this.options.ruleSize - 0 : 80,
          backgroundColor: this.options.backgroundColor // "#181818aa"
        };
        this.drawMask(ctx, {
          ...maskOpt,
          left: isHorizontal ? rect.left - 40 : 0,
          top: isHorizontal ? 0 : rect.top - 40
        });
        if (!isSameText) {
          this.drawMask(ctx, {
            ...maskOpt,
            left: isHorizontal ? rect.width + rect.left - 40 : 0,
            top: isHorizontal ? 0 : rect.height + rect.top - 40
          });
        }

        // 高亮遮罩
        // ctx.save()
        this.darwRect(ctx, {
          left: isHorizontal ? rect.left : this.options.ruleSize - 15,
          top: isHorizontal ? this.options.ruleSize - 15 : rect.top,
          width: isHorizontal ? rect.width : 15,
          height: isHorizontal ? 15 : rect.height,
          fill: highlightColor
        });

        // 两边的数字

        const pad = this.options.ruleSize / 2 - this.options.fontSize / 2 - 1;

        const textOpt = {
          fill: "#5586e7",
          angle: isHorizontal ? 0 : -90
        };
        this.darwText(ctx, {
          ...textOpt,
          text: leftTextVal,
          left: isHorizontal ? rect.left - 2 : pad,
          top: isHorizontal ? pad : rect.top - 2,
          align: isSameText ? "center" : isHorizontal ? "right" : "left"
        });

        if (!isSameText) {
          this.darwText(ctx, {
            ...textOpt,
            text: rightTextVal,
            left: isHorizontal ? rect.left + rect.width + 2 : pad,
            top: isHorizontal ? pad : rect.top + rect.height + 2,
            align: isHorizontal ? "left" : "right"
          });
        }

        // 两边的线
        const lineSize = isSameText ? 8 : 14;

        const lineOpt = {
          width: isHorizontal ? 0 : lineSize,
          height: isHorizontal ? lineSize : 0,
          stroke: "#FFF"
        };

        this.darwLine(ctx, {
          ...lineOpt,
          left: isHorizontal ? rect.left : this.options.ruleSize - lineSize,
          top: isHorizontal ? this.options.ruleSize - lineSize : rect.top
        });

        if (!isSameText) {
          this.darwLine(ctx, {
            ...lineOpt,
            left: isHorizontal
              ? rect.left + rect.width
              : this.options.ruleSize - lineSize,
            top: isHorizontal
              ? this.options.ruleSize - lineSize
              : rect.top + rect.height
          });
        }

        // ctx.restore()
      });
    }

    // 标尺刻度线显示
    for (let pos = 0; pos + startOffset <= unitLength; pos += gap) {
      for (let index = 0; index < 10; index++) {
        const position = Math.round(
          (startOffset + pos + (gap * index) / 10) * zoom
        );
        const isMajorLine = index === 0;
        const isMetaLine = index === 5;
        //
        let left, top, width, height;
        if (isHorizontal) {
          if (isMajorLine) {
            top = 0;
          } else if (isMetaLine) {
            top = ruleSize - 8;
          } else {
            top = ruleSize - 6;
          }

          left = position;
          width = 0;
          height = ruleSize - top;
        } else {
          top = position;

          if (isMajorLine) {
            left = 0;
          } else if (isMetaLine) {
            left = ruleSize - 8;
          } else {
            left = ruleSize - 6;
          }

          width = ruleSize - left;
          height = 0;
        }

        this.darwLine(ctx, {
          left,
          top: top,
          width,
          height: height,
          stroke: borderColor
        });
      }
    }

    // draw end
  }

  private getGap(zoom: number) {
    const zooms = [0.02, 0.03, 0.05, 0.1, 0.2, 0.5, 1, 2, 5];
    const gaps = [5000, 2500, 1000, 500, 200, 100, 50, 20, 10];

    let i = 0;
    while (i < zooms.length && zooms[i] < zoom) {
      i++;
    }

    return gaps[i - 1] || 10000;
  }

  private darwRect(
    ctx: CanvasRenderingContext2D,
    {
      left,
      top,
      width,
      height,
      fill,
      stroke,
      strokeWidth
    }: {
      left: number;
      top: number;
      width: number;
      height: number;
      fill?: string | CanvasGradient | CanvasPattern;
      stroke?: string;
      strokeWidth?: number;
    }
  ) {
    ctx.save();
    ctx.beginPath();
    fill && (ctx.fillStyle = fill);
    ctx.rect(left, top, width, height);
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth ?? 1;
      ctx.stroke();
    }
    ctx.restore();
  }

  private drawMask(
    ctx: CanvasRenderingContext2D,
    options: {
      isHorizontal: boolean;
      left: number;
      top: number;
      width: number;
      height: number;
      backgroundColor: string;
    }
  ) {
    ctx.save();
    const { isHorizontal, left, top, width, height, backgroundColor } = options;
    // 创建一个线性渐变对象
    const gradient = isHorizontal
      ? ctx.createLinearGradient(left, height / 2, left + width, height / 2)
      : ctx.createLinearGradient(width / 2, top, width / 2, height + top);
    const transparentColor = new Color(backgroundColor);
    transparentColor.setAlpha(0);
    gradient.addColorStop(0, transparentColor.toRgba());
    gradient.addColorStop(0.33, backgroundColor);
    gradient.addColorStop(0.67, backgroundColor);
    gradient.addColorStop(1, transparentColor.toRgba());
    this.darwRect(ctx, {
      left,
      top,
      width,
      height,
      fill: gradient
    });
    ctx.restore();
  }

  private darwText(
    ctx: CanvasRenderingContext2D,
    {
      left,
      top,
      text,
      fill,
      align,
      angle,
      fontSize,
      baseline
    }: {
      left: number;
      top: number;
      text: string;
      fill?: string | CanvasGradient | CanvasPattern;
      align?: CanvasTextAlign;
      baseline?: CanvasTextBaseline;
      angle?: number;
      fontSize?: number;
    }
  ) {
    ctx.save();
    fill && (ctx.fillStyle = fill);
    ctx.textAlign = align ?? "left";
    ctx.textBaseline = baseline ?? "top";
    ctx.font = `${fontSize ?? 10}px Helvetica`;
    if (angle) {
      ctx.translate(left, top);
      ctx.rotate(PiBy180 * angle);
      ctx.translate(-left, -top);
    }
    ctx.fillText(text, left, top);
    ctx.restore();
  }

  private darwLine(
    ctx: CanvasRenderingContext2D,
    {
      left,
      top,
      width,
      height,
      stroke,
      lineWidth
    }: {
      left: number;
      top: number;
      width: number;
      height: number;
      stroke?: string | CanvasGradient | CanvasPattern;
      lineWidth?: number;
    }
  ) {
    ctx.save();
    ctx.beginPath();
    stroke && (ctx.strokeStyle = stroke);
    ctx.lineWidth = lineWidth ?? 1;
    ctx.moveTo(left, top);
    ctx.lineTo(left + width, top + height);
    ctx.stroke();
    ctx.restore();
  }

  private calcObjectRect() {
    const activeObjects = this.canvas.getActiveObjects();
    if (activeObjects.length === 0) {
      this.objectRect = undefined;
      return;
    }
    // if (activeObjects[0].name.toLowerCase() === ElementNames.REFERENCELINE) {
    //   this.objectRect = undefined;
    //   return;
    // }
    const allRect = activeObjects.reduce((rects, obj) => {
      const rect: HighlightRect = obj.getBoundingRect(false, true);
      // 如果是分组单独计算坐标
      if (obj.group) {
        const group = {
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          scaleX: 1,
          scaleY: 1,
          ...obj.group
        };
        // 计算矩形坐标
        rect.width *= group.scaleX;
        rect.height *= group.scaleY;
        const groupCenterX = group.width / 2 + group.left;
        const objectOffsetFromCenterX =
          (group.width / 2 + (obj.left ?? 0)) * (1 - group.scaleX);
        rect.left +=
          (groupCenterX - objectOffsetFromCenterX) * this.canvas.getZoom();
        const groupCenterY = group.height / 2 + group.top;
        const objectOffsetFromCenterY =
          (group.height / 2 + (obj.top ?? 0)) * (1 - group.scaleY);
        rect.top +=
          (groupCenterY - objectOffsetFromCenterY) * this.canvas.getZoom();
      }
      if (obj instanceof ReferenceLine) {
        rect.skip = obj.isHorizontal() ? "x" : "y";
      }
      rects.push(rect);
      return rects;
    }, [] as HighlightRect[]);
    if (allRect.length === 0) return;
    this.objectRect = {
      x: this.mergeLines(allRect, true),
      y: this.mergeLines(allRect, false)
    };
  }

  private mergeLines(rect: Rect[], isHorizontal: boolean) {
    const axis = isHorizontal ? "left" : "top";
    const length = isHorizontal ? "width" : "height";
    // 先按照 axis 的大小排序
    rect.sort((a, b) => a[axis] - b[axis]);
    const mergedLines = [];
    let currentLine = Object.assign({}, rect[0]);
    for (let i = 1; i < rect.length; i++) {
      const line = Object.assign({}, rect[i]);
      if (currentLine[axis] + currentLine[length] >= line[axis]) {
        // 当前线段和下一个线段相交，合并宽度
        currentLine[length] =
          Math.max(
            currentLine[axis] + currentLine[length],
            line[axis] + line[length]
          ) - currentLine[axis];
      } else {
        // 当前线段和下一个线段不相交，将当前线段加入结果数组中，并更新当前线段为下一个线段
        mergedLines.push(currentLine);
        currentLine = Object.assign({}, line);
      }
    }
    // 加入数组
    mergedLines.push(currentLine);
    return mergedLines;
  }

  public dispose(): void {
    super.dispose();
    this.enabled = false;
  }
}
