const { sqrt, pow } = Math

export default function ( point: Point2D ) {
	const { x, y }: Point2D = point
	return sqrt(
		pow( x, 2 ) +
		pow( y, 2 )
	)
}

