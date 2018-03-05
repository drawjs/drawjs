import * as _ from "lodash"

enum KeyboardKeys {
	ALT = "Alt",
	SPACE = " "
}

export default class EventKeyboard {
	keyboardKeysPressing = []

	get isAltPressing() {
		const res = _.includes( this.keyboardKeysPressing, KeyboardKeys.ALT )
		return res
	}

	get isSpacePressing() {
		const res = _.includes( this.keyboardKeysPressing, KeyboardKeys.SPACE )
		return res
	}

	constructor() {
		window.addEventListener( "keydown", this._keydownListener.bind( this ) )
		window.addEventListener( "keyup", this._keyupListener.bind( this ) )
	}

	_keydownListener( event ) {
		const { key } = event
		this._addToKeyboardKeysPressing( key )
	}
	_keyupListener( event ) {
		const { key } = event
		this._removeFromKeyboardKeysPressing( key )
	}

	_addToKeyboardKeysPressing( key: KeyboardKeys ) {
		this.keyboardKeysPressing = _.uniq( [ ...this.keyboardKeysPressing, key ] )
	}

	_removeFromKeyboardKeysPressing( key: KeyboardKeys ) {
		this.keyboardKeysPressing = this.keyboardKeysPressing.filter( notKey )

		function notKey( item ) {
			return item !== key
		}
	}


}
