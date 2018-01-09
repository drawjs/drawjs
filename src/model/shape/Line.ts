import * as _ from "lodash"

import Graph from "model/Graph"
import * as cellTypeList from "store/constant_cellTypeList"
import * as interfaces from "interface/index"
import { defaultPathExandingValue } from "store/index"

export default class Line extends Graph {
	public pointStart: interfaces.Point
	public pointEnd: interfaces.Point

	get relativeAngle(): number {
		const deltaX = this.pointEnd.x - this.pointStart.x
		const deltaY = this.pointEnd.y - this.pointStart.y

		const isXZero = deltaX === 0
		const relativeAngle = isXZero
			? Math.PI / 2
			: Math.atan( Math.atan2( deltaY, deltaX ) )
		return relativeAngle
	}

	get length(): number {
		const length = Math.sqrt(
			Math.pow( this.pointEnd.x - this.pointStart.x, 2 ) +
				Math.pow( this.pointEnd.y - this.pointStart.y, 2 )
		)
		return length
	}

	get isXEndBiggerThantStart(): boolean {
		return this.pointEnd.x - this.pointStart.x >= 0
	}

	// get isXEndSmallerThantStart(): boolean {
	// 	return this.pointEnd.x - this.pointStart.x < 0
	// }

	get renderPath(): Path2D {
		const path = new Path2D()

		path.moveTo( this.pointStart.x, this.pointStart.y )
		path.lineTo( this.pointEnd.x, this.pointEnd.y )

		return path
	}

	get renderRangePath(): Path2D {
		const path = new Path2D()
		const leftPoint =
			this.pointStart.x < this.pointEnd.x
				? this.pointStart
				: this.pointEnd
		const rightPoint =
			this.pointStart.x >= this.pointEnd.x
				? this.pointStart
				: this.pointEnd
		const w = defaultPathExandingValue
		const l = this.length
		const alpha = this.relativeAngle
		const sqrt2 = Math.sqrt( 2 )

		const keyTopXLength = Math.abs( sqrt2 * w * Math.cos( alpha + 45 ) )
		const keyTopYLength = Math.abs( sqrt2 * w * Math.sin( alpha + 45 ) )
		const keyBottomXLength = Math.abs( sqrt2 * w * Math.sin( 45 - alpha ) )
		const keyBottomYLength = Math.abs( sqrt2 * w * Math.cos( 45 - alpha ) )

		let x: number
		let y: number

		const pointLeftTop = {
			x: leftPoint.x - keyTopXLength,
			y: leftPoint.y - keyTopYLength
		}

		const pointLeftBottom = {
			x: leftPoint.x - keyTopXLength,
			y: leftPoint.y + keyTopYLength
		}

		const pointRightTop = {
			x: rightPoint.x + keyBottomXLength,
			y: rightPoint.y - keyBottomYLength
		}

		const pointRightBottom = {
			x: rightPoint.x + keyBottomXLength,
			y: rightPoint.y + keyBottomYLength
		}

		const points = [
			pointLeftTop,
			pointRightTop,
			pointRightBottom,
			pointLeftBottom,
			pointLeftTop,
		]

		points.map( connectLine( path ) )

		return path
	}

	constructor( {
		pointStart,
		pointEnd,
		fill = "black",
		draggable = true,
		isSelected = false
	}: {
		pointStart: interfaces.Point
		pointEnd: interfaces.Point
		fill: string
		draggable: boolean
		isSelected: boolean
	} ) {
		super( {
			fill,
			draggable,
			isSelected
		} )

		this.type = cellTypeList.LINE
		this.pointStart = pointStart
		this.pointEnd = pointEnd
	}

	public render( ctx: CanvasRenderingContext2D ) {
		super.render( ctx )

		ctx.save()
		// ctx.rotate((Math.PI / 180) * this.relativeAngle)
		ctx.lineWidth = 1
		ctx.strokeStyle = this.fill
		ctx.stroke( this.renderPath )

		ctx.strokeStyle = "red"
		ctx.stroke( this.renderRangePath )

		ctx.restore()
	}

	public containPoint( x: number, y: number ) {
		// console.log('line', this.draw.ctx.isPointInStroke( this.renderPath, x, y ) )
		// return this.draw.ctx.isPointInStroke( this.renderPath, x, y )
	}
}

function connectLine( path: Path2D ) {
	return ( point: interfaces.Point, pointIndex ) => {
		pointIndex === 0 && path.moveTo( point.x, point.y )
		pointIndex !== 0 && path.lineTo( point.x, point.y )
	}
}
