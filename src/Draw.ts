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
import { notNil, cloneDeep } from "./util/lodash/index"
import renderBackground from "./util/canvas/renderBackground"

export default class Draw {
	/**
	 * Draw store
	 */
	drawStore: DrawStore;

	/**
	 * Store = Draw store
	 */
	store: DrawStore

	/**
	 * Draw getters, based on "drawStore"
	 */
	getters: Getters;

	/**
	 * Draw actions, which mutates "drawStore"
	 */
	actions: Actions;

	/**
	 * Draw shared getters, which aren't based on "drawStore"
	 */
	sharedGetters: SharedGetters;

	/**
	 * Draw shared actions, which aren't based on "drawStore" but doesn't mutate "drawStore"
	 */
	sharedActions: SharedActions;

	onGraphClick: Function;
	onGraphHover: Function;

	constructor( canvas: HTMLCanvasElement, setting: Setting = {} ) {
		const { isExtended, showMiniMap } = setting
		if ( !isExtended ) {
			this.drawStore = new DrawStore( this )
			this.store = this.drawStore
			this.getters = new Getters( this.drawStore )
			this.actions = new Actions( this.drawStore, this.getters )
			this.actions.UPDATE_CANVAS( canvas )
			this.actions.UPDATE_SETTING( setting )

			this._initialize()

			const interaction = new Interaction( { draw: this } )
			this.actions.UPDATE_INTERACTION( interaction )
		}
	}

	_initialize() {
		const tmpCanvas: HTMLCanvasElement = document.createElement( "canvas" )
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

		const { showMiniMap: shouldRender } = this.drawStore.setting
		const miniMap = new MiniMap( { draw: this, shouldRender } )
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

	addElement( type: string, props: any = {} ) {
		return this.actions.ADD_ELEMENT( type, { ...props, draw: this } )
	}

	removeElement( element: any ) {
		this.actions.REMOVE_ELEMENT( element )
	}

	attachDrawToElement( element ) {
		// element[ DRAW_INSTANCE_NAME ] = this
	}

	importData( dataString ) {
		const data = JSON.parse( dataString )

		const { rootId, elements, zoom, center } = data

		if (
			notNil( rootId ) &&
			notNil( elements )
		) {
			// Reset
			this.actions.RESET()

			this.actions.UPDATE_DRAW_ROOT_ID( rootId )

			// create elements
			elements.forEach( ( element ) => {
				const { type } = element
				this.addElement( type, element )
			} )

			// Recover viewport
			if ( notNil( zoom ) && notNil( center ) ) {
				this.drawStore.viewPort.update( zoom, center )
      }
		}
		this.render()
	}

	exportData( fileName: string = getDefaultDrawExportFileName() ) {
		// this.actions.REFRESH_SYNC_STORE_ROOT_ID()
		// this.actions.REFRESH_SYNC_STORE_ELEMENTS()

		const { exportingData } = this.getters
		// console.log( exportingData )
		const dataString = JSON.stringify( exportingData )
		download( dataString, `${fileName}.json` )
	}
}
