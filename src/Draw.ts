import { Rect } from 'shape/index'
import { dragAndDrop } from 'util/index'
import { DRAW_INSTANCE_NAME } from 'store/constant'

export default class Draw {
	private canvas: HTMLCanvasElement
	private ctx: CanvasRenderingContext2D
	public store: any = []

	constructor( canvas: HTMLCanvasElement ) {
		this.canvas = canvas
		this.ctx = canvas.getContext( '2d' )

		this.addChildrenClass( 'Rect', Rect )

		this.initialize()
	}

	private initialize() {
		this.bindEvents()
	}

	bindEvents() {
		dragAndDrop( this )
	}


	private addChildrenClass( name:string, value: any ) {
		this[ name ] = value
	}

	add( element ) {
		this.store.push( element )
		this.addDrawToElement( element )
	}

	addDrawToElement( element ) {
		element[ DRAW_INSTANCE_NAME ] = this
	}

	clearEntireCanvas() {
		this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height )
	}
	render() {
		this.clearEntireCanvas()

		const renderElement = element => {
			element.render( this.ctx )
		}
		this.store.map( renderElement )
	}
}
