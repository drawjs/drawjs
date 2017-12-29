import * as _ from 'lodash'

import { Rect } from 'shape/index'
import { Cell } from 'model/index'
import { dragAndDrop } from 'interaction/index'
import {
	DRAW_INSTANCE_NAME,
	DRAW_STORE_PANEL_DEFAULT_NAME,
	DRAW_ELEMENT_ID_PREFIX,
	DRAW_PANEL_ID_PREFIX,
} from 'store/constant'
import * as a from 'store/constant_action'

import * as interfaces from 'interface/index'
import * as download from 'lib/download.js'
import { getDefaultDrawExportFileName } from 'store/index'
import { generateUniqueId } from 'util/index'


export default class Draw {
	private canvas: HTMLCanvasElement
	private ctx: CanvasRenderingContext2D
	public store: interfaces.DrawStore = {
		activePanelId: null,

		panels: [ {
			id: this.generateUniqueId(),
			name: DRAW_STORE_PANEL_DEFAULT_NAME,
			elements: []
		} ]
	}

	get storeActivePanelId(): string {
		return (
			! _.isNil( this.store.activePanelId ) ?
			this.store.activePanelId :
			(
				this.store.panels.length > 0 ?
				this.store.panels[ 0 ].id :
				null
			)
		)
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
			cachedElements = [
				...cachedElements,
				...panel.elements
			]
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
		let store:interfaces.DrawStore = _.cloneDeep( this.store )

		store.panels.map( mapPanelElements )

		function mapPanelElements( panel, panelIndex ) {

			panel.elements.map( getDelete__Instance__( panelIndex ) )
		}

		function getDelete__Instance__( panelIndex ) {
			return ( element, elementIndex ) => {
				delete store.panels[ panelIndex ].elements[ elementIndex ].__instance__
			}
		}

		return store
	}

	get __storeActiveElementsInstances__(): Cell[] {
		function get__instance__( element ) {
			return element.__instance__
		}
		return this.storeActiveElements.map( get__instance__ )
	}

	constructor( canvas: HTMLCanvasElement ) {
		this.canvas = canvas
		this.ctx = canvas.getContext( '2d' )

		this.attachChildrenClass( 'Rect', Rect )

		this.initialize()
	}

	/****** initialization and render ******/
	private initialize() {
		this.bindEvents()
		this.dispatch( a.MODIFY_ACTIVE_PANEL_ID, this.storeActivePanelId )
	}

	render() {
		this.clearEntireCanvas()

		const renderElement = element => {
			element.__instance__.render( this.ctx )
		}
		this.storeActiveElements.map( renderElement )
	}
	/****** initialization and render ******/


	/****** store ******/
	private getStoreElementsByPanelId( id: string ) {
		const foundPanel = _.find( this.store.panels, { id } )
		return (
			! _.isNil( foundPanel ) ?
			foundPanel.elements :
			[]
		)
	}

	private dispatch( actionName: string, param1?: any, param2?: any ) {
		let actionMethod: Function
		const actionMethods = {
			[ a.ADD_PANEL ]: ( name: string ): void => {
				this.storePanels.push( {
					id: this.generateUniqueId(),
					name,
					elements: []
				} )
			},

			[ a.ADD_ELEMENT ]: (
				cellInstance,
				panelId ?: string
			): void => {
				const {
					__instance__,
					type,
					top,
					left,
					width,
					height,
					fill,
					angle,
					draggable
				}: {
					__instance__: Cell
					type: string,
					top: number,
					left: number,
					width: number,
					height: number,
					fill: string,
					angle: number,
					draggable: boolean
				} = cellInstance
				const element = {
					__instance__: cellInstance,
					id: this.generateUniqueId(),
					type,
					top,
					left,
					width,
					height,
					fill,
					angle,
					draggable
				}
				if ( _.isNil( panelId ) ) {
					this.storeActiveElements.push( element )
				}
				if (! _.isNil( panelId ) ) {
					this.getStoreElementsByPanelId( panelId ).push( element )
				}
			},


			[ a.MODIFY_ACTIVE_PANEL_ID ]: ( panelId: string ): void => {
				this.store.activePanelId = panelId
			},

			[ a.MODIFY_STORE ]: ( store: interfaces.DrawStore ): void => {
				this.store = store
			},

		}
		actionMethod = actionMethods[ actionName ] || ( () => {} )
		return actionMethod( param1, param2 )
	}
	/****** store ******/

	addElement( element: interfaces.DrawStoreElement ) {
		this.dispatch( a.ADD_ELEMENT, element )
	}


	private attachChildrenClass( name: string, value: any ) {
		this[ name ] = value
	}


	private attachDrawToElement( element ) {
		// element[ DRAW_INSTANCE_NAME ] = this
	}

	private bindEvents() {
		dragAndDrop( this )
	}

	private clearEntireCanvas() {
		this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height )
	}

	private importData( dataString ) {
		if ( checkDataString( dataString ) ) {

		}

		function checkDataString( dataString: string ) {

		}
	}

	private exportData( fileName: string = getDefaultDrawExportFileName() ) {
		const clonedStore = _.cloneDeep( this.__storeIgnoreInstance__ )

		const dataString: string = JSON.stringify( clonedStore )
		download( dataString,  `${ fileName }.json`)
	}

	private generateUniqueId() {
		const self = this
		let id: string = generateUniqueId()
		id = checkAndUpdateIdIfNeeded( id )

		function checkAndUpdateIdIfNeeded( id: string ) {
			return (
				_.includes( self.storeElementsIds, id ) ?
				checkAndUpdateIdIfNeeded( generateUniqueId() ) :
				id
			)
		}
		return id
	}
}
