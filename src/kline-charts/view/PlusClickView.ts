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

import { ActionType } from '../common/Action'
import { type CrosshairDirectionStyle, CrosshairStyle } from '../common/Styles'
import { isString } from '../common/utils/typeChecks'
import type YAxis from '../component/YAxis'
import View from './View'
import { PaneIdConstants, PlusClickInfo } from '../pane/types'
import { MouseTouchEvent } from '../common/SyntheticEvent'

export default class PlusClickView extends View<YAxis> {
  private readonly _boundPlusIconClickEvent = () => (e: MouseTouchEvent) => {
    const widget = this.getWidget()
    const pane = widget.getPane()
    const chartStore = widget.getPane().getChart().getChartStore()
    const crosshair = chartStore.getTooltipStore().getCrosshair()
    const yAxis = pane.getAxisComponent();
    const value = yAxis.convertFromPixel(crosshair.y!)
    let plusClickInfo: PlusClickInfo = {
      isTouch: e.isTouch!,
      pageX: e.pageX,
      pageY: e.pageY,
      x: crosshair.x!,
      y: crosshair.y!,
      price: value,
    };
    chartStore.getActionStore().execute(ActionType.OnPlusClick,plusClickInfo)
    return true
  }
  private readonly _boundPlusIconMouseEnterEvent = () => () => {
    // console.log("PlusClickView:_boundPlusIconMouseEnterEvent>>>")
    const widget = this.getWidget()
    widget.getContainer().style.cursor = 'pointer'
    return true
  }
  private readonly _boundPlusIconMouseLeaveEvent = () => () => {
    // console.log("PlusClickView:_boundPlusIconMouseLeaveEvent>>>")
    const widget = this.getWidget()
    widget.getContainer().style.cursor = 'crosshair'
    return true
  }
  private readonly _boundPlusIconMouseMoveEvent = () => () => {
    // console.log("PlusClickView:_boundPlusIconMouseMoveEvent>>>")
    const widget = this.getWidget()
    widget.getContainer().style.cursor = 'pointer'
    return true
  }

  protected getDirectionStyles (styles: CrosshairStyle): CrosshairDirectionStyle {
    return styles.horizontal
  }
  
  override drawImp (ctx: CanvasRenderingContext2D): void {
    const widget = this.getWidget()
    const pane = widget.getPane()
    const bounding = widget.getBounding()
    const chartStore = widget.getPane().getChart().getChartStore()
    const crosshair = chartStore.getTooltipStore().getCrosshair()
    const styles = chartStore.getStyles().crosshair
    if (isString(crosshair.paneId) && styles.show) {
      if (crosshair.paneId === PaneIdConstants.CANDLE && pane.getId() === PaneIdConstants.CANDLE) {
        let defaultCrossHairStyle: CrosshairDirectionStyle = this.getDirectionStyles(styles);
        const y = crosshair.y!
        this.createFigure({
          name: 'plusClick',
          attrs: { 
            x: bounding.width - 20,
            y: y - 10,
            height: 20,
            width: 20,
           },
          styles: {
            color: defaultCrossHairStyle.text.backgroundColor,
          }
        },{
          mouseMoveEvent: this._boundPlusIconMouseMoveEvent(),
          mouseClickEvent: this._boundPlusIconClickEvent(),
          mouseEnterEvent: this._boundPlusIconMouseEnterEvent(),
          mouseLeaveEvent: this._boundPlusIconMouseLeaveEvent(),
        })?.draw(ctx)
      }
    }
  }
}
