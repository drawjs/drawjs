import * as _ from 'lodash'

import Graph from 'model/Graph'
import * as cellTypeList from 'store/constant_cellTypeList'
import * as interfaces from 'interface/index'


export default class Line extends Graph{
	public points: interfaces.Point[] = []

	get renderPath(): Path2D {
		const self = this
		const path = new Path2D()

		this.points.map( connectLine )

		function connectLine( point: interfaces.Point , pointIndex ) {
			pointIndex === 0 && path.moveTo( point.x, point.y )
			pointIndex !== 0 && path.lineTo( point.x, point.y  )
		}

		return path
	}

	constructor(
		{
			points,
			fill="black",
			angle=0,
			draggable = true,
			isSelected=false,
		}:
		{
			points: interfaces.Point[]
			fill: string,
			angle: number,
			draggable: boolean,
			isSelected: boolean,
		}
	) {
		super( {
			fill,
			angle,
			draggable,
			isSelected,
		} )

		this.type = cellTypeList.LINE
		this.points = points
	}

	public render( ctx: CanvasRenderingContext2D ) {
		super.render( ctx )

		ctx.save()
		// ctx.rotate((Math.PI / 180) * this.angle)
		ctx.lineWidth = 10
		ctx.strokeStyle = this.fill
		ctx.stroke( this.renderPath )

		ctx.restore()


	}

	public containPoint( x: number, y: number ) {
		// console.log( this.draw.ctx.isPointInStroke( this.renderPath, x, y ) )
		// return this.draw.ctx.isPointInStroke( this.renderPath, x, y )
	}
}
