export function clonePoint( point: Point2D ) {
	return {
		...point
	}
}

export function clonePoints( points: Point2D[] ) {
	return points.map( point => clonePoint( point ) )
}
