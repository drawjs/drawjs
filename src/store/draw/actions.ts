import drawStore from "store/draw/store"
import getters from "store/draw/getters"
import generateDrawUniqueId from "draw/generateDrawUniqueId"
import cellTypeClassMap from "../map/cellTypeClassMap"
import { isNil, cloneDeep, intersection } from "lodash"
import Draw from "Draw"
import Cell from "../../model/Cell"
import { isNotNil } from "util/index"
import storeElementFields from "store/storeElementFields"
import {
	selectCell,
	deselectCell,
	enableCellDrag
} from "../../mixin/coupleCell"
import Selector from "../../model/tool/Selector"
import Interaction from "../../core/interaction"
import ViewPort from "../../model/tool/ViewPort"
import Grid from '../../model/tool/Grid';

export function UPDATE_STORE( store: DrawStore | DrawStoreWithoutInstance ) {
	const cloned = cloneDeep( store )
	const keys: string[] = Object.keys( store )
	keys.map( set )

	function set( key ) {
		store[ key ] = cloned[ key ]
	}
}

export function UPDATE_DRAW( draw: Draw ) {
	drawStore[ "draw" ] = draw
}

export function UPDATE_CANVAS( canvas: HTMLCanvasElement ) {
	drawStore[ "canvas" ] = canvas
}

/**
 * View port
 */
export function UPDATE_VIEWPORT( viewPport: ViewPort ) {
	drawStore[ "viewPort" ] = viewPport
}


export function UPDATE_SELECTOR( selector: Selector ) {
	drawStore[ "selector" ] = selector
}



export function UPDATE_INTERACTION( interaction: Interaction ) {
	drawStore[ "interaction" ] = interaction
}


export function UPDATE_GRID( grid: Grid ) {
	drawStore[ "grid" ] = grid
}



export function ADD_ELEMENT(
	draw: Draw,
	elementType: string,
	setting: any,
	panelId?: string
) {
	const ElementClass = cellTypeClassMap[ elementType ]

	if ( isNil( ElementClass ) ) {
		console.log( `Type not found: "${elementType}"` )
		return
	}
	const instance = new ElementClass( {
		draw,
		...setting
	} )

	const {
		id,
		type,
		top,
		left,
		width,
		height,
		fill,
		angle,
		points,
		draggable,
		shouldSelect
	}: {
		id: string
		type: string
		top: number
		left: number
		width: number
		height: number
		fill: string
		angle: number
		points: Point2D[]
		draggable: boolean
		shouldSelect: boolean
	} = setting

	const wholeElement = {
		id          : !isNil( id ) ? id : generateDrawUniqueId(),
		__instance__: instance,
		type,
		top,
		left,
		width,
		height,
		fill,
		angle,
		points,
		draggable,
		shouldSelect
	}

	if ( isNil( panelId ) ) {
		getters.storeActiveElements.push( wholeElement )
	}

	if ( !isNil( panelId ) ) {
		getters.getStoreElementsByPanelId( panelId ).push( wholeElement )
	}
}

export function ADD_PANEL( name: string ) {
	getters.storePanels.push( {
		id      : generateDrawUniqueId(),
		name,
		elements: []
	} )
}

export function MODIFY_ACTIVE_PANEL_ID( panelId: string ) {
	drawStore.activePanelId = panelId
}

export function ADD_ELEMENT_TO_CELL_LIST( cell: Cell ) {
	drawStore.cellList.push( cell )
}

export function UPDATE_STORE_ELEMENTS_BY_THEIR_INSTANCES() {
	drawStore.panels.map( resolvePanel )

	function resolvePanel( panel, panelIndex ) {
		panel.elements.map( resolveElement( panelIndex ) )
	}

	function resolveElement( panelIndex ) {
		return ( element, elementIndex ) => {
			const { __instance__ } = element
			if ( isNotNil( __instance__ ) ) {
				const instanceFields = Object.keys( __instance__ )
				const intersectionFields = intersection(
					instanceFields,
					storeElementFields
				)
				intersectionFields.map( setField( panelIndex, elementIndex ) )
			}
		}
	}

	function setField( panelIndex, elementIndex ) {
		return function( field ) {
			drawStore.panels[ panelIndex ][ "elements" ][ elementIndex ][ field ] =
				drawStore.panels[ panelIndex ][ "elements" ][ elementIndex ][
					"__instance__"
				][ field ]
		}
	}
}

/**
 * // Select
 */
export function DESELECT_ALL_CELLS() {
	getters.cellList.map( deselectCell )
}

export function SELECT_MOST_TOP_CELL_FOCUSED( point: Point2D ) {
	const mostTopCell = getters.getMostTopCellFocused( point )
	selectCell( mostTopCell )
}

export function SELECT_CELLS_IN_SELECTOR_RIGION() {
	getters.cellsInSelectorRigion.map( selectCell )
}

/**
 * // Drag
 */
// export function ENABLE_MOST_TOP_CELL_FOCUSED_DRAG( point: Point2D ) {
// 	const mostTopCell = getters.getMostTopCellFocused( point )
// 	enableCellDrag( mostTopCell )
// }
//  export function ENABLE_CELLS_SELECTED_DRAG() {
// 	getters.cellsSelected.map( enableCellDrag )
// }
