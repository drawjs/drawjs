import * as _ from "lodash"


export default class EventKeyboard {
	static KEYBOARD_KEYS: any = {
		ALT  : "Alt",
		SPACE: " ",
		ENTER: "Enter"
	}

	keyboardKeysPressing = []

	get isAltPressing() {
		const res = _.includes( this.keyboardKeysPressing, EventKeyboard.KEYBOARD_KEYS.ALT )
		return res
	}

	get isSpacePressing() {
		const res = _.includes( this.keyboardKeysPressing, EventKeyboard.KEYBOARD_KEYS.SPACE )
		return res
	}

	get isEnterPressing() {
		const res = _.includes( this.keyboardKeysPressing, EventKeyboard.KEYBOARD_KEYS.ENTER )
		return res
	}

	constructor() {
		window.addEventListener( "keydown", this._keydownListener.bind( this ) )
		window.addEventListener( "keyup", this._keyupListener.bind( this ) )
	}

	_keydownListener( event ) {
		const { key } = event
		this._addToKeyboardKeysPressing( key )

		this.handleKeyDown && this.handleKeyDown( event )
	}
	_keyupListener( event ) {
		const { key } = event
		this._removeFromKeyboardKeysPressing( key )
	}

	_addToKeyboardKeysPressing( key: string ) {
		this.keyboardKeysPressing = _.uniq( [ ...this.keyboardKeysPressing, key ] )
	}

	_removeFromKeyboardKeysPressing( key: string ) {
		this.keyboardKeysPressing = this.keyboardKeysPressing.filter( notKey )

		function notKey( item ) {
			return item !== key
		}
	}

	handleKeyDown( event ) {}
}
