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
		this.onDragStart = onDragStart
		this.onDragging = onDragging
		this.onDragStop = onDragStop
	}
}