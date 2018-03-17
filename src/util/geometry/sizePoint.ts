import MathUnitVector from "../../model/math/MathUnitVector"
import MathVector from "../../model/math/MathVector"
import { isNaN } from "lodash"

const { cos, sin, PI, abs } = Math

export default function(
	point: Point2D,
	kP: number,
	kQ: number,
	center: Point2D
) {
	const { x, y }: Point2D = point
	const { x: cx, y: cy }: Point2D = center
	const newPoint: Point2D = {
		x: cx + ( x - cx ) * kP,
		y: cy + ( y - cy ) * kQ
	}

	return newPoint
}
