import { SIZE_POINT } from "../../store/constant_cellTypeList";
import Cell from "../Cell";
import Point from "model/shape/Point";
import * as _ from "lodash";
import { getRotatedPoint } from 'util/index'
import * as i from "interface/index"


export default class SizePoint extends Point {
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

	get rotatedInstanceTopCenterPoint(): i.Point {
		return {
			x: this.instance.height / 2 * Math.sin( this.instance.radianAngle ),
			y: - this.instance.height / 2 * Math.cos( this.instance.radianAngle )
		}
	}

	get rotatedInstanceBottomCenterPoint(): i.Point {
		return {
			x: - this.instance.height / 2 * Math.sin( this.instance.radianAngle ),
			y: this.instance.height / 2 * Math.cos( this.instance.radianAngle )
		}
	}

	get rotatedInstanceLeftCenterPoint(): i.Point {
		return {
			x: - this.instance.width / 2 * Math.cos( this.instance.radianAngle ),
			y: - this.instance.width / 2 * Math.sin( this.instance.radianAngle )
		}
	}

	get rotatedInstanceRightCenterPoint(): i.Point {
		return {
			x: this.instance.width / 2 * Math.cos( this.instance.radianAngle ),
			y: this.instance.width / 2 * Math.sin( this.instance.radianAngle )
		}
	}

	constructor(props) {
		super(props)

		this.type = SIZE_POINT
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
		const transformedPoint = this.getTransformedPointForContainPoint({ x, y })
		res = this.draw.ctx.isPointInPath(this.path, transformedPoint.x, transformedPoint.y)

		return res
	}

	public getTransformedPointForContainPoint(point: i.Point) {
		let res: i.Point = {
			x: point.x - this.x - this.instanceCenterX,
			y: point.y - this.y - this.instanceCenterY
		}

		res = getRotatedPoint(res, -this.instance.angle)

		return res
	}

	public getTransformedPointForSize(point: i.Point, centerPoint?: i.Point) {
		let res: i.Point = {
			x: point.x - this.instanceCenterX,
			y: point.y - this.instanceCenterY
		}

		res = getRotatedPoint(res, -this.instance.angle, centerPoint)

		return res
	}

	public setRotatedPoint(point: i.Point) {
		const rotatedPoint = getRotatedPoint(point, this.instance.angle)

		this.x = rotatedPoint.x
		this.y = rotatedPoint.y
	}
}

export class SizePointTopLeft extends SizePoint {
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

export class SizePointTop extends SizePoint {
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

	public _updateDrag(event) {
		let newPoint: i.Point
		let oldPoint: i.Point
		let transformedNewPoint: i.Point
		let transformedOldPoint: i.Point
		let transformedNewPoint_base_InstanceBottomCenter: i.Point
		let transformedOldPoint_base_InstanceBottomCenter: i.Point
		let newCenterPoint: i.Point
		let deltaHeight: number
		let deltaX: number
		let deltaY: number

		newPoint = {
			x: event.x - this.draw.canvasLeft,
			y: event.y - this.draw.canvasTop
		}
		oldPoint = {
			x: this.rotatedInstanceTopCenterPoint.x + this.instanceCenterX,
			y: this.rotatedInstanceTopCenterPoint.y + this.instanceCenterY
		}

		transformedNewPoint_base_InstanceBottomCenter = this.getTransformedPointForSize(newPoint, this.rotatedInstanceBottomCenterPoint)
		transformedOldPoint_base_InstanceBottomCenter = this.getTransformedPointForSize(oldPoint, this.rotatedInstanceBottomCenterPoint)

		deltaHeight = transformedNewPoint_base_InstanceBottomCenter.y - transformedOldPoint_base_InstanceBottomCenter.y
		deltaX = deltaHeight / 2 * Math.cos(this.instance.radianAngle)

		newCenterPoint = {
			x: deltaHeight / 2 * Math.cos(this.instance.radianAngle),
			y: deltaHeight / 2 * Math.sin(this.instance.radianAngle),
		}

		transformedNewPoint = this.getTransformedPointForSize(newPoint, newCenterPoint)
		transformedOldPoint = this.getTransformedPointForSize(oldPoint)

		deltaY = transformedNewPoint.y - transformedOldPoint.y

		this.instance.height = this.instance.height - deltaHeight
		this.instance.top = this.instance.top - deltaY
		this.instance.left = this.instance.left - deltaX

		this._updatePrevDraggingPoint(event)
		this.draw.render()
	}
}

export class SizePointTopRight extends SizePoint {
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

export class SizePointLeft extends SizePoint {
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

