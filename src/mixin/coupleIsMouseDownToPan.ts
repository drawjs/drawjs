import ZoomPan from "./ZoomPan"

export default function( zoomPan: ZoomPan, event: any ): boolean {
	return zoomPan.isMouseDownToPan( event )
}
