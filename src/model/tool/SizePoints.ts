import SizeContainer from "./SizeContainer"
import Particle from "../Particle"
import Cell from "../Cell"
import Item from "../Item"
import SizePoint from "./SizePoint";

export default class SizePoints extends Particle {
	sizeContainer: SizeContainer

	leftTop: SizePoint
	top: SizePoint
	rightTop: SizePoint
	left: SizePoint
	right: SizePoint
	leftBottom: SizePoint
	bottom: SizePoint
	rightBottom: SizePoint

	constructor( props ) {
		super( props )

		this.sizeContainer = props.sizeContainer

		this.leftTop = new SizePoint( {
			draw : this.draw,
			sizingPoint: this.leftTopPoint
		} )
		this.top = new SizePoint( { draw: this.draw, sizingPoint: this.topPoint } )
		this.rightTop = new SizePoint( {
			draw : this.draw,
			sizingPoint: this.rightTopPoint
		} )
		this.left = new SizePoint( { draw: this.draw, sizingPoint: this.leftPoint } )
		this.right = new SizePoint( { draw: this.draw, sizingPoint: this.rightPoint } )
		this.leftBottom = new SizePoint( {
			draw : this.draw,
			sizingPoint: this.leftBottomPoint
		} )
		this.bottom = new SizePoint( {
			draw : this.draw,
			sizingPoint: this.bottomPoint
		} )
		this.rightBottom = new SizePoint( {
			draw : this.draw,
			sizingPoint: this.rightBottomPoint
		} )
	}

	get target(): Item {
		return this.sizeContainer.target
	}

	get container(): Container {
		return this.sizeContainer.container
	}

	get leftTopPoint(): Point2D {
		return this.container.leftTop
	}

	get rightTopPoint(): Point2D {
		return this.container.rightTop
	}

	get rightBottomPoint(): Point2D {
		return this.container.rightBottom
	}

	get leftBottomPoint(): Point2D {
		return this.container.leftBottom
	}

	get topPoint(): Point2D {
		const { x: x1, y: y1 } = this.leftTopPoint
		const { x: x2, y: y2 } = this.rightTopPoint
		return {
			x: ( x1 + x2 ) / 2,
			y: ( y1 + y2 ) / 2
		}
	}

	get leftPoint(): Point2D {
		const { x: x1, y: y1 } = this.leftTopPoint
		const { x: x2, y: y2 } = this.leftBottomPoint
		return {
			x: ( x1 + x2 ) / 2,
			y: ( y1 + y2 ) / 2
		}
	}

	get rightPoint(): Point2D {
		const { x: x1, y: y1 } = this.rightTopPoint
		const { x: x2, y: y2 } = this.rightBottomPoint
		return {
			x: ( x1 + x2 ) / 2,
			y: ( y1 + y2 ) / 2
		}
	}

	get bottomPoint(): Point2D {
		const { x: x1, y: y1 } = this.leftBottomPoint
		const { x: x2, y: y2 } = this.rightBottomPoint
		return {
			x: ( x1 + x2 ) / 2,
			y: ( y1 + y2 ) / 2
		}
	}

	get sizePoints(): SizePoint[] {
		return [
			this.leftTop,
			this.top,
			this.rightTop,
			this.left,
			this.right,
			this.leftBottom,
			this.bottom,
			this.rightBottom
		]
	}

	render() {
		this.sizePoints.map( this.sharedActions.renderParticle )
	}
}

