import rotate from "./rotate"

export default function( points: Point2D[], radian: number, center: Point2D = { x: 0, y: 0 } ): Point2D[] {
	const res: Point2D[] = points.map( ( point: Point2D ) => rotate( point, radian, center ) )
	return res
}
