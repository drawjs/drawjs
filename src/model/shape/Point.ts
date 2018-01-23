import { Cell } from "model/index"
import { defaultPointRadius } from "store/index"
import * as i from "interface/index"
import * as _ from "lodash"
import { getTransformedPointForContainPoint } from 'shared/index';


export default class Point extends Cell {
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

	constructor( props ) {
		super( props )

		this.color = props.color || this.color
		this.strokeColor = props.strokeColor || this.strokeColor
		this.x = props.x || this.x
		this.y = props.y || this.y
		this.radius = props.radius || this.radius
	}

	public render() {
		const ctx = this.draw.ctx

		ctx.save()

		this.draw.zoomPan.transformCenterPointForContext( {
			x: this.originX,
			y: this.originY
		} )

		ctx.fillStyle = this.color
		ctx.strokeStyle = this.strokeColor
		ctx.fill( this.path )
		!_.isNil( this.strokeColor ) && ctx.stroke( this.path )
		ctx.restore()
	}

	public containPoint( x, y ) {
		const transformedPoint = getTransformedPointForContainPoint( { x, y }, this )
		const isContain = this.draw.ctx.isPointInPath(
			this.path,
			transformedPoint.x,
			transformedPoint.y
		)
		return isContain
	}

	// ******* Drag ******
	public _updateDrag( event ) {
		const zoom = this.draw.zoomPan.zoom

		let newPoint: i.Point = {
			x: event.x - this.draw.canvasLeft,
			y: event.y - this.draw.canvasTop
		}

		newPoint = this.draw.zoomPan.transformPointReversely( newPoint )

		this.x = newPoint.x
		this.y = newPoint.y

		this._updatePrevDraggingPoint( event )
		this.draw.render()
	}
	// ******* Drag ******
}