	public _updateDrag(event) {
		let newPoint: i.Point
		let oldPoint: i.Point
		let transformedNewPoint: i.Point
		let transformedOldPoint: i.Point
		let transformedNewPoint_base_InstanceRightCenter: i.Point
		let transformedOldPoint_base_InstanceRightCenter: i.Point
		let newCenterPoint: i.Point
		let deltaWidth: number
		let deltaX: number
		let deltaY: number

		newPoint = {
			x: event.x - this.draw.canvasLeft,
			y: event.y - this.draw.canvasTop
		}
		oldPoint = {
			x: this.rotatedInstanceLeftCenterPoint.x + this.instanceCenterX,
			y: this.rotatedInstanceLeftCenterPoint.y + this.instanceCenterY
		}

		transformedNewPoint_base_InstanceRightCenter = this.getTransformedPointForSize(newPoint, this.rotatedInstanceRightCenterPoint)
		transformedOldPoint_base_InstanceRightCenter = this.getTransformedPointForSize(oldPoint, this.rotatedInstanceRightCenterPoint)

		deltaWidth = transformedNewPoint_base_InstanceRightCenter.x - transformedOldPoint_base_InstanceRightCenter.x
		deltaY = deltaWidth / 2 * Math.sin(this.instance.radianAngle)

		newCenterPoint = {
			x: deltaWidth / 2 * Math.cos(this.instance.radianAngle),
			y: deltaWidth / 2 * Math.sin(this.instance.radianAngle),
		}

		transformedNewPoint = this.getTransformedPointForSize(newPoint, newCenterPoint)
		transformedOldPoint = this.getTransformedPointForSize(oldPoint)

		deltaX = transformedNewPoint.x - transformedOldPoint.x

		this.instance.width = this.instance.width - deltaWidth
		this.instance.left = this.instance.left + deltaX
		this.instance.top = this.instance.top + deltaY

		this._updatePrevDraggingPoint(event)
		this.draw.render()
	}
}

export class SizePointRight extends SizePoint {
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

	public _updateDrag(event) {
		let newPoint: i.Point
		let oldPoint: i.Point
		let transformedNewPoint: i.Point
		let transformedOldPoint: i.Point
		let transformedNewPoint_base_InstanceRightCenter: i.Point
		let transformedOldPoint_base_InstanceRightCenter: i.Point
		let newCenterPoint: i.Point
		let deltaWidth: number
		let deltaX: number
		let deltaY: number

		newPoint = {
			x: event.x - this.draw.canvasLeft,
			y: event.y - this.draw.canvasTop
		}
		oldPoint = {
			x: this.rotatedInstanceRightCenterPoint.x + this.instanceCenterX,
			y: this.rotatedInstanceRightCenterPoint.y + this.instanceCenterY
		}

		transformedNewPoint_base_InstanceRightCenter = this.getTransformedPointForSize(newPoint, this.rotatedInstanceRightCenterPoint)
		transformedOldPoint_base_InstanceRightCenter = this.getTransformedPointForSize(oldPoint, this.rotatedInstanceRightCenterPoint)

		deltaWidth = transformedNewPoint_base_InstanceRightCenter.x - transformedOldPoint_base_InstanceRightCenter.x
		deltaY = deltaWidth / 2 * Math.sin(this.instance.radianAngle)

		newCenterPoint = {
			x: deltaWidth / 2 * Math.cos(this.instance.radianAngle),
			y: deltaWidth / 2 * Math.sin(this.instance.radianAngle),
		}

		transformedNewPoint = this.getTransformedPointForSize(newPoint, newCenterPoint)
		transformedOldPoint = this.getTransformedPointForSize(oldPoint)

		deltaX = transformedNewPoint.x - transformedOldPoint.x - deltaWidth

		this.instance.width = this.instance.width + deltaWidth
		this.instance.left = this.instance.left + deltaX
		this.instance.top = this.instance.top + deltaY

		this._updatePrevDraggingPoint(event)
		this.draw.render()
	}
}

export class SizePointBottomLeft extends SizePoint {
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

export class SizePointBottom extends SizePoint {
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

export class SizePointBottomRight extends SizePoint {
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
