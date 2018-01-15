export default function getPointAngleToOrigin( point ) {
	const { x, y } = point
	const absoluteAngle = Math.atan( Math.abs( y / x ) )

	// first coordinate
	if ( x >= 0 && y >= 0 ) {
		return absoluteAngle
	}

	// second coordinate
	if ( x < 0 && y >= 0 ) {
		return Math.PI - absoluteAngle
	}

	// third coordinate
	if ( x < 0 && y < 0 ) {
		return 3 * Math.PI / 2 - absoluteAngle
	}

	// fourth coordinate
	if ( x > 0 && y < 0 ) {
		return 2 * Math.PI - absoluteAngle
	}
}
