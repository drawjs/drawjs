import * as _ from "lodash"
import * as Ajv from "./lib/ajv"

import {
	DRAW_INSTANCE_NAME,
	DRAW_STORE_PANEL_DEFAULT_NAME,
	DRAW_ELEMENT_ID_PREFIX,
	DRAW_PANEL_ID_PREFIX
} from "./store/constant/index"

import * as download from "./lib/download.js"
import { getDefaultDrawExportFileName } from "./store/index"
import { log } from "./util/index"
import SchemaDrawStoreWithoutInstance from "./schema/SchemaDrawStoreWithoutInstance"
// import MiniMap from './model/tool/MiniMap';
import Selector from "./model/tool/Selector"
import Interaction from "./core/interaction"
import ViewPort from "./model/tool/ViewPort"
import Grid from "./model/tool/Grid"
import Renderer from "./model/tool/Renderer"
import Getters from "./store/draw/Getters"
import DrawStore from "./store/draw/DrawStore"
import Actions from "./store/draw/Actions"
import SharedActions from "./shared/SharedActions"
import SharedGetters from "./shared/SharedGetters"
import TestUtils from "./shared/TestUtils"
import MiniMap from "./model/tool/MiniMap"
import TextInput from "./model/tool/TextInput"
import { notNil } from "./util/lodash/index"
import renderBackground from "./util/canvas/renderBackground"

const ajv = new Ajv()

export default class Draw {
	/**
	 * Draw store
	 */
	drawStore: DrawStore

	/**
	 * Draw getters, based on "drawStore"
	 */
	getters: Getters

	/**
	 * Draw actions, which mutates "drawStore"
	 */
	actions: Actions

	/**
	 * Draw shared getters, which isn't based on "drawStore"
	 */
	sharedGetters: SharedGetters

	/**
	 * Draw shared actions, which is based on "drawStore" but doesn't mutate "drawStore"
	 */
	sharedActions: SharedActions

	onGraphClick: Function
	onGraphHover: Function

	constructor( canvas: HTMLCanvasElement, isExtended: boolean = false ) {
		if ( !isExtended ) {
			this.drawStore = new DrawStore()
			this.getters = new Getters( this.drawStore )
			this.actions = new Actions( this.drawStore, this.getters )
			this.actions.UPDATE_CANVAS( canvas )


			this._initialize()

			const interaction = new Interaction( { draw: this } )
			this.actions.UPDATE_INTERACTION( interaction )
		}
	}

	_initialize() {
		const tmpCanvas: HTMLCanvasElement = document.createElement(
			"canvas",
		)
		tmpCanvas.width = 1000
		tmpCanvas.height = 1000
		this.actions.UPDATE_TMP_CANVAS( tmpCanvas )


		this.actions.INTIALIZE_DRAW_ROOT_ID()

		const testUtils = new TestUtils( this.getters )
		this.actions.UPDATE_TEST_UTILS( testUtils )

		this.sharedGetters = new SharedGetters()
		this.sharedActions = new SharedActions( this.drawStore, this.getters )

		this.actions.UPDATE_DRAW( this )

		const viewPort = new ViewPort( { draw: this } )
		this.actions.UPDATE_VIEWPORT( viewPort )

		const renderer = new Renderer( { draw: this } )
		this.actions.UPDATE_RENDERER( renderer )

		const selector = new Selector( { draw: this } )
		this.actions.UPDATE_SELECTOR( selector )

		const miniMap = new MiniMap( { draw: this } )
		this.actions.UPDATE_MINIMAP( miniMap )

		const grid = new Grid( { draw: this, canvas: this.getters.canvas } )
		this.actions.UPDATE_GRID( grid )

		if (
			notNil( this.drawStore.textInput ) &&
			notNil( this.drawStore.textInput.input )
		) {
			this.drawStore.textInput.input.remove()
		}
		const textInput: TextInput = new TextInput( { draw: this } )
		this.actions.UPDATE_TEXT_INPUT( textInput )

		this.actions.MODIFY_ACTIVE_PANEL_ID( this.getters.storeActivePanelId )

		this.actions.APPEND_TEXT_INPUT_TO_DOCUMENT_BODY()
	}

