import Cell from './Cell';
import SizeContainer from 'model/tool/SizeContainer';

export default abstract class Item extends Cell {
	sizeContainer: SizeContainer

	constructor( props ) {
		super( props )

		this.sizeContainer = new SizeContainer( {
			draw: this.draw,
			target: this
		} )
	}

	get initialBounds(): Bounds {
		return {
			left: 0,
			right: 0,
			top: 0,
			bottom: 0,
		}
	}

	get initialBoundsCenter(): Point2D {
		const res: Point2D = this.sharedGetters.getBoundsCenter( this.initialBounds )
		return res
	}

}
