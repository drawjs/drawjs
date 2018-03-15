import Particle from "./Particle"
import Handle from "./Handle"
import { HandleType } from "../store/constant/index"
import Cell from "./Cell"
import Path from "./Path"

const { PI } = Math

export default class Segment extends Cell {
	x: number
	y: number

	selected: boolean = false

	shouldShowHandleIn: boolean = false

	shouldShowHandleOut: boolean = false

	handleIn: Handle

	handleOut: Handle

	previous: Segment

	next: Segment

	path: Path

	constructor( props ) {
		super( props )

		this.path = props.path

		this.x = props.x
		this.y = props.y

		this.handleIn = new Handle( {
			draw   : this.draw,
			segment: this,
			type   : HandleType.HANDLE_IN
		} )
		this.handleOut = new Handle( {
			draw   : this.draw,
			segment: this,
			type   : HandleType.HANDLE_OUT
		} )

		this.handleIn.partner = this.handleOut
		this.handleOut.partner = this.handleIn
		this.sharedActions.adjustHandleParterPoint( this.handleIn )
	}

	get point(): Point2D {
		return {
			x: this.x,
			y: this.y
		}
	}

	get path2d(): Path2D {
		const path = new Path2D()
		path.arc( this.x, this.y, 3, 0, PI * 2 )
		return path
	}

	render() {
		const { ctx } = this.getters
		ctx.save()
		ctx.lineWidth = 3
		ctx.fillStyle = "#4a86e8"
		ctx.fill( this.path2d )
		ctx.restore()

		this.handleIn.render()
		this.handleOut.render()
	}

	contain( x: number, y: number ) {
		const isContain = this.getters.pointOnPath( { x, y }, this.path2d )
		return isContain
	}

	updateDrag( event ) {
		const point: Point2DInitial = this.getters.getInitialPoint( event )

		const deltaX = this.dragger.getDeltaXToPrevPoint( point )
		const deltaY = this.dragger.getDeltaYToPrevPoint( point )

		const { x, y } = this.point
		const newX = x + deltaX
		const newY = y + deltaY
		this.sharedActions.updateSegmentX( this, newX )
		this.sharedActions.updateSegmentY( this, newY )

		this.getters.draw.render()
	}
}
