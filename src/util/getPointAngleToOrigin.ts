export default function getPointAngleToOrigin( point ): number {
	const { x, y } = point
	const absoluteAngle = Math.atan( Math.abs( y / x ) )

	if ( x === 0 && y === 0 ) {
		return 0
	}

	// first coordinate
	if ( x >= 0 && y >= 0 ) {
		return absoluteAngle + Math.PI / 2
	}

	// second coordinate
	if ( x < 0 && y >= 0 ) {
		return Math.PI - absoluteAngle + Math.PI / 2
	}

	// third coordinate
	if ( x < 0 && y < 0 ) {
		return Math.PI + absoluteAngle + Math.PI / 2
	}

	// fourth coordinate
	if ( x >= 0 && y < 0 ) {
		return - absoluteAngle + Math.PI / 2
	}
}
