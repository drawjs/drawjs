import Path from "../Path"
import { RECT } from "../../store/constant/cellType"
import { isNotNil } from "../../util/index"
import getRectPoints from "../../util/getRectPoints"
import { notUndefined, notNil } from "../../util/lodash/index"

export default class Rect extends Path {
	type = RECT

	left: number = Rect.DEFAULT_LEFT
	top: number = Rect.DEFAULT_TOP
	width: number = Rect.DEFAULT_WIDTH
	height: number = Rect.DEFAULT_HEIGHT

	static DEFAULT_LEFT = 0
	static DEFAULT_TOP = 0
	static DEFAULT_WIDTH = 100
	static DEFAULT_HEIGHT = 100

	/**
	 * Override
	 */
	t = 1

	constructor( props ) {
		super( setPropsPointsDangerously( props ) )

		const { x, y, left, top, width, height } = props

		if ( notNil( x ) && notNil( y ) ) {
			this.left = x - width / 2
			this.top = y - height / 2
		} else {
			this.left = notNil( left ) ? left : this.left
			this.top = notNil( top ) ? top : this.top
		}

		this.width = notNil( width ) ? width : this.width
		this.height = notNil( height ) ? height : this.height
		this.sizable = notNil( props.sizable ) ? props.sizable : this.sizable
		this.rotatable = notNil( props.rotatable ) ?
			props.rotatable :
			this.rotatable

		this.sharedActions.clearSegmentsHandles( this.segments )
		this.sharedActions.hideSegmentsHandles( this.segments )
		this.sharedActions.hideSegments( this.segments )

		function setPropsPointsDangerously( props ) {
			let { x, y, left, top, width, height } = props

			width = notUndefined( width ) ? width : Rect.DEFAULT_WIDTH
			height = notUndefined( height ) ? height : Rect.DEFAULT_HEIGHT

			if ( notNil( x ) && notNil( y ) ) {
				left = x - width / 2
				top = y - height / 2
			} else {
				left = notUndefined( left ) ? left : Rect.DEFAULT_LEFT
				top = notUndefined( top ) ? top : Rect.DEFAULT_TOP
			}

			const rectPoints = getRectPoints( { left, top, width, height } )
			const { leftTop, rightTop, rightBottom, leftBottom } = rectPoints
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
