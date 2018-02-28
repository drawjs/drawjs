import ZoomPan from './ZoomPan'


export default function ( zoomPan: ZoomPan, key: string, value: any ) {
	zoomPan[ key ] = value
}

export function coupleZoomPanSetPanPoint( zoomPan: ZoomPan, value: Point2D ) {
	zoomPan.panPoint = value
}
