import * as _ from 'lodash'

import { generateUniqueId } from 'util/index'
import Cell from 'model/Cell'


export default abstract class Geometry extends Cell {
	public top: number
	public left: number
	public width: number
	public height: number
	public fill: string

	public draggable: boolean

	constructor( props ) {
		super( props )

		const {
			top = 0,
			left = 0,
			width = 100,
			height = 100,
			fill = 'black',
			angle = 0,
			draggable = false,
		}: {
			top: number,
			left: number,
			width?: number,
			height?: number,
			fill?: string,
			angle?: number,
			draggable?: boolean,
		} = props

		const self = this

		this.top = top
		this.left = left
		this.fill = fill
		this.width = width
		this.height = height
		this.angle = angle
		this.draggable = draggable
	}



	public render() {
		super.render()
	}

	public abstract contain( x: number, y: number ): void
}
