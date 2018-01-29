import { getTransformedPointForContainPoint } from "shared/index"
import { isNotNil } from "util/index"

/**
 * Whether the path contain the transformed point ( x, y )
 */
export default function( x: number, y: number, instance: any, path?: Path2D ) {
	path = isNotNil( path ) ? path : instance.path

	const transformedPoint = getTransformedPointForContainPoint(
		{ x, y },
		instance
	)

	const isContain = instance.draw.ctx.isPointInPath(
		path,
		transformedPoint.x,
		transformedPoint.y
	)

	return isContain
}
