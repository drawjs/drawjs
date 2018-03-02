import * as _ from "lodash"
import * as Ajv from "lib/ajv"

import { Rect, Line } from "model/shape/index"
import { Cell } from "model/index"
// import Interaction from "interaction/Interaction"
import {
	DRAW_INSTANCE_NAME,
	DRAW_STORE_PANEL_DEFAULT_NAME,
	DRAW_ELEMENT_ID_PREFIX,
	DRAW_PANEL_ID_PREFIX
} from "store/constant/index"
import * as a from "store/constant/action"
import { ROTATE_ICON } from "store/constant/cellType"
import {
	getInstanceByElementWithoutInstance,
	updateStoreElementsByTheirInstances,
	coupleUpdateZoomPanZoom
} from "mixin/index"
import ZoomPan from "mixin/ZoomPan"
import EventKeyboard from "mixin/EventKeyboard"

import * as download from "lib/download.js"
import { getDefaultDrawExportFileName } from "store/index"
import cellTypeClassMap from "store/map/cellTypeClassMap"
import { generateUniqueId, log } from "util/index"
import SchemaDrawStoreWithoutInstance from "schema/SchemaDrawStoreWithoutInstance"
import { SelectionArea } from "model/tool/index"
import MiniMap from "./model/tool/MiniMap"
import renderElement from "./shared/renderElement"
import { renderGridCanvas } from "shared/index"
import Selector from './model/tool/Selector';
import drawStore from "./store/core/drawStore";

const ajv = new Ajv()

export default class Draw {
	public store: DrawStore = drawStore
	public canvas: HTMLCanvasElement

	/**
	 * event
	 */
	public eventKeyboard: EventKeyboard

	/**
	 * zoom and pan
	 */
	public zoomPan: ZoomPan

	public cellTypeClassMap: any = cellTypeClassMap
	public _selectionAreaInstance: SelectionArea

	/**
	 * Selector
	 */
	selector: Selector

	/**
	 * Mini map
	 */
	public miniMap: MiniMap

	/**
	 * Cells collection for sorting visual level,
	 * the more end, the more top
	 */
	public cellList: Cell[] = []

	public onGraphClick: Function
	public onGraphHover: Function

	get storeActivePanelId(): string {
		return !_.isNil( this.store.activePanelId ) ?
			this.store.activePanelId :
			this.store.panels.length > 0 ? this.store.panels[ 0 ].id : null
	}

	get storeActiveElements(): DrawStoreElement[] {
		return this.getStoreElementsByPanelId( this.storeActivePanelId )
	}

	get storeElementsIds(): string[] {
		let ids: string[]
		let cachedElements: DrawStoreElement[] = []

		if ( _.isNil( this.store ) || _.isNil( this.store.panels ) ) {
			return []
		}

		this.store.panels.map( pushElementsToCachedElement )

		ids = cachedElements.map( getId )

		function pushElementsToCachedElement( panel: DrawStorePanel ) {
			cachedElements = [ ...cachedElements, ...panel.elements ]
		}

		function getId( element: DrawStoreElement ): string {
			return element.id
		}

		return ids
	}

	get storePanels(): DrawStorePanel[] {
		return this.store.panels
	}

	get __storeIgnoreInstance__(): DrawStore {
		let store: DrawStore = _.cloneDeep( this.store )

		store.panels.map( mapPanelElements )

		function mapPanelElements( panel, panelIndex ) {
			panel.elements.map( getDelete__Instance__( panelIndex ) )
		}

		function getDelete__Instance__( panelIndex ) {
			return ( element, elementIndex ) => {
				delete store.panels[ panelIndex ].elements[ elementIndex ]
					.__instance__
			}
		}

		return store
	}

	get __storeActiveElementsInstances__(): DrawStoreElementInstance[] {
		function get__instance__( element ) {
			return element.__instance__
		}
		return this.storeActiveElements.map( get__instance__ )
	}


