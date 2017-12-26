import Cell from 'model/cell'
import { dragAndDrop } from 'util/index'

export default class Shape extends Cell {
	constructor(props) {
		super( props )

		this.ctx.fillStyle = 'rgb(200, 0, 0)'
		this.ctx.fillRect(25, 25, 100, 100);

		this.init()
	}
	init() {
		this.draggable && dragAndDrop( this )
	}
}
