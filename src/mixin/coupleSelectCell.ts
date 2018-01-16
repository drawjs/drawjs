import Cell from "../model/Cell"

/**
 * Select cell or not
 */
export default function ( cell: Cell, value: boolean ) {
	cell.isSelected = value
}