	/**
	 * Canvas
	 */
	get canvasLeft(): number {
		return this.canvas.getBoundingClientRect().left
	}
	get canvasTop(): number {
		return this.canvas.getBoundingClientRect().top
	}
	get canvasCenterPoint(): Point2D {
		const res = {
			x: this.canvas.width / 2,
			y: this.canvas.height / 2
		}
		return res
	}
	get ctx(): CanvasRenderingContext2D {
		const res = <CanvasRenderingContext2D>this.canvas.getContext( "2d" )
		return res
	}
	constructor( canvas: HTMLCanvasElement ) {
		this.canvas = canvas

		this.zoomPan = new ZoomPan( { draw: this } )
		this.eventKeyboard = new EventKeyboard()
		this.miniMap = new MiniMap( { draw: this } )

		this.initialize()
	}

	/****** initialization and render ******/
	private initialize() {
		this.dispatch( a.MODIFY_ACTIVE_PANEL_ID, this.storeActivePanelId )

		// this._selectionAreaInstance = new SelectionArea( { draw: this } )
		this.selector = new Selector( { draw: this } )
	}

	public render() {
		const self = this

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

		this.cellList.map( renderElement )

		// this.miniMap.render()
	}

	/****** initialization and render ******/

	/****** store ******/
	private getStoreElementsByPanelId( id: string ) {
		const foundPanel = _.find( this.store.panels, { id } )
		return !_.isNil( foundPanel ) ? foundPanel.elements : []
	}

	private dispatch(
		actionName: string,
		param1?: any,
		param2?: any,
		param3?: any
	) {
		let actionMethod: Function
		const actionMethods = {
			[ a.ADD_PANEL ]: ( name: string ): void => {
				this.storePanels.push( {
					id      : this.generateUniqueId(),
					name,
					elements: []
				} )
			},

			[ a.ADD_ELEMENT ]: (
				elementType: string,
				setting: any,
				panelId?: string
			): void => {
				const ElementClass = cellTypeClassMap[ elementType ]

				if ( _.isNil( ElementClass ) ) {
					console.log( `Type not found: "${elementType}"` )
					return
				}
				const instance = new ElementClass( {
					draw: this,
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
					id          : !_.isNil( id ) ? id : this.generateUniqueId(),
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

				if ( _.isNil( panelId ) ) {
					this.storeActiveElements.push( wholeElement )
				}

				if ( !_.isNil( panelId ) ) {
					this.getStoreElementsByPanelId( panelId ).push( wholeElement )
				}
			},

			[ a.MODIFY_ACTIVE_PANEL_ID ]: ( panelId: string ): void => {
				this.store.activePanelId = panelId
			},

			[ a.MODIFY_STORE ]: ( store: DrawStore ): void => {
				this.store = store
			}
		}
		actionMethod = actionMethods[ actionName ] || ( () => {} )
		return actionMethod( param1, param2 )
	}
	/****** store ******/

	/****** interaction ******/
	public _getMostTopCell( event ): Cell {
		const self = this
		let resCell = null
		this.cellList.map( getProperCell )

		function getProperCell( Cell ) {
			if (
				Cell.contain(
					event.x - self.canvasLeft,
					event.y - self.canvasTop
				)
			) {
				resCell = Cell
			}
		}

		return resCell
	}
	/****** interaction ******/

	public addElement( type: string, setting: any, panelId?: string ) {
		this.dispatch( a.ADD_ELEMENT, type, setting, panelId )
	}

	private attachDrawToElement( element ) {
		// element[ DRAW_INSTANCE_NAME ] = this
	}

	private clearEntireCanvas() {
		this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height )
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

			this.dispatch( a.MODIFY_STORE, storeWithoutInstanceCleanElements )

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
		const storeUpdatedElements = updateStoreElementsByTheirInstances(
			this.store
		)
		this.dispatch( a.MODIFY_STORE, storeUpdatedElements )
		const dataString: string = JSON.stringify( this.__storeIgnoreInstance__ )
		download( dataString, `${fileName}.json` )
	}

	private generateUniqueId() {
		const self = this
		let id: string = generateUniqueId()
		id = checkAndUpdateIdIfNeeded( id )

		function checkAndUpdateIdIfNeeded( id: string ) {
			return _.includes( self.storeElementsIds, id ) ?
				checkAndUpdateIdIfNeeded( generateUniqueId() ) :
				id
		}
		return id
	}
}