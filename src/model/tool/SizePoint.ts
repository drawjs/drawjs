import Cell from "../Cell";

export default class SizePoint extends Cell {
	sizingPoint: Point2D

	constructor( props ) {
		super( props )

		this.sizingPoint = props.sizingPoint
	}

	get path2d(): Path2D {
		return
	}

	render() {
		const { ctx } = this.getters

		ctx.save()
		ctx.fillStyle = "blue"
		ctx.fill( this.path2d )
		ctx.restore()
	}

	contain( x: number, y: number ) {
		const isContain = this.getters.pointOnPath( { x, y }, this.path2d )
		return isContain
	}

	updateDrag( event ) {
		const point: Point2DInitial = this.getters.getInitialPoint( event )

		const deltaX = this.dragger.getDeltaXToPrevPoint( point )
		const deltaY = this.dragger.getDeltaYToPrevPoint( point )

		this.sharedActions.translatePoint( this.sizingPoint, deltaX, deltaY )

		this.getters.draw.render()
	}
}
