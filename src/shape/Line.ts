import Graph from 'model/Graph'
import * as cellTypeList from 'store/constant_cellTypeList'
import * as interfaces from 'interface/index'


export default class Line extends Graph{
	public points: interfaces.Point[] = []

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
		ctx.rotate((Math.PI / 180) * this.angle)
		ctx.beginPath()

		this.points.map( connectLine )

		ctx.strokeStyle = this.fill
		ctx.stroke()
		ctx.restore()

		function connectLine( point: interfaces.Point , pointIndex ) {
			pointIndex === 0 && ctx.moveTo( point.x, point.y )
			pointIndex !== 0 && ctx.lineTo( point.x, point.y  )
		}
	}

	public containPoint( x: number, y: number ) {

	}
}
