import Path from "../Path"
import { CIRCLE } from "../../store/constant/cellType"
import { notNil } from "../../util/lodash/index"
import getRectPoints from "../../util/getRectPoints"

const { sin, cos, PI } = Math

export default class Circle extends Path {
	type = CIRCLE

	x: number = Circle.DEFAULT_CX
	y: number = Circle.DEFAULT_CY

	radius: number = Circle.DEFAULT_RADIUS

	static DEFAULT_CX = 0
	static DEFAULT_CY = 0
	static DEFAULT_RADIUS = 200

	/**
	 * Override
	 */
	// t = 1

	constructor( props ) {
		super( setPropsPointsDangerously( props ) )

		const { x, y, r } = props

		this.sizable = notNil( props.sizable ) ? props.sizable : this.sizable
		this.rotatable = notNil( props.rotatable ) ?
			props.rotatable :
			this.rotatable

		// this.sharedActions.clearSegmentsHandles( this.segments )
		this.sharedActions.hideSegments( this.segments )


		const { left, right, top, bottom } = this.bounds
		console.log( right - left, bottom - top )

		function setPropsPointsDangerously( props ) {
			const {
				x = Circle.DEFAULT_CX,
				y = Circle.DEFAULT_CY,
				radius: r = Circle.DEFAULT_RADIUS
			} = props

			const distance = 2 * r
			const dx: number = r * cos( PI / 6 )
			const dy: number = r * sin( PI / 6 )

			const left = x - r
			const top = y - r

			const rectPoints = getRectPoints( {
				left,
				top,
				width : distance,
				height: distance
			} )
			const { topCenter, leftBottom, rightBottom, leftCenter, rightCenter, bottomCenter } = rectPoints
			const leftPoint = {
				x: x - dx,
				y: y + dy
			}
			const rightPoint = {
				x: x + dx,
				y: y + dy
			}

			// props.points = [ leftCenter, rightCenter ]
			props.points = getCirclePoints(x, y, r)

			// props.showHandle = true
			props.sizable = false
			props.defaultSegmentHandleLength = r * 0.35726558990816404

			return props

			function getCirclePoints( x, y, r, count: number = 6 ): Point2D[] {
				let points = []
				for ( let i = 0; i < count; i++ ) {
					const radian = ( i * 2 * PI ) / count
					points.push( {
						x: x + r * cos( radian ),
						y: y + r * sin( radian )
					} )
				}
				return points
			}
		}
	}
}