	render() {
		const { renderer, miniMap } = this.getters

		const { shouldRender: shouldRenderMiniMap } = miniMap

		renderer.clear()

		/**
		 * Save image data on mini map
		 */
		if ( shouldRenderMiniMap ) {
			miniMap.renderMainCells()
			miniMap.saveImageDataInRigion()
			renderer.clear()
		}

		this.renderBackground()
		renderer.setTransformViewPort()
		this.renderMain()

		if ( shouldRenderMiniMap ) {
			this.getters.renderer.resetTransform()
			this.getters.miniMap.render()
		}

		// this.getters.renderer.setTransformViewPortToRenderMiniMap()
		// testUtils.renderPoint( { x: 0, y: 0 }, "blue" )
	}

	renderBackground() {
		// renderBackground( this.getters.canvas, "blue" )
	}

	renderMain() {
		const { renderingMainCells } = this.getters.miniMap
		const { renderElement } = this.sharedActions

		// this.getters.ctx.strokeStyle = "blue"
		// this.getters.ctx.strokeRect(
		// 	0,
		// 	0,
		// 	this.getters.canvasWidth,
		// 	this.getters.canvasHeight
		// )

		// this.getters.grid.render( 10, this.getters.zoom, this.getters.pan, {
		// 	color: "#ddd"
		// } )
		// this.getters.grid.render( 50, this.getters.zoom, this.getters.pan, {
		// 	color: "#888"
		// } )

		this.getters.cellListShouldRender.map( cell =>
			renderElement( cell, renderingMainCells )
		)

		this.getters.selector.render()
	}

	addElement( type: string, setting: any, panelId?: string ) {
		return this.actions.ADD_ELEMENT( this, type, setting, panelId )
	}

	removeElement( element: any ) {
		this.actions.REMOVE_ELEMENT( element )
	}

	attachDrawToElement( element ) {
		// element[ DRAW_INSTANCE_NAME ] = this
	}

	importData( dataString ) {
		const data = JSON.parse( dataString )

		const { rootId, elements } = data

		this.actions.UPDATE_DRAW_ROOT_ID( rootId )
		
		elements.map( ( { data } ) => this.actions.ADD_ELEMENT( this, data.type, data, '' ) )

		this.render()
		return
		
		const self = this
		if ( checkDataString( dataString ) ) {
			const storeWithoutInstance: DrawStoreWithoutInstance = JSON.parse(
				dataString
			)
			const storeWithoutInstanceCleanElements = cleanStoreElements(
				storeWithoutInstance
			)

			this.actions.UPDATE_STORE( storeWithoutInstanceCleanElements )

			addStoreElementsAndInstances( storeWithoutInstance )

			this.render()
		}

		function checkDataString( dataString: string ) {
			try {
				const importedData: DrawStoreWithoutInstance = JSON.parse(
					dataString
				)
				const isValid = ajv.validate(
					SchemaDrawStoreWithoutInstance,
					importedData
				)
				return isValid
			} catch ( e ) {
				console.log( e )
				return false
			}
		}

		function addStoreElementsAndInstances(
			storeCleanElements: DrawStoreWithoutInstance
		) {
			const store = _.cloneDeep( storeCleanElements )
			if ( store && store.panels ) {
				store.panels.map( resolveElements )
			}

			function resolveElements( {
				elements,
				id: panelId
			}: {
				elements: DrawStoreElementWithoutInstance[]
				id: string
			} ) {
				elements.map( addElementToDraw( panelId ) )
			}

			function addElementToDraw( panelId: string ) {
				return props => {
					const { type } = props
					self.addElement( type, props, panelId )
				}
			}
		}

		function cleanStoreElements(
			storeWithoutInstance: DrawStoreWithoutInstance
		): DrawStoreWithoutInstance {
			const store = _.cloneDeep( storeWithoutInstance )
			store.panels.map( cleanElements )

			function cleanElements( value, panelIndex: number ) {
				store.panels[ panelIndex ][ "elements" ] = []
			}

			return store
		}
	}

	exportData( fileName: string = getDefaultDrawExportFileName() ) {
		// this.actions.UPDATE_STORE_ELEMENTS_BY_THEIR_INSTANCES()
		// const dataString: string = JSON.stringify(
		// 	this.getters.clonedStoreWithoutCircularObjects
		// )

		this.actions.REFRESH_SYNC_STORE_ROOT_ID()
		this.actions.REFRESH_SYNC_STORE_ELEMENTS()

		const data = this.drawStore.syncStore
		const dataString = JSON.stringify( data )
		download( dataString, `${fileName}.json` )
	}
}
