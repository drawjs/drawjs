import Particle from "./Particle"
import Handle from "./Handle"
import { HandleType, DEFAULT_LENGTH } from '../store/constant/index';
import Cell from "./Cell"
import Path from "./Path"
import { isNotNil } from "../util/index"
import { notNil } from '../util/lodash/index';

const { PI } = Math

export default class Segment extends Cell {
	x: number
	y: number

	show: boolean = true

	selected: boolean = false

	shouldShowHandleIn: boolean = false

	shouldShowHandleOut: boolean = false

	handleIn: Handle

	handleOut: Handle

	previous: Segment

	next: Segment

	path: Path

	fillColor: string = "#4a86e8"

	defaultHandleLength: number = DEFAULT_LENGTH

	showHandle: boolean = false

	constructor( props ) {
		super( props )

		this.x = props.x
		this.y = props.y

		this.path = notNil( props.path ) ? props.path : this.path
		this.show = notNil( props.show ) ? props.show : this.show
		this.fillColor = notNil( props.fillColor ) ? props.fillColor : this.fillColor
		this.defaultHandleLength = notNil( props.defaultHandleLength ) ? props.defaultHandleLength : this.defaultHandleLength
		this.showHandle = notNil( props.showHandle ) ? props.showHandle : this.showHandle


		this.handleIn = new Handle( {
			draw   : this.draw,
			segment: this,
			type   : HandleType.HANDLE_IN,
			defaultLength: this.defaultHandleLength,
			show: this.showHandle
		} )
		this.handleOut = new Handle( {
			draw   : this.draw,
			segment: this,
			type   : HandleType.HANDLE_OUT,
			defaultLength: this.defaultHandleLength,
			show: this.showHandle
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
		path.arc( this.x, this.y, 5, 0, PI * 2 )
		return path
	}

	render() {
		if ( this.show ) {
			const { ctx } = this.getters
			ctx.save()
			ctx.lineWidth = 3
			ctx.fillStyle = this.fillColor
			ctx.fill( this.path2d )
			ctx.restore()

			this.handleIn.render()
			this.handleOut.render()
		}

		// this.renerPosition()
	}

	renerPosition() {
		const text = `(${this.x}, ${this.y})`

		const { ctx } = this.getters
		ctx.save()
		ctx.font = `${12}px`
		ctx.fillText( text, this.x, this.y )
		ctx.restore()
	}

	contain( x: number, y: number ) {
		const isContain =
			this.show && this.getters.pointOnPath( { x, y }, this.path2d )
		return isContain
	}

	updateDrag( event, dragger ) {
		if ( this.draggable ) {
			const point: Point2DInitial = this.getters.getInitialPoint( event )

			const dx = dragger.getDeltaXToPrevPoint( point )
			const dy = dragger.getDeltaYToPrevPoint( point )

			this.translate( dx, dy )
		}
	}

	translate( dx: number, dy: number ) {
		this.x = this.x + dx
		this.y = this.y + dy
	}

	translateTo( x: number, y: number ) {
		this.x = x
		this.y = y
	}

	translateToPoint( point: Point2D ) {
		this.x = point.x
		this.y = point.y
	}
}
