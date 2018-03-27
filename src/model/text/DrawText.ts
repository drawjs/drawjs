import Cell from "../Cell"
import { TEXT } from "../../store/constant/cellType"
import { isNotNil } from "../../util/index"
import getRectPoints from "../../util/getRectPoints"
import connectPolygonPoints from "../../util/canvas/connectPolygonPoints"
import TextInput from '../tool/TextInput';

export default class DrawText extends Cell {
	type = TEXT

	left: number = 0
	top: number = 0

	text: string = ""

	fontSize: number =  12


	constructor( props ) {
		super( props )

		this.left = isNotNil( props.left ) ? props.left : this.left
		this.top = isNotNil( props.top ) ? props.top : this.top
		this.text = isNotNil( props.text ) ? props.text : this.text
	}

	get width(): number {
		return this.getters.ctx.measureText( this.text ).width
	}

	get height(): number {
		return this.fontSize
	}

	get path2d(): Path2D {
		const { left, top, width, height } = this
		const newTop: number = top - height
		const rectPoints = getRectPoints( { left, top: newTop, width, height } )
		const { leftTop, rightTop, rightBottom, leftBottom } = rectPoints
		const points: Point2D[] = [ leftTop, rightTop, rightBottom, leftBottom ]

		const path: Path2D = connectPolygonPoints( points )

		return path
	}

	get textInput(): TextInput {
		return this.getters.textInput
	}

	contain( x: number, y: number ) {
		const isContain = this.getters.pointOnPath( { x, y }, this.path2d )
		return isContain
	}

	render() {
		const { ctx } = this.getters
		const { text, left, top, fontSize } = this

		ctx.save()

		ctx.strokeStyle = "#0de2c6"
		ctx.stroke( this.path2d )

		ctx.font = `${ fontSize }px`
		ctx.fillText( text, left, top )

		ctx.restore()
	}

	updateDrag( event ) {
		const point: Point2DInitial = this.getters.getInitialPoint( event )

		const deltaX = this.dragger.getDeltaXToPrevPoint( point )
		const deltaY = this.dragger.getDeltaYToPrevPoint( point )

		this.left = this.left + deltaX
		this.top = this.top + deltaY
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
}
