import Cell from "../Cell"
import { notNil } from "../../util/lodash/index"
import getRectPoints from "../../util/getRectPoints"
import connectPolygonPoints from "../../util/canvas/connectPolygonPoints"

export default class DrawImage extends Cell {
	left: number = 0
	top: number = 0
	width: number = DrawImage.DEFAULT_WIDTH
	height: number = DrawImage.DEFAULT_HEIGHT
	img: HTMLImageElement = new Image()
	src: string = ''

	static DEFAULT_WIDTH = 50
	static DEFAULT_HEIGHT = 50

	constructor( props ) {
		super( props )

		const { x, y, left, top } = props

		this.width = notNil( props.width ) ? props.width : this.width
		this.height = notNil( props.height ) ? props.height : this.height

		const { width, height } = this

		if ( notNil( x ) && notNil( y ) ) {
			this.left = x - width / 2
			this.top = y - height / 2
		} else {
			this.left = notNil( left ) ? left : this.left
			this.top = notNil( top ) ? top : this.top
		}

		this.src = notNil( props.src ) ? props.src : this.src

		this.img.src = this.src
		this.img.onload = () => {
			this.render()
		}
	}

	get path2d(): Path2D {
		const { left, top, width, height } = this
		const rectPoints = getRectPoints( {
			left,
			top,
			width,
			height
		} )
		const { leftTop, rightTop, rightBottom, leftBottom } = rectPoints
		const points: Point2D[] = [ leftTop, rightTop, rightBottom, leftBottom ]

		const path: Path2D = connectPolygonPoints( points )
		return path
	}

	contain( x: number, y: number ) {
		const isContain = this.getters.pointOnPath( { x, y }, this.path2d )
		return isContain
	}

	render() {
		const { left, top, width, height, img } = this
		this.getters.ctx.drawImage(
			img,
			left,
			top,
			width,
			height
		)
	}

	updateDrag( event ) {
		if ( this.draggable ) {
			const point: Point2DInitial = this.getters.getInitialPoint( event )

			const dx = this.dragger.getDeltaXToPrevPoint( point )
			const dy = this.dragger.getDeltaYToPrevPoint( point )

			this.translate( dx, dy )
		}
	}

	translate( dx: number, dy: number ) {
		this.left = this.left + dx
		this.top = this.top + dy
	}
}
