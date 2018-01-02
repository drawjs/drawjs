import * as interfaces from 'interface/index'
import * as cellTypeList from 'store/constant_cellTypeList'
import cellTypeClassMap from 'store/cellTypeClassMap'
import { Cell } from 'model/index'


export default function ( elementWithoutInstance: interfaces.DrawStoreElementWithoutInstance): Cell {
	const { type = cellTypeList.RECT }: { type: string } = elementWithoutInstance
	const Class = cellTypeClassMap[ type ]
	return new Class( elementWithoutInstance )
}
