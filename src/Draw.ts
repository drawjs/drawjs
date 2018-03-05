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
import {
	getInstanceByElementWithoutInstance,
	coupleUpdateZoomPanZoom
} from "mixin/index"
import ZoomPan from "mixin/ZoomPan"

import * as download from "lib/download.js"
import { getDefaultDrawExportFileName } from "store/index"
import cellTypeClassMap from "store/map/cellTypeClassMap"
import { log } from "util/index"
import SchemaDrawStoreWithoutInstance from "schema/SchemaDrawStoreWithoutInstance"
import { SelectionArea } from "model/tool/index"
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
	UPDATE_VIEWPORT
} from "store/draw/actions"
import Interaction from "./core/interaction";
import ViewPort from './model/tool/ViewPort';

const ajv = new Ajv()


export default class Draw {

	/**
	 * Draw getters
	 */
	getters: any


	/**
	 * zoom and pan
	 */
	public zoomPan: ZoomPan

	public cellTypeClassMap: any = cellTypeClassMap


	/**
	 * Mini map
	 */
	public miniMap: MiniMap

	public onGraphClick: Function
	public onGraphHover: Function

	constructor( canvas: HTMLCanvasElement ) {
		UPDATE_DRAW( this )
		UPDATE_CANVAS( canvas )

		const viewPort = new ViewPort()
		UPDATE_VIEWPORT( viewPort )

		const selector = new Selector()
		UPDATE_SELECTOR( selector )

		const interaction = new Interaction()
		UPDATE_INTERACTION( interaction )

		this.zoomPan = new ZoomPan( { draw: this } )
		this.miniMap = new MiniMap( { draw: this } )

		MODIFY_ACTIVE_PANEL_ID( getters.storeActivePanelId )

		this.getters = getters
	}

	public render() {
		const self = this
		const { zoom, panX, panY } = getters
		const movementX = panX * zoom
		const movementY = panY * zoom

		getters.ctx.transform( zoom, 0, 0, zoom, movementX, movementY )


		this.clearEntireCanvas()
		// this.miniMap.renderMainToGetImageData()

		this.clearEntireCanvas()

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

	private clearEntireCanvas() {
		getters.ctx.clearRect( 0, 0, getters.canvas.width, getters.canvas.height )
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
