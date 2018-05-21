import Cell from '../Cell';
import { notNil } from '../../util/lodash/index';

export default class DomElement extends Cell {
	left: number = 0
	top: number = 0

	dom: HTMLElement

	constructor( props ) {
		super( props )

		this.dom = props.dom
		document.body.appendChild( this.dom )

		this._initializeStyle()

		this.left = notNil( props.left ) ? props.left : this.left
		this.top = notNil( props.top ) ? props.top : this.top
	}

	_initializeStyle() {
		this.dom.style.position = 'fixed'
		this.dom.style.left = '0px'
		this.dom.style.top = '0px'
		this.dom.style.margin = '0px'
		this.dom.style.padding = '0px'
	}

	render() {
		const { left, top } = this
		const { canvasLeft, canvasTop } = this.getters
		const ininital = { x: left, y: top }

		const { x: viewPortLeft, y: viewPortTop } = this.getters.viewPort.transform( ininital )

		this.dom.style.left = `${ canvasLeft + viewPortLeft }px`
		this.dom.style.top = `${ canvasTop + viewPortTop }px`
	}

	translate( dx: number, dy: number ) {
		this.left = this.left + dx
		this.top = this.top + dy
	}

	translateTo( x: number, y: number ) {
		this.left = x
		this.top = y
	}

	remove() {
		this.dom.remove()
		super.remove()
	}

	contain() {
		return false
	}

}
