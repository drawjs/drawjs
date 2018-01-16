import { SCALE_POINT } from "../../store/constant_cellTypeList";
import Cell from "../Cell";
import Point from "model/shape/Point";
import * as _ from "lodash";
import { getRotatedPoint } from 'util/index'
import * as i from "interface/index"


export default class ScalePoint extends Point {
	public instance: any

	get instanceWidth(): number {
		return this.instance.width
	}

	get instanceHeight(): number {
		return this.instance.height
	}

	get instanceCenterX(): number {
		return this.instance.left + this.instance.width / 2
	}

	get instanceCenterY(): number {
		return this.instance.top + this.instance.height / 2
	}

	constructor(props) {
		super(props)

		this.type = SCALE_POINT
		this.color = 'blue'

		this.instance = props.instance
	}

	public render() {
		const ctx = this.draw.ctx

		ctx.save()
		ctx.translate(this.x + this.instanceCenterX, this.y + this.instanceCenterY)
		ctx.fillStyle = this.color
		ctx.strokeStyle = this.strokeColor

		ctx.fill(this.path)
		!_.isNil(this.strokeColor) && ctx.stroke(this.path)

		ctx.restore()
	}

	public containPoint(x, y) {
		let res = false
		const transformedPoint = this.getTransformedPoint({ x, y })
		res = this.draw.ctx.isPointInPath(this.path, transformedPoint.x, transformedPoint.y)

		return res
	}

	public getTransformedPoint(
		{
			x,
			y
		}
			:
			{
				x: number,
				y: number
			}
	) {
		let res: i.Point = {
			x: x - this.x - this.instanceCenterX,
			y: y - this.y - this.instanceCenterY
		}

		res = getRotatedPoint( res, -this.instance.angle )

		return res
	}

	public setRotatedPoint(point: i.Point) {
		const rotatedPoint = getRotatedPoint(point, this.instance.angle)

		this.x = rotatedPoint.x
		this.y = rotatedPoint.y
	}
}

export class ScalePointTopLeft extends ScalePoint {
	constructor(props) {
		super(props)
	}

	public renderByInstance() {
		this.setRotatedPoint({
			x: - this.instanceWidth / 2,
			y: - this.instanceHeight / 2
		})

		this.render()
	}
}

export class ScalePointTop extends ScalePoint {
	constructor(props) {
		super(props)
	}

	public renderByInstance() {
		this.setRotatedPoint({
			x: 0,
			y: - this.instanceHeight / 2,
		})
		this.render()
	}
}

export class ScalePointTopRight extends ScalePoint {
	constructor(props) {
		super(props)
	}

	public renderByInstance() {
		this.setRotatedPoint({
			x: this.instanceWidth / 2,
			y: - this.instanceHeight / 2,
		})
		this.render()
	}
}

export class ScalePointLeft extends ScalePoint {
	constructor(props) {
		super(props)
	}

	public renderByInstance() {
		this.setRotatedPoint({
			x: - this.instanceWidth / 2,
			y: 0,
		})
		this.render()
	}

	public _updateDrag( event ) {
		const eventCanvasPoint = {
			x: event.x - this.draw.canvasLeft,
			y: event.y  - this.draw.canvasTop
		}
		const prevDraggingCanvasPoint = {
			x: this._prevDraggingPoint.x - this.draw.canvasLeft,
			y: this._prevDraggingPoint.y  - this.draw.canvasTop
		}
		const transformedEventPoint = this.getTransformedPoint( eventCanvasPoint )
		const transformedEventPrevDraggingPoint = this.getTransformedPoint( prevDraggingCanvasPoint )

		console.log( transformedEventPrevDraggingPoint )

		const deltaX = transformedEventPoint.x - transformedEventPrevDraggingPoint.x
		this.instance.width = this.instance.width - deltaX
		this.instance.left = this.instance.left + deltaX

		this._updatePrevDraggingPoint(event)
		this.draw.render()
	}
}

export class ScalePointRight extends ScalePoint {
	constructor(props) {
		super(props)
	}

	public renderByInstance() {
		this.setRotatedPoint({
			x: this.instanceWidth / 2,
			y: 0,
		})
		this.render()
	}
}

export class ScalePointBottomLeft extends ScalePoint {
	constructor(props) {
		super(props)
	}

	public renderByInstance() {
		this.setRotatedPoint({
			x: - this.instanceWidth / 2,
			y: this.instanceHeight / 2,
		})
		this.render()
	}
}

export class ScalePointBottom extends ScalePoint {
	constructor(props) {
		super(props)
	}

	public renderByInstance() {
		this.setRotatedPoint({
			x: 0,
			y: this.instanceHeight / 2,
		})
		this.render()
	}
}

export class ScalePointBottomRight extends ScalePoint {
	constructor(props) {
		super(props)
	}

	public renderByInstance() {
		this.setRotatedPoint({
			x: this.instanceWidth / 2,
			y: this.instanceHeight / 2,
		})
		this.render()
	}
}
