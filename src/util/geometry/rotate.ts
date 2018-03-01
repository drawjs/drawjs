import { cloneDeep } from "lodash"

export default function(
	point: Point2D,
	radian: number,
	center: Point2D = { x: 0, y: 0 }
) {
	const { x, y }: Point2D = point
	const { x: xc, y: yc }: Point2D = center

	const relative: Point2D = {
		x: x - xc,
		y: y - yc
	}

	const { x: xr, y: yr }: Point2D = relative

	const rotated: Point2D = {
		x: xr * Math.cos( radian ) - yr * Math.sin( radian ) + xc,
		y: xr * Math.sin( radian ) + yr * Math.cos( radian ) + yc
	}

	return rotated
}
