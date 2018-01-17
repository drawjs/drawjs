import * as _ from "lodash"

import * as i from "interface/index"


export default function(
	point: i.Point,
	angle: number,
	centerPoint: i.Point = { x: 0, y: 0 }
) {
	if ( angle === 0 ) {
		return point
	}

	let resPoint: i.Point = _.cloneDeep( point )
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
