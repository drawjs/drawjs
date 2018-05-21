import Cell from "../Cell"
import { TEXT } from "../../store/constant/cellType"
import { isNotNil } from "../../util/index"
import getRectPoints from "../../util/getRectPoints"
import connectPolygonPoints from "../../util/canvas/connectPolygonPoints"
import TextInput from "../tool/TextInput"

export default class DrawText extends Cell {
	type = TEXT

	x: number = 0
	y: number = 0

	text: string = ""

	fontSize: number = 12

	constructor( props ) {
		super( props )

		this.x = isNotNil( props.x ) ? props.x : this.x
		this.y = isNotNil( props.y ) ? props.y : this.y
		this.text = isNotNil( props.text ) ? props.text : this.text
	}

	get width(): number {
		return this.getters.ctx.measureText( this.text ).width
	}

	get height(): number {
		return this.fontSize
	}

	get path2d(): Path2D {
		const { x, y, width, height } = this
		const newTop: number = y - height
		const rectPoints = getRectPoints( {
			left: x - width / 2,
			top : newTop,
			width,
			height
		} )
		const { leftTop, rightTop, rightBottom, leftBottom } = rectPoints
		const points: Point2D[] = [ leftTop, rightTop, rightBottom, leftBottom ]

		const path: Path2D = connectPolygonPoints( points )

		return path
	}

	get textInput(): TextInput {
		return this.getters.textInput
	}

	contain( x: number, y: number ) {
		const isContain =
			this.show && this.getters.pointOnPath( { x, y }, this.path2d )
		return isContain
	}

	render() {
		if ( this.show ) {
			const { ctx } = this.getters
			const { text, x, y, fontSize } = this

			ctx.save()

			ctx.textAlign = "center"
			ctx.strokeStyle = "#0de2c6"
			// ctx.stroke( this.path2d )

			ctx.fillStyle = this.fillColor
			ctx.font = `${fontSize}px`
			ctx.fillText( text, x, y )

			ctx.restore()
		}
	}

	updateDrag( event ) {
		if ( this.draggable ) {
			const point: Point2DInitial = this.getters.getInitialPoint( event )

			const dx = this.dragger.getDeltaXToPrevPoint( point )
			const dy = this.dragger.getDeltaYToPrevPoint( point )

			this.translate( dx, dy )
		}
	}

	handleDoubleClick( event ) {
		const { x, y } = event

		const left: number = x
		const top: number = y

		this.getters.textInput.target = this
		this.getters.textInput.updateProp( {
			left,
			top,
			text: this.text
		} )
		this.getters.textInput.show()
		this.getters.textInput.focus()
	}

	translate( dx: number, dy: number ) {
		this.x = this.x + dx
		this.y = this.y + dy
	}
}
