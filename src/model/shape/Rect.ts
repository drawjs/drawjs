import Path from "../Path"
import { RECT } from "store/constant/cellType"
import { isNotNil } from "util/index"

export default class Polygon extends Path {
	type = RECT

	left: number = 0
	top: number = 0
	width: number = 0
	height: number = 0

	/**
	 * Override
	 */
	t = 1

	constructor( props ) {
		super( setPropsPointsDangerously( props ) )

		this.left = isNotNil( props.left ) ? props.left : this.left
		this.top = isNotNil( props.top ) ? props.top : this.top
		this.width = isNotNil( props.width ) ? props.width : this.width
		this.height = isNotNil( props.height ) ? props.height : this.height

		this.sharedActions.clearSegmentsHandles( this.segments )
		this.sharedActions.hideSegmentsHandles( this.segments )
		this.sharedActions.hideSegments( this.segments )



		function setPropsPointsDangerously( props ) {
			const { left, top, width, height } = props
			const right: number = left + width
			const bottom: number = top + height
			const leftTop: Point2D = {
				x: left,
				y: top
			}

			const rightTop: Point2D = {
				x: right,
				y: top
			}

			const rightBottom: Point2D = {
				x: right,
				y: bottom
			}

			const leftBottom: Point2D = {
				x: left,
				y: bottom
			}

			const points: Point2D[] = [
				leftTop,
				rightTop,
				rightBottom,
				leftBottom
			]

			props.points = points

			return props
		}
	}
}
