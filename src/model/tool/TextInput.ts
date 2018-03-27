import { isNotNil } from "../../util/index"
import Particle from "../Particle"
import DrawText from "../text/DrawText"

export default class TextInput extends Particle {
	input: HTMLInputElement = document.createElement( "input" )
	target: DrawText


	constructor( props ) {
		super( props )

		this.input.type = "text"
		this.input.style.position = "fixed"
		this.input.style.zIndex = "100000000000000"

		this.hide()
	}

	get value(): string {
		return this.input.value
	}

	get isShowing(): boolean{
		return this.input.style.display !== "none"
	}

	bindEvents() {
		const self = this
		const { input } = this

		input.removeEventListener( "blur", onBlurListener )
		input.addEventListener( "blur", onBlurListener )

		function onBlurListener() {
			self.handleBlur && self.handleBlur()
			self.hideSelfAndUpdateTarget()
		}
	}

	handleBlur() {}

	hide() {
		this.input.style.display = "none"
	}

	show() {
		this.input.style.display = "inline-block"
	}

	focus() {
		this.input.focus()
	}

	updateProp( { left, top, text } ) {
		const { input } = this
		if ( isNotNil( left ) ) {
			input.style.left = `${left}px`
		}

		if ( isNotNil( top ) ) {
			input.style.top = `${top}px`
		}

		if ( isNotNil( text ) ) {
			input.value = text
		}
	}

	hideSelfAndUpdateTarget() {
		const { target, value } = this
		this.hide()

		if ( isNotNil( target ) ) {
			this.sharedActions.updateTheTextOfDrawText( target, value )
			this.draw.render()
		}
	}
}
