import * as _ from "lodash"
import storeElementFields from "store/storeElementFields"
import { isNotNil } from "util/index"

export default function( drawStore: DrawStore ): DrawStore {
	const store = _.cloneDeep( drawStore )

	store.panels.map( resolvePanel )

	function resolvePanel( panel, panelIndex ) {
		panel.elements.map( resolveElement( panelIndex ) )
	}
	function resolveElement( panelIndex ) {
		return ( element, elementIndex ) => {
			const { __instance__ } = element
			if ( isNotNil( __instance__ ) ) {
				const instanceFields = Object.keys( __instance__ )
				const intersectionFields = _.intersection(
					instanceFields,
					storeElementFields
				)
				intersectionFields.map( setField( panelIndex, elementIndex ) )
			}
		}
	}
	function setField( panelIndex, elementIndex ) {
		return field => {
			store.panels[ panelIndex ][ "elements" ][ elementIndex ][ field ] =
				store.panels[ panelIndex ][ "elements" ][ elementIndex ][
					"__instance__"
				][ field ]
		}
	}
	return store
}
