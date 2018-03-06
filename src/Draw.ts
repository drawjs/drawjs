import * as _ from "lodash"
import * as Ajv from "lib/ajv"

import { Rect, Line } from "model/shape/index"
import { Cell } from "model/index"
import {
	DRAW_INSTANCE_NAME,
	DRAW_STORE_PANEL_DEFAULT_NAME,
	DRAW_ELEMENT_ID_PREFIX,
	DRAW_PANEL_ID_PREFIX
} from "store/constant/index"
import { getInstanceByElementWithoutInstance } from "mixin/index"

import * as download from "lib/download.js"
import { getDefaultDrawExportFileName } from "store/index"
import cellTypeClassMap from "store/map/cellTypeClassMap"
import { log } from "util/index"
import SchemaDrawStoreWithoutInstance from "schema/SchemaDrawStoreWithoutInstance"
import MiniMap from "./model/tool/MiniMap"
import renderElement from "./shared/renderElement"
import { renderGridCanvas } from "shared/index"
import Selector from "./model/tool/Selector"
import getters from "store/draw/getters"
import {
	ADD_ELEMENT,
	MODIFY_ACTIVE_PANEL_ID,
	UPDATE_STORE,
	UPDATE_STORE_ELEMENTS_BY_THEIR_INSTANCES,
	UPDATE_CANVAS,
	UPDATE_SELECTOR,
	UPDATE_DRAW,
	UPDATE_INTERACTION,
	UPDATE_VIEWPORT,
	UPDATE_GRID,
	UPDATE_RENDERER
} from "store/draw/actions"
import Interaction from "./core/interaction"
import ViewPort from "./model/tool/ViewPort"
import Grid from "./model/tool/Grid"
import Renderer from "./model/tool/Renderer"

const ajv = new Ajv()

export default class Draw {
	/**
	 * Draw getters
	 */
	getters: any

	public cellTypeClassMap: any = cellTypeClassMap

	public onGraphClick: Function
	public onGraphHover: Function

	constructor( canvas: HTMLCanvasElement ) {
		UPDATE_DRAW( this )
		UPDATE_CANVAS( canvas )

		const viewPort = new ViewPort()
		UPDATE_VIEWPORT( viewPort )

		const renderer = new Renderer()
		UPDATE_RENDERER( renderer )

		const selector = new Selector()
		UPDATE_SELECTOR( selector )

		const interaction = new Interaction()
		UPDATE_INTERACTION( interaction )

		const grid = new Grid( canvas )
		UPDATE_GRID( grid )

		MODIFY_ACTIVE_PANEL_ID( getters.storeActivePanelId )

		this.getters = getters
	}

	public render() {
		const self = this

		// this.clearEntireCanvas()
		// this.miniMap.renderMainToGetImageData()

		// this.clearEntireCanvas()

		// renderGridCanvas( {
		// 	canvas       : this.canvas,
		// 	width        : this.canvas.width,
		// 	height       : this.canvas.height,
		// 	zoom         : this.zoomPan.zoom,
		// 	deltaXForZoom: this.zoomPan.deltaXForZoom,
		// 	deltaYForZoom: this.zoomPan.deltaYForZoom,
		// 	deltaXForPan : this.zoomPan.deltaXForPan,
		// 	deltaYForPan : this.zoomPan.deltaYForPan
		// } )

		getters.renderer.clear()

		getters.renderer.setTransformViewPort()

		getters.grid.render( 50, getters.zoom, getters.pan )

		getters.cellList.map( renderElement )

		getters.selector.render()

		// this.miniMap.render()
	}

	public addElement( type: string, setting: any, panelId?: string ) {
		// this.dispatch( a.ADD_ELEMENT, type, setting, panelId )
		ADD_ELEMENT( this, type, setting, panelId )
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

			UPDATE_STORE( storeWithoutInstanceCleanElements )

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
		UPDATE_STORE_ELEMENTS_BY_THEIR_INSTANCES()
		const dataString: string = JSON.stringify(
			getters.clonedStoreWithoutCircularObjects
		)
		download( dataString, `${fileName}.json` )
	}
}
