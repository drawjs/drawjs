import Draw from "../Draw"


/**
 * | Two ways:
 * |____ 1. General transformation for rendering elements on main canvas
 * |____ 2. Use transformation in mini map for rendering elements on mini map
 */
export default function( draw: Draw, point: Point2D, instance: any, keepRatio: boolean = false ) {
	if ( ! shouldTransformToMiniMap() ) {
		draw.zoomPan.transformCenterPointForContext( point, keepRatio )
	}
	if ( shouldTransformToMiniMap() ) {
		draw.miniMap.transformCenterPointForContext( point )
	}

	function shouldTransformToMiniMap(): boolean {
		const res = draw.miniMap.isRendering && instance.isVisiableInMiniMap === true
		return res
	}
}
