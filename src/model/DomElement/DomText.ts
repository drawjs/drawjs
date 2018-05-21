import DomElement from "./DomElement"

export default class DomText extends DomElement {
	text: string

	constructor( props ) {
		super( setPropsDangerously( props ) )

		function setPropsDangerously( props ) {
			props.dom = document.createElement( "p" )
			return props
		}
	}
}
