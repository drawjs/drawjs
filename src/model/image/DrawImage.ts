import Cell from "../Cell"
import { notNil, isNil } from "../../util/lodash/index"
import getRectPoints from "../../util/getRectPoints"
import connectPolygonPoints from "../../util/canvas/connectPolygonPoints"
import { EXPORTABLE } from "../../store/constant/name"
import getCenterPoint from "../../util/geometry/basic/getCenterPoint"
import { Right } from "../tool/SizePoint"

export default class DrawImage extends Cell {
	left: number = 0
	top: number = 0
	width: number = null
	height: number = null
	image: HTMLImageElement = new Image()
	src: string = ""

	strokeColor: string = null

	static DEFAULT_WIDTH = 0
	static DEFAULT_HEIGHT = 0

	interfaceOnImageLoaded: Function
	constructor( props ) {
		super( props )

		// this.width = notNil(props.width) ? props.width : this.width
		// this.height = notNil(props.height) ? props.height : this.height

		this.src = notNil( props.src ) ? props.src : this.src
		this.strokeColor = notNil( props.strokeColor ) ? props.strokeColor : this.strokeColor


		this.image.src = this.src
		this.image.onload = () => {
			const { width: propsWidth, height: propsHeight } = props
			const { width: imageWidth, height: imageHeight } = this.image

			if ( notNil( propsWidth ) && notNil( propsHeight ) ) {
				this.updateWidth( propsWidth )
				this.updateHeight( propsHeight )
			}

			if ( notNil( propsWidth ) && isNil( propsHeight ) ) {
				this.updateWidth( propsWidth )
				const height = ( imageHeight / imageWidth ) * propsWidth
				this.updateHeight( height )
			}

			if ( notNil( propsHeight ) && isNil( propsWidth ) ) {
				this.updateHeight( propsHeight )
				const width = ( imageWidth / imageHeight ) * propsHeight
				this.updateWidth( width )
			}

			if ( isNil( propsWidth ) && isNil( propsHeight ) ) {
				this.updateWidth( imageWidth )
				this.updateHeight( imageHeight )
			}

			const { width, height } = this

			const { x, y, left, top } = props

			if ( notNil( x ) && notNil( y ) ) {
				this.left = x - width / 2
				this.top = y - height / 2
			} else {
				this.left = notNil( left ) ? left : this.left
				this.top = notNil( top ) ? top : this.top
			}


			this.render()

			this.interfaceOnImageLoaded && this.interfaceOnImageLoaded()
		}
	}

	get path2d(): Path2D {
		const { left, top, width, height } = this
		const rectPoints = getRectPoints( {
			left,
			top,
			width,
			height
		} )
		const { leftTop, rightTop, rightBottom, leftBottom } = rectPoints
		const points: Point2D[] = [ leftTop, rightTop, rightBottom, leftBottom ]

		const path: Path2D = connectPolygonPoints( points )
		return path
	}

	get bounds(): Bounds {
		const { left, top, width, height } = this
		return {
			left,
			top,
			right : left + width,
			bottom: top + height
		}
	}

	get center(): Point2D {
		const { left, top, bottom, right } = this.bounds
		return getCenterPoint( { x: left, y: top }, { x: right, y: bottom } )
	}

	contain( x: number, y: number ) {
		const isContain = this.getters.pointOnPath( { x, y }, this.path2d )
		return isContain
	}

	render() {
		const {
			left,
			top,
			width,
			height,
			image,
			getters,
			strokeColor,
			strokeWidth,
			show
		} = this
		console.log( show )
		if ( show && notNil( width ) && notNil( height ) ) {
			const { ctx } = getters

			if ( notNil( strokeColor ) ) {
				ctx.lineWidth = strokeWidth
				ctx.strokeStyle = strokeColor
				ctx.stroke( this.path2d )
			}

			ctx.drawImage( image, left, top, width, height )
		}
	}

	updateDrag( event ) {
		if ( this.draggable ) {
			const point: Point2DInitial = this.getters.getInitialPoint( event )

			const dx = this.dragger.getDeltaXToPrevPoint( point )
			const dy = this.dragger.getDeltaYToPrevPoint( point )

			this.translate( dx, dy )
		}
	}

	translate( dx: number, dy: number ) {
		this.left = this.left + dx
		this.top = this.top + dy
	}

	updateWidth( width: number ) {
		this.width = width
	}

	updateHeight( height: number ) {
		this.height = height
	}

	updateLeft( left: number ) {
		this.left = left
	}

	updateTop( top: number ) {
		this.top = top
	}

	udpateSrc( src: string ) {
		this.src = src
		this.image.src = src
	}

	sizeOnCenter( rateX: number, rateY: number ) {
		const { left, top, width, height } = this
		this.width = width * rateX
		this.height = height * rateY
		this.left = left - ( ( rateX - 1 ) * width ) / 2
		this.top = top - ( ( rateY - 1 ) * height ) / 2
	}
}
