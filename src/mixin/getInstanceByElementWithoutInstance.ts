import * as interfaces from 'interface/index'
import * as cellTypeList from 'store/constant_cellTypeList'
import cellTypeClassMap from 'store/cellTypeClassMap'
import { Cell } from 'model/index'


export default function ( elementWithoutInstance: interfaces.DrawStoreElementWithoutInstance, draw: any): interfaces.DrawStoreElementInstance {
	const isInstanceElementWithoutInstance = isInstance( elementWithoutInstance )
	if ( isInstanceElementWithoutInstance ) {
		addDrawInstanceToInstance( elementWithoutInstance )
		return elementWithoutInstance
	}

	if ( ! isInstanceElementWithoutInstance ) {
		const { type = cellTypeList.RECT }: { type: string } = elementWithoutInstance
		const Class = cellTypeClassMap[ type ]
		const instance: interfaces.DrawStoreElementInstance = new Class( elementWithoutInstance )
		addDrawInstanceToInstance( instance )
		return instance
	}

	function isInstance( elementWithoutInstance ) {
		return elementWithoutInstance[ '_isInstance' ] === true
	}

	function addDrawInstanceToInstance( instance: interfaces.DrawStoreElementInstance ) {
		return instance[ '_draw' ] = draw
	}
}
