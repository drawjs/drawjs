import * as _ from "lodash"
import * as Ajv from "lib/ajv"

import { Cell } from "model/index"
import {
	DRAW_INSTANCE_NAME,
	DRAW_STORE_PANEL_DEFAULT_NAME,
	DRAW_ELEMENT_ID_PREFIX,
	DRAW_PANEL_ID_PREFIX
} from "store/constant/index"

import * as download from "lib/download.js"
import { getDefaultDrawExportFileName } from "store/index"
import { log } from "util/index"
import SchemaDrawStoreWithoutInstance from "schema/SchemaDrawStoreWithoutInstance"
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



	public onGraphClick: Function
	public onGraphHover: Function

	constructor( canvas: HTMLCanvasElement ) {
		this.drawStore = new DrawStore()

		this.getters = new Getters( this.drawStore )
		this.actions = new Actions( this.drawStore, this.getters )

		const testUtils = new TestUtils( this.getters )
		this.actions.UPDATE_TEST_UTILS( testUtils )

		this.sharedGetters = new SharedGetters()
		this.sharedActions = new SharedActions( this.drawStore, this.getters )

		this.actions.UPDATE_DRAW( this )
		this.actions.UPDATE_CANVAS( canvas )

		const viewPort = new ViewPort( { draw: this } )
		this.actions.UPDATE_VIEWPORT( viewPort )

		const renderer = new Renderer( { draw: this } )
		this.actions.UPDATE_RENDERER( renderer )

		const selector = new Selector( { draw: this } )
		this.actions.UPDATE_SELECTOR( selector )

		const interaction = new Interaction( { draw: this } )
		this.actions.UPDATE_INTERACTION( interaction )

		const miniMap = new MiniMap( { draw: this } )
		this.actions.UPDATE_MINIMAP( miniMap )

		const grid = new Grid( { draw: this, canvas } )
		this.actions.UPDATE_GRID( grid )

		this.actions.MODIFY_ACTIVE_PANEL_ID( this.getters.storeActivePanelId )
	}

	public render() {
		const { testUtils, viewPort, renderer, grid, zoom, pan, miniMap, ctx, canvasWidth, canvasHeight } = this.getters

		const self = this

		renderer.clear()

		// /**
		//  * Save image data on mini map
		//  */
		// renderer.setTransformViewPortToRenderMiniMap()
		// this.renderMain()
		// // renderer.resetTransform()
		// // this.getters.miniMap.viewBox.render()
		// miniMap.saveImageDataInRigion()
		// renderer.clear()


		renderer.setTransformViewPort()
		this.renderMain()



		// this.getters.renderer.resetTransform()
		// this.getters.miniMap.render()

		// this.getters.renderer.setTransformViewPortToRenderMiniMap()
		// testUtils.renderPoint( { x: 0, y: 0 }, "blue" )
	}

	renderMain() {
		const { renderElement } = this.sharedActions

		this.getters.ctx.strokeStyle = "blue"
		this.getters.ctx.strokeRect( 0, 0, this.getters.canvasWidth, this.getters.canvasHeight )

		// this.getters.grid.render( 10, this.getters.zoom, this.getters.pan, {
		// 	color: "#ddd"
		// } )
		// this.getters.grid.render( 50, this.getters.zoom, this.getters.pan, {
		// 	color: "#888"
		// } )

		this.getters.cellListShouldRender.map( renderElement )

		this.getters.selector.render()


	}

	public addElement( type: string, setting: any, panelId?: string ) {
		// this.dispatch( a.ADD_ELEMENT, type, setting, panelId )
		return this.actions.ADD_ELEMENT( this, type, setting, panelId )
	}

	private attachDrawToElement( element ) {
		// element[ DRAW_INSTANCE_NAME ] = this
	}

	private importData( dataString ) {
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

	private exportData( fileName: string = getDefaultDrawExportFileName() ) {
		this.actions.UPDATE_STORE_ELEMENTS_BY_THEIR_INSTANCES()
		const dataString: string = JSON.stringify(
			this.getters.clonedStoreWithoutCircularObjects
		)
		download( dataString, `${fileName}.json` )
	}
}
