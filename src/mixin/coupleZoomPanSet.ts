import ZoomPan from './ZoomPan'
import { Point } from 'interface/index';


export default function ( zoomPan: ZoomPan, key: string, value: any ) {
	zoomPan[ key ] = value
}

export function coupleZoomPanSetPanPoint( zoomPan: ZoomPan, value: Point ) {
	zoomPan.panPoint = value
}
