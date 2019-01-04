import Cell from '../../../model/Cell'
import Selector from '../../../model/tool/Selector'

export function inRegion( cell: Cell, selector: Selector ): boolean {
	const { bounds } = cell
	const res: boolean = selector.boundsInSelectionArea( bounds )
	return res
}

export function intersecedWithRegion( cell: Cell, selector: Selector ): boolean {
	const { bounds } = cell
	const res: boolean = selector.boundsIntersectedWithSelectionArea( bounds )
	return res
}
