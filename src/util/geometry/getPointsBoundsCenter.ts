const { min, max } = Math

export default function( points: Point2D[] ) {
	const pointsX = points.map( ( { x } ) => x )
	const pointsY = points.map( ( { y } ) => y )

	const left = min( ...pointsX )
	const right = max( ...pointsX )
	const top = min( ...pointsY )
	const bottom = max( ...pointsY )
	const res: Point2D = {
		x: ( left + right ) / 2,
		y: ( top + bottom ) / 2
	}
	return res
}
