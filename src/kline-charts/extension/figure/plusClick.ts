/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type Coordinate from "../../common/Coordinate";
import { type RectStyle, PolygonType, LineType } from "../../common/Styles";
import { isTransparent } from "../../common/utils/color";
import { isString } from "../../common/utils/typeChecks";

import { type FigureTemplate, DEVIATION } from "../../component/Figure";

export function checkCoordinateOnRect(
  coordinate: Coordinate,
  rect: RectAttrs
): boolean {
  let x = rect.x;
  let width = rect.width;
  if (width < DEVIATION * 2) {
    x -= DEVIATION;
    width = DEVIATION * 2;
  }
  let y = rect.y;
  let height = rect.height;
  if (height < DEVIATION * 2) {
    y -= DEVIATION;
    height = DEVIATION * 2;
  }
  if (
    coordinate.x >= x &&
    coordinate.x <= x + width &&
    coordinate.y >= y &&
    coordinate.y <= y + height
  ) {
    return true;
  }
  return false;
}

export function drawPlusClick(
  ctx: CanvasRenderingContext2D,
  attrs: RectAttrs,
  styles: Partial<RectStyle>
): void {
  const { x, y, width: w, height: h } = attrs;
  const {
    style = PolygonType.Fill,
    color = "transparent",
    borderRadius: r = 0,
  } = styles;
  if (
    (style === PolygonType.Fill || styles.style === PolygonType.StrokeFill) &&
    (!isString(color) || !isTransparent(color))
  ) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.fill();
    ctx.closePath();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(x + 10, y + 10, 7, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.moveTo(x + 10 - 4, y + 10);
    ctx.lineTo(x + 10 + 4, y + 10);
    ctx.moveTo(x + 10, y + 10 - 4);
    ctx.lineTo(x + 10, y + 10 + 4);
    ctx.stroke();
    ctx.closePath();
  }
}

export interface RectAttrs {
  x: number;
  y: number;
  width: number;
  height: number;
}

const plusClick: FigureTemplate<RectAttrs, Partial<RectStyle>> = {
  name: "plusClick",
  checkEventOn: checkCoordinateOnRect,
  draw: (
    ctx: CanvasRenderingContext2D,
    attrs: RectAttrs,
    styles: Partial<RectStyle>
  ) => {
    drawPlusClick(ctx, attrs, styles);
  },
};

export default plusClick;
