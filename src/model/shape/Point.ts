import { Cell } from "model/index"
import { defaultPointRadius } from "store/index"
import * as _ from "lodash"
import { getTransformedPointForContainPoint, isInstancePathContainPointTransformed } from 'shared/index';
import { transformCenterPointForContext } from "mixin/index"
import { POINT } from 'store/constant/cellType';
import { log } from 'util/index';
import getters from "../../store/draw/getters";

export default class Point extends Cell {
	public type: string = POINT
	public color: string = "black"
	public strokeColor: string
	public x: number
	public y: number
	public radius: number

	get path(): Path2D {
		const path = new Path2D()
		path.arc( 0, 0, defaultPointRadius, 0, 2 * Math.PI )
		return path
	}

	get originX(): number {
		return this.x
	}

	get originY(): number {
		return this.y
	}

	get left(): number {
		return this.x
	}

	get top(): number {
		return this.y
	}

	constructor( props ) {
		super( props )

		this.color = props.color || this.color
		this.strokeColor = props.strokeColor || this.strokeColor
		this.x = props.x || this.x
		this.y = props.y || this.y
		this.radius = props.radius || this.radius
	}

	public render() {
		const ctx = getters.ctx

		ctx.save()

		transformCenterPointForContext(
			this.draw,
			{
				x: this.originX,
				y: this.originY
			},
			this
		)

		ctx.fillStyle = this.color
		ctx.strokeStyle = this.strokeColor
		ctx.fill( this.path )
		!_.isNil( this.strokeColor ) && ctx.stroke( this.path )
		ctx.restore()
	}

	public contain( x, y ) {
		// const res = isInstancePathContainPointTransformed( x, y, this )

		const isContain = getters.ctx.isPointInPath(
			this.path,
			x,
			y
		)

		return isContain
	}

	// ******* Drag ******
	public updateDrag( event ) {
		const zoom = this.draw.zoomPan.zoom

		let newPoint: Point2D = {
			x: event.x - getters.canvasLeft,
			y: event.y - getters.canvasTop
		}

		newPoint = this.draw.zoomPan.transformPointReversely( newPoint )

		this.x = newPoint.x
		this.y = newPoint.y

		this.draw.render()
	}
	// ******* Drag ******
}
