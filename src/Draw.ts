import { Rect } from 'shape/index'


export default class Draw {
	private canvas: HTMLCanvasElement
	private ctx: CanvasRenderingContext2D
	public store: any = []

	constructor( canvas: HTMLCanvasElement ) {
		this.canvas = canvas
		this.ctx = canvas.getContext( '2d' )

		this.addChildrenClass( 'Rect', Rect )
	}

	private addChildrenClass( name:string, value: any ) {
		this[ name ] = value
	}

	add( element ) {
		this.store.push( element )
	}

	clearEntireCanvas() {
		this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height )
	}
	render() {
		this.clearEntireCanvas()

		const renderElement = element => {
			element.render( this.ctx )
			this.ctx.save()
		}
		this.store.map( renderElement )
	}
}
