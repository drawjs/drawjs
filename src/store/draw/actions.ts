import getCellTypeClassMap from "../map/getCellTypeClassMap"
import { isNil, cloneDeep, intersection } from "lodash"
import Cell from "../../model/Cell"
import { isNotNil } from "../../util/index"
import storeElementFields from "../../store/storeElementFields"
import Selector from "../../model/tool/Selector"
import Interaction from "../../core/interaction"
import ViewPort from "../../model/tool/ViewPort"
import Grid from "../../model/tool/Grid"
import Renderer from "../../model/tool/Renderer"
import DrawStore from "./DrawStore"
import Getters from "./Getters"
import SharedActions from "../../shared/SharedActions"
import MiniMap from "../../model/tool/MiniMap"
import TestUtils from "../../shared/TestUtils"
import TextInput from "../../model/tool/TextInput"
import { notNil } from "../../util/lodash/index"
import { removeElement } from "../../util/js/array"
import Draw from '../../index';

export default class Actions {
	drawStore: DrawStore

	getters: Getters

	get sharedActions(): SharedActions {
		return this.getters.draw.sharedActions
	}

	constructor( drawStore: DrawStore, getters: Getters ) {
		this.drawStore = drawStore
		this.getters = getters
	}

	/**
	 * // Update props in drawStore
	 */
	UPDATE_STORE( store: DrawStore | DrawStoreWithoutInstance ) {
		const cloned = cloneDeep( store )
		const keys: string[] = Object.keys( store )
		keys.map( set )

		function set( key ) {
			store[ key ] = cloned[ key ]
		}
	}

	UPDATE_DRAW( draw: Draw ) {
		this.drawStore[ "draw" ] = draw
	}

	UPDATE_CANVAS( canvas: HTMLCanvasElement ) {
		this.drawStore[ "canvas" ] = canvas
	}

	/**
	 * View port
	 */
	UPDATE_VIEWPORT( viewPort: ViewPort ) {
		this.drawStore[ "viewPort" ] = viewPort
	}

	UPDATE_RENDERER( renderer: Renderer ) {
		this.drawStore[ "renderer" ] = renderer
	}

	UPDATE_SELECTOR( selector: Selector ) {
		this.drawStore[ "selector" ] = selector
	}

	UPDATE_INTERACTION( interaction: Interaction ) {
		this.drawStore[ "interaction" ] = interaction
	}

	UPDATE_MINIMAP( miniMap: MiniMap ) {
		this.drawStore[ "miniMap" ] = miniMap
	}

	UPDATE_GRID( grid: Grid ) {
		this.drawStore[ "grid" ] = grid
	}

	UPDATE_TEST_UTILS( testUtils: TestUtils ) {
		this.drawStore[ "testUtils" ] = testUtils
	}

	UPDATE_TEXT_INPUT( textInput: TextInput ) {
		this.drawStore[ "textInput" ] = textInput
	}

	ADD_ELEMENT(
		draw: Draw,
		elementType: string,
		setting: any,
		panelId?: string
	) {
		const cellTypeClassMap = getCellTypeClassMap()
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
			this.getters.storeActiveElements.push( wholeElement )
		}

		if ( !isNil( panelId ) ) {
			this.getters.getStoreElementsByPanelId( panelId ).push( wholeElement )
		}

		return instance
	}

	REMOVE_ELEMENT( element: any ) {
		if ( notNil( element ) ) {
			const elements: any[] = this.getters.cellList
			removeElement( elements, element )
		}
	}

	REMOVE_ELEMENTS( elements: any[] ) {
		elements.map( this.REMOVE_ELEMENT.bind( this ) )
	}

	ADD_PANEL( name: string ) {
		this.getters.storePanels.push( {
			id      : this.getters.generateUniqueDrawId(),
			name,
			elements: []
		} )
	}

	MODIFY_ACTIVE_PANEL_ID( panelId: string ) {
		this.drawStore.activePanelId = panelId
	}

	ADD_ELEMENT_TO_CELL_LIST( cell: Cell ) {
		this.drawStore.cellList.push( cell )
	}

	UPDATE_STORE_ELEMENTS_BY_THEIR_INSTANCES() {
		this.drawStore.panels.map( resolvePanel )

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
				this.drawStore.panels[ panelIndex ][ "elements" ][ elementIndex ][
					field
				] = this.drawStore.panels[ panelIndex ][ "elements" ][ elementIndex ][
					"__instance__"
				][ field ]
			}
		}
	}

	/**
	 * // CEll
	 */
	START_DRAG_MOST_TOP_CELL_FOCUSED( event ) {
		const point: Point2DInitial = this.getters.getInitialPoint( event )
		const cell = this.getters.getMostTopCellFocused( point )
		this.sharedActions.startDragCell( cell, event )
	}

	START_DRAG_CELLS_SHOULD_SELECT( event ) {
		const self = this

		this.getters.cellsShouldSelect.map( startDrag )

		function startDrag( cell ) {
			self.sharedActions.startDragCell( cell, event )
		}
	}

	DRAGGING_CELLS_SHOULD_DRAG( event ) {
		const self = this

		this.getters.cellsShouldDrag.map( dragging )

		function dragging( cell ) {
			self.sharedActions.draggingCell( cell, event )
		}
	}

	STOP_DRAG_CELLS_SHOULD_DRAG( event ) {
		const self = this

		this.getters.cellsShouldDrag.map( stopDrag )

		function stopDrag( cell ) {
			self.sharedActions.stopDragCell( cell, event )
		}
	}

	DOUBLE_CLICK_MOST_TOP_CELL_FOCUSED( event ) {
		const point: Point2DInitial = this.getters.getInitialPoint( event )
		const cell = this.getters.getMostTopCellFocused( point )
		isNotNil( cell ) && this.sharedActions.doubleClickCell( cell, event )
	}

	/**
	 * // Select
	 */
	DESELECT_ALL_CELLS() {
		this.getters.selectedCells.map( this.sharedActions.deselectCell )
	}

	SELECT_MOST_TOP_CELL_FOCUSED( point: Point2D ) {
		const mostTopCell = this.getters.getMostTopCellFocused( point )
		this.sharedActions.selectCell( mostTopCell )
	}

	SELECT_CELLS_IN_SELECTOR_RIGION() {
		this.getters.cellsInSelectorRigion.map( this.sharedActions.selectCell )
	}

	/**
	 * // Text input
	 */
	APPEND_TEXT_INPUT_TO_DOCUMENT_BODY() {
		const textInput = this.getters.textInput
		if ( notNil( textInput ) ) {
			const { input } = textInput
			notNil( input ) && document.body.appendChild( input )
		}
	}
}
