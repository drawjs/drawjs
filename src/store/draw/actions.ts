import drawStore from "store/draw/store"
import getters from "store/draw/getters"
import generateDrawUniqueId from "draw/generateDrawUniqueId"
import cellTypeClassMap from "../map/cellTypeClassMap"
import { isNil, cloneDeep, intersection } from "lodash"
import Draw from "Draw"
import Cell from "../../model/Cell";
import { isNotNil } from 'util/index';
import storeElementFields from 'store/storeElementFields';

export function MODIFY_STORE( store: DrawStore | DrawStoreWithoutInstance ) {
	const cloned = cloneDeep( store )
	const keys: string[] = Object.keys( store )
	keys.map( set )

	function set( key ) {
		store[ key ] = cloned[ key ]
	}
}

export function UPDATE_CANVAS( canvas: HTMLCanvasElement ) {
	drawStore[ 'canvas' ] = canvas
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
		isSelected
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
		isSelected: boolean
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
		isSelected
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
