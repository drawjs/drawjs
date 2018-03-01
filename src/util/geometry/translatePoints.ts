import translate from "./translate";

export default function( points: Point2D[], x: number, y: number ): Point2D[] {
	const res: Point2D[] = points.map( ( point: Point2D ) => translate( point, x, y ) )
	return res
}
