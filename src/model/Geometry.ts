import * as _ from 'lodash'
import { generateUniqueId } from 'util/index'
import Cell from 'model/Cell'

export default class Geometry extends Cell {
	public top: number
	public left: number
	public width: number
	public height: number
	public fill: string
	public angle: number

	public draggable: boolean
	public isSelected: boolean
	public onDragStart: Function
	public onDragging: Function
	public onDragStop: Function

	constructor(
		{
			top = 0,
			left = 0,
			width = 100,
			height = 100,
			fill = 'black',
			angle = 0,
			draggable = false,
			isSelected = false,
			onDragStart,
			onDragging,
			onDragStop,
		}: {
			top: number,
			left: number,
			width: number,
			height: number,
			fill: string,
			angle: number,
			draggable: boolean,
			isSelected: boolean,
			onDragStart: Function,
			onDragging: Function,
			onDragStop: Function,
		}
	) {
		super()
		this.top = top
		this.left = left
		this.fill = fill
		this.width = width
		this.height = height
		this.angle = angle
		this.draggable = draggable
		this.isSelected = isSelected
		this.onDragStart = onDragStart
		this.onDragging = onDragging
		this.onDragStop = onDragStop
	}

	private _renderSelection( ctx: CanvasRenderingContext2D ) {
		ctx.save()
		ctx.rect(this.left, this.top, this.width, this.height)
		ctx.fill()
		ctx.lineWidth = 20
		ctx.strokeStyle = 'pink'
		ctx.stroke()
		ctx.rotate((Math.PI / 180) * this.angle)
		ctx.restore()
	}

	public render( ctx: CanvasRenderingContext2D ) {
		super.render( ctx )

		this.isSelected && this._renderSelection( ctx )
	}
}
