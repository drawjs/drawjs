import * as cellTypeList from 'store/constant_cellTypeList'
import cellTypeClassMap from 'store/cellTypeClassMap'
import { Cell } from 'model/index'


export default function ( elementWithoutInstance: DrawStoreElementWithoutInstance, draw: any ): DrawStoreElementInstance {
	const isInstanceElementWithoutInstance = isInstance( elementWithoutInstance )
	if ( isInstanceElementWithoutInstance ) {
		addDrawInstanceToInstance( elementWithoutInstance )
		return elementWithoutInstance
	}

	if ( ! isInstanceElementWithoutInstance ) {
		const { type = cellTypeList.RECT }: { type: string } = elementWithoutInstance
		const Class = cellTypeClassMap[ type ]
		const instance: DrawStoreElementInstance = new Class( elementWithoutInstance )
		addDrawInstanceToInstance( instance )
		return instance
	}

	function isInstance( elementWithoutInstance ) {
		return elementWithoutInstance[ '_isInstance' ] === true
	}

	function addDrawInstanceToInstance( instance: DrawStoreElementInstance ) {
		return instance[ 'draw' ] = draw
	}
}
