import * as _ from 'lodash'

import { Rect } from 'shape/index'
import { dragAndDrop } from 'interaction/index'
import {
	DRAW_INSTANCE_NAME,
	DRAW_STORE_PANEL_DEFAULT_NAME
} from 'store/constant'
import * as interfaces from 'interface/index'
import * as download from 'lib/download.js'
import { getDefaultDrawExportFileName } from 'store/index'


export default class Draw {
	private canvas: HTMLCanvasElement
	private ctx: CanvasRenderingContext2D
	public store: interfaces.DrawStore = {
		data: {
			currentPanelIndex: 0,
			panels: [ {
				name: DRAW_STORE_PANEL_DEFAULT_NAME,
				elements: []
			} ]
		}
	}

	get storeData() {
		return this.store.data
	}

	get storeCurrentElements() {
		return this.store.data.panels[ this.store.data.currentPanelIndex ].elements
	}


	constructor( canvas: HTMLCanvasElement ) {
		this.canvas = canvas
		this.ctx = canvas.getContext( '2d' )

		this.attachChildrenClass( 'Rect', Rect )

		this.initialize()
	}

	/****** store ******/
	private getStoreElementByPanelIndex( index: number ):any[] {
		return this.store.data.panels[ index ].elements
	}
	/****** store ******/

	private initialize() {
		this.bindEvents()
	}

	render() {
		this.clearEntireCanvas()

		const renderElement = element => {
			element.render( this.ctx )
		}
		this.storeCurrentElements.map( renderElement )
	}

	private addElement( element: any, panelIndex?: number ) {
		this.attachDrawToElement( element )

		if ( panelIndex === undefined ) {
			this.storeCurrentElements.push( element )
		}

		if ( panelIndex !== undefined ) {
			this.getStoreElementByPanelIndex( panelIndex ).push( element )
		}
	}

	private attachChildrenClass( name:string, value: any ) {
		this[ name ] = value
	}


	private attachDrawToElement( element ) {
		element[ DRAW_INSTANCE_NAME ] = this
	}

	private bindEvents() {
		dragAndDrop( this )
	}

	private clearEntireCanvas() {
		this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height )
	}

	private exportData( fileName: string = getDefaultDrawExportFileName() ) {
		const clonedStore = _.cloneDeep( this.store )

		const dataString: string = JSON.stringify( clonedStore )
		download( dataString,  `${ fileName }.json`)
	}


}
