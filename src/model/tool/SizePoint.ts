import { SIZE_POINT } from "../../store/constant_cellTypeList";
import Cell from "../Cell";
import Point from "model/shape/Point";
import * as _ from "lodash";
import { getRotatedPoint } from 'util/index'
import * as i from "interface/index"
import Size from 'mixin/Size'
import { coupleSizingCell, coupleSelectCell } from "../../mixin/index";


export default abstract class SizePoint extends Point {
	public instance: any
	public Size: Size
	public isHidden: boolean = false

	abstract size( newPoint: i.Point ): void

	get instanceWidth(): number {
		return this.instance.width
	}

	get instanceHeight(): number {
		return this.instance.height
	}

	get instanceDiagonal(): number {
		return Math.sqrt(
			Math.pow(this.instanceWidth, 2) +
			Math.pow(this.instanceHeight, 2)
		)
	}

	get instanceCenterX(): number {
		return this.instance.left + this.instance.width / 2
	}

	get instanceCenterY(): number {
		return this.instance.top + this.instance.height / 2
	}
	get instanceLeftCenterPoint(): i.Point {
		return {
			x: - this.instanceWidth / 2,
			y: 0
		}
	}
	get instanceRightCenterPoint(): i.Point {
		return {
			x: this.instanceWidth / 2,
			y: 0
		}
	}
	get instanceTopCenterPoint(): i.Point {
		return {
			x: 0,
			y: - this.instanceHeight / 2
		}
	}
	get instanceBottomCenterPoint(): i.Point {
		return {
			x: 0,
			y: this.instanceHeight / 2
		}
	}
	get instanceLeftTopPoint(): i.Point {
		return {
			x: - this.instanceWidth / 2,
			y: - this.instanceHeight / 2
		}
	}
	get instanceRightTopPoint(): i.Point {
		return {
			x: this.instanceWidth / 2,
			y: - this.instanceHeight / 2
		}
	}
	get instanceLeftBottomPoint(): i.Point {
		return {
			x: - this.instanceWidth / 2,
			y: this.instanceHeight / 2
		}
	}
	get instanceRightBottomPoint(): i.Point {
		return {
			x: this.instanceWidth / 2,
			y: this.instanceHeight / 2
		}
	}


	constructor(props) {
		super(props)

		this.type = SIZE_POINT
		this.color = 'blue'

		this.instance = props.instance

		this.Size = new Size({ instance: this.instance })
	}

	public render() {
		if ( this.isHidden ) {
			return
		}

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

	public _hideOtherSizePointsExceptCurrent() {
		const self = this
		this.instance.sizePoints
		.filter( notCurrent )
		.map( hide )

		this.draw.render()

		function notCurrent( sizePoint ) {
			const res = sizePoint !== self
			return res
		}
		function hide( sizePoint ) {
			sizePoint.isHidden = true
		}
	}

	public _showAllSizePoints() {
		this.instance.sizePoints.map( show )

		this.draw.render()

		function show( sizePoint ) {
			sizePoint.isHidden = false
		}
	}

	public handleStartDrag( event ) {
		coupleSizingCell( this.instance, true )
		coupleSelectCell( this.instance, false )
	}

	public _updateDrag(event) {
		if ( ! this.instance.isSizing ) {
			return
		}

		this._hideOtherSizePointsExceptCurrent()

		const newPoint: i.Point = {
			x: event.x - this.draw.canvasLeft,
			y: event.y  - this.draw.canvasTop
		}
		this.size( newPoint )

		this._updatePrevDraggingPoint(event)
		this.draw.render()
	}

	public handleStopDrag( event ) {
		if ( this.instance.isSizing ) {
			this._showAllSizePoints()

			coupleSizingCell( this.instance, false )
			coupleSelectCell( this.instance, true )

			this.draw.render()
		}
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

	public size( newPoint ) {
		this.Size.sizeLeftSide( newPoint )
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

	public size( newPoint ) {
		this.Size.sizeRightSide( newPoint )
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

	public size( newPoint ) {
		this.Size.sizeTopSide( newPoint )
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

	public size( newPoint ) {
		this.Size.sizeBottomSide( newPoint )
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

	public size( newPoint ) {
		this.Size.sizeTopSide( newPoint )
		this.Size.sizeLeftSide( newPoint )
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

	public size( newPoint ) {
		this.Size.sizeTopSide( newPoint )
		this.Size.sizeRightSide( newPoint )
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

	public size( newPoint ) {
		this.Size.sizeBottomSide( newPoint )
		this.Size.sizeLeftSide( newPoint )
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

	public size( newPoint ) {
		this.Size.sizeBottomSide( newPoint )
		this.Size.sizeRightSide( newPoint )
	}
}
