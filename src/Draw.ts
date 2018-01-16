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
} from "store/constant"
import * as a from "store/constant_action"
import { ROTATE_ICON } from 'store/constant_cellTypeList'
import drawRenderExcludingCellTypes from 'store/drawRenderExcludingCellTypes'
import {
	getInstanceByElementWithoutInstance,
	updateStoreElementsByTheirInstances
} from "mixin/index"

import * as interfaces from "interface/index"
import * as download from "lib/download.js"
import { getDefaultDrawExportFileName } from "store/index"
import cellTypeClassMap from "store/cellTypeClassMap"
import { generateUniqueId } from "util/index"
import SchemaDrawStoreWithoutInstance from "schema/SchemaDrawStoreWithoutInstance"
import { SelectionArea } from "./model/tool/index";


const ajv = new Ajv()

export default class Draw {
	public store: interfaces.DrawStore = {
		activePanelId: null,

		panels: [
			{
				id      : this.generateUniqueId(),
				name    : DRAW_STORE_PANEL_DEFAULT_NAME,
				elements: []
			}
		]
	}
	public canvas: HTMLCanvasElement
	public ctx: CanvasRenderingContext2D

	public cellTypeClassMap: any = cellTypeClassMap
	public _selectionAreaInstance: SelectionArea

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

	get storeActiveElements(): interfaces.DrawStoreElement[] {
		return this.getStoreElementsByPanelId( this.storeActivePanelId )
	}

	get storeElementsIds(): string[] {
		let ids: string[]
		let cachedElements: interfaces.DrawStoreElement[] = []

		if ( _.isNil( this.store ) || _.isNil( this.store.panels ) ) {
			return []
		}

		this.store.panels.map( pushElementsToCachedElement )

		ids = cachedElements.map( getId )

		function pushElementsToCachedElement( panel: interfaces.DrawStorePanel ) {
			cachedElements = [ ...cachedElements, ...panel.elements ]
		}

		function getId( element: interfaces.DrawStoreElement ): string {
			return element.id
		}

		return ids
	}

	get storePanels(): interfaces.DrawStorePanel[] {
		return this.store.panels
	}

	get __storeIgnoreInstance__(): interfaces.DrawStore {
		let store: interfaces.DrawStore = _.cloneDeep( this.store )

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

	get __storeActiveElementsInstances__(): interfaces.DrawStoreElementInstance[] {
		function get__instance__( element ) {
			return element.__instance__
		}
		return this.storeActiveElements.map( get__instance__ )
	}

	get canvasLeft(): number {
		return this.canvas.getBoundingClientRect().left
	}
	get canvasTop(): number {
		return this.canvas.getBoundingClientRect().top
	}

	constructor( canvas: HTMLCanvasElement ) {
		this.canvas = canvas
		this.ctx = canvas.getContext( "2d" )

		this.initialize()
	}

	/****** initialization and render ******/
	private initialize() {
		this.dispatch( a.MODIFY_ACTIVE_PANEL_ID, this.storeActivePanelId )

		this._initializeSelectionArea()
	}

	private _initializeSelectionArea(): void {
		this._selectionAreaInstance = new SelectionArea( { draw: this } )
	}

	public render() {
		this.clearEntireCanvas()

		const renderElement = cell => {
			isInclude( cell.type ) && cell.render()
		}

		function isInclude( type: String ): boolean {
			return ! _.includes( drawRenderExcludingCellTypes, type )
		}

		this.cellList.map( renderElement )
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
					console.log( `Do not exist type: ${elementType}` )
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
					points: interfaces.Point[]
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

			[ a.MODIFY_STORE ]: ( store: interfaces.DrawStore ): void => {
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
			if ( Cell.containPoint( event.x - self.canvasLeft, event.y  - self.canvasTop) ) {
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
			const storeWithoutInstance: interfaces.DrawStoreWithoutInstance = JSON.parse(
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
				const importedData: interfaces.DrawStoreWithoutInstance = JSON.parse(
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
			storeCleanElements: interfaces.DrawStoreWithoutInstance
		) {
			const store = _.cloneDeep( storeCleanElements )
			if ( store && store.panels ) {
				store.panels.map( resolveElements )
			}

			function resolveElements( {
				elements,
				id: panelId
			}: {
				elements: interfaces.DrawStoreElementWithoutInstance[]
				id: string
			} ) {
				elements.map( addElementToDraw( panelId ) )
			}

			function addElementToDraw( panelId: string ) {
				return (
					props
				) => {
					const { type } = props
					self.addElement( type, props, panelId )
				}
			}
		}

		function cleanStoreElements(
			storeWithoutInstance: interfaces.DrawStoreWithoutInstance
		): interfaces.DrawStoreWithoutInstance {
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
