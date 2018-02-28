import * as _ from "lodash"

export default function(
	point: Point2D,
	angle: number,
	centerPoint: Point2D = { x: 0, y: 0 }
) {
	if ( angle === 0 ) {
		return point
	}

	let resPoint: Point2D = _.cloneDeep( point )
	const alpha = angle * Math.PI / 180

	const relativePoint = {
		x: resPoint.x - centerPoint.x,
		y: resPoint.y - centerPoint.y
	}

	resPoint = {
		x:
			relativePoint.x * Math.cos( alpha ) -
			relativePoint.y * Math.sin( alpha ) +
			centerPoint.x,
		y:
			relativePoint.x * Math.sin( alpha ) +
			relativePoint.y * Math.cos( alpha ) +
			centerPoint.y
	}

	return resPoint
}
