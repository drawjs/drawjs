import Path from "../Path"
import { RECT } from "../../store/constant/cellType"
import { isNotNil } from "../../util/index"
import getRectPoints from "../../util/getRectPoints"
import { notUndefined } from '../../util/lodash/index';

export default class Rect extends Path {
	type = RECT

	left: number = Rect.DEFAULT_LEFT
	top: number = Rect.DEFAULT_TOP
	width: number = Rect.DEFAULT_WIDTH
	height: number = Rect.DEFAULT_HEIGHT

	static DEFAULT_LEFT= 0
	static DEFAULT_TOP = 0
	static DEFAULT_WIDTH = 100
	static DEFAULT_HEIGHT = 100

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
		this.sizable = isNotNil( props.sizable ) ? props.sizable : this.sizable
		this.rotatable = isNotNil( props.rotatable ) ?
			props.rotatable :
			this.rotatable

		this.sharedActions.clearSegmentsHandles( this.segments )
		this.sharedActions.hideSegmentsHandles( this.segments )
		this.sharedActions.hideSegments( this.segments )

		function setPropsPointsDangerously( props ) {
			const left = notUndefined( props.left ) ? props.left : Rect.DEFAULT_LEFT
			const top = notUndefined( props.top ) ? props.top : Rect.DEFAULT_TOP
			const width = notUndefined( props.width ) ? props.width : Rect.DEFAULT_WIDTH
			const height = notUndefined( props.height ) ? props.height : Rect.DEFAULT_HEIGHT

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
