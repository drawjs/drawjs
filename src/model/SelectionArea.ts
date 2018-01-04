import * as _ from 'lodash'

import Geometry from './Geometry'

interface Point {
	x: number,
	y: number,
}

export default class SelectionArea extends Geometry {
	public isDrawing: boolean = false
	public startPoint:Point
	public endPoint:Point

	constructor(
		{
			top = 0,
			left = 0,
		}: {
			top?: number,
			left?: number,
		}
	) {
		super( {
			top,
			left,
		} )
	}

	public render( ctx: CanvasRenderingContext2D ):void {
		if (
			this.isDrawing &&
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
			ctx.fillStyle = 'rgba(37, 145, 293, 0.1)'
			ctx.fill()
			ctx.lineWidth = 1
			ctx.strokeStyle = '#b1b1f3'
			ctx.stroke()
			ctx.restore()
		}
	}
}
