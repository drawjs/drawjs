import * as _ from 'lodash'

import Geometry from './Geometry'
import * as interfaces  from 'interface/index'



export default class SelectionArea extends Geometry {
	private _draw: any
	public startPoint: interfaces.Point
	public endPoint: interfaces.Point

	constructor(
		{
			top = 0,
			left = 0,
			draw,
		}: {
			top?: number,
			left?: number,
			draw: any,
		}
	) {
		super( {
			top,
			left,
		} )

		this._draw = draw
	}

	public isRectInSelectionArea( { left, top, width, height } ): boolean {
		if (
			! _.isNil( this.startPoint ) &&
			! _.isNil( this.endPoint )
		) {

			const areaLeft = Math.min( this.startPoint.x, this.endPoint.x )
			const areaTop = Math.min( this.startPoint.y, this.endPoint.y )
			const areaWidth = Math.abs( this.endPoint.x - this.startPoint.x )
			const areaHeight = Math.abs( this.endPoint.y - this.startPoint.y )
			return (
				left >= areaLeft &&
				top >= areaTop &&
				left + width <= areaLeft + areaWidth &&
				top + height <= areaTop + areaHeight
			)
		}

		return false
	}


	public startDraw( event ): void {
		this.startPoint = {
			x: event.x,
			y: event.y,
		}
		this._draw.render()
	}

	public drawing( event ): void {
		this.endPoint = {
			x: event.x,
			y: event.y,
		}
		this._draw.render()
	}

	public stopDraw( event ): void {
		this.startPoint = null
		this.endPoint = null
		this._draw.render()
	}


	public render( ctx: CanvasRenderingContext2D ):void {
		if (
			! _.isNil( this.startPoint ) &&
			! _.isNil( this.endPoint )
		) {
			const width = Math.abs( this.endPoint.x - this.startPoint.x )
			const height = Math.abs( this.endPoint.y - this.startPoint.y )
			const left = Math.min( this.startPoint.x, this.endPoint.x )
			const top = Math.min( this.startPoint.y, this.endPoint.y )

			ctx.save()
			ctx.beginPath()
			ctx.rect( left, top, width, height )
			ctx.closePath()
			ctx.fillStyle = 'rgba(37, 145, 293, 0.1)'
			ctx.fill()
			ctx.lineWidth = 1
			ctx.strokeStyle = '#b1b1f3'
			ctx.stroke()
			ctx.restore()
		}
	}

	public containPoint( x, y ) {

	}
}
