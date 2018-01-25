import ZoomPan from "./ZoomPan"
import { Point } from 'interface/index';
import * as _ from "lodash";

export default function( zoomPan: ZoomPan, value: Point ): void {
	zoomPan.deltaPointForMiniMap = _.cloneDeep( value )
}
