import * as _ from "lodash"

enum KeyboardKeys {
	ALT = 'Alt',
	SPACE = ' ',
}

export default class EventKeyboard {
	public keyboardKeysPressing = [

	]

	constructor() {
		this.bindKeyboardEvents()
	}

	public bindKeyboardEvents() {
		window.addEventListener( "keydown", this._keydownListener.bind( this ) )
		window.addEventListener( "keyup", this._keyupListener.bind( this ) )
	}

	public _keydownListener( event ) {
		const { key } = event
		this._addToKeyboardKeysPressing( key )
	}
	public _keyupListener( event ) {
		const { key } = event
		this._removeFromKeyboardKeysPressing( key )
	}

	public _addToKeyboardKeysPressing( key: KeyboardKeys ) {
		this.keyboardKeysPressing = _.uniq(
			[
				...this.keyboardKeysPressing,
				key
			]
		)
	}

	public _removeFromKeyboardKeysPressing( key: KeyboardKeys ) {
		this.keyboardKeysPressing = this.keyboardKeysPressing.filter( notKey )

		function notKey( item ) {
			 return item !== key
		}
	}

	public isAltPressing() {
		const res = _.includes( this.keyboardKeysPressing, KeyboardKeys.ALT )
		return res
	}

	public isSpacePressing() {
		const res = _.includes( this.keyboardKeysPressing, KeyboardKeys.SPACE )
		return res
	}
}
