import { generateUniqueId } from '../util/index'


export default class Cell {
	private id: string
	public ctx: CanvasRenderingContext2D
	public draggable: boolean

	constructor(
		{
			canvas
		}:{
			canvas: HTMLCanvasElement
		}
	) {
		this.id = generateUniqueId()

		this.ctx = canvas.getContext( '2d' )

		this.draggable = true
	}

}
