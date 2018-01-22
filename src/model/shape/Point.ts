import { Cell } from "../index"
import { defaultPointRadius } from "../../store/index"
import * as i from "interface/index"
import * as _ from "lodash"


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
		ctx.translate( this.x, this.y )
		ctx.fillStyle = this.color
		ctx.strokeStyle = this.strokeColor
		ctx.fill( this.path )
		!_.isNil( this.strokeColor ) && ctx.stroke( this.path )
		ctx.restore()
	}

	public containPoint( x, y ) {
		let res = false
		const transformedPoint = this.getTransformedPoint( { x, y } )
		res = this.draw.ctx.isPointInPath(
			this.path,
			transformedPoint.x,
			transformedPoint.y
		)
		return res
	}

	public getTransformedPoint( { x, y }: { x: number; y: number } ) {
		const res: i.Point = {
			x: x - this.x,
			y: y - this.y
		}
		return res
	}
}
