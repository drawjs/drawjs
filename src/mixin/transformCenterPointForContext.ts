import { Point } from "interface/index"
import Draw from "../Draw"

export default function( draw: Draw, point: Point, instance: any ) {
	if ( ! shouldTransformToMiniMap() ) {
		draw.zoomPan.transformCenterPointForContext( point )
	}
	if ( shouldTransformToMiniMap() ) {
		draw.miniMap.transformCenterPointForContext( point )
	}

	function shouldTransformToMiniMap(): boolean {
		const res = draw.miniMap.isRendering && instance.isVisiableInMiniMap === true
		return res
	}
}
