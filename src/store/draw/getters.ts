import drawStore from "store/draw/store"
import { isNil, cloneDeep, find } from "lodash"
import { Cell } from "../../model/index"

class Getters {
	get storeActivePanelId(): string {
		return !isNil( drawStore.activePanelId ) ?
			drawStore.activePanelId :
			drawStore.panels.length > 0 ? drawStore.panels[ 0 ].id : null
	}

	get storeElementsIds(): string[] {
		let ids: string[]
		let cachedElements: DrawStoreElement[] = []

		if ( isNil( drawStore ) || isNil( drawStore.panels ) ) {
			return []
		}

		drawStore.panels.map( pushElementsToCachedElement )

		ids = cachedElements.map( getId )

		function pushElementsToCachedElement( panel: DrawStorePanel ) {
			cachedElements = [ ...cachedElements, ...panel.elements ]
		}

		function getId( element: DrawStoreElement ): string {
			return element.id
		}

		return ids
	}

	get storeActiveElements(): DrawStoreElement[] {
		return this.getStoreElementsByPanelId( this.storeActivePanelId )
	}

	get storePanels(): DrawStorePanel[] {
		return drawStore.panels
	}

	/**
	 * Canvas
	 */
	get canvas(): HTMLCanvasElement {
		return drawStore.canvas
	}

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
		const res: CanvasRenderingContext2D = this.canvas.getContext( "2d" )
		return res
	}



	/**
	 * Cell list
	 */
	get storeCellList(): Cell[] {
		return drawStore.cellList
	}

	get storeMostTopCell(): Cell {
		return
		// let res: Cell
		// this.storeCellList.map( getProperCell )

		// function getProperCell( Cell ) {
		// 	if (
		// 		Cell.contain(
		// 			event.x - self.canvasLeft,
		// 			event.y - self.canvasTop
		// 		)
		// 	) {
		// 		res = Cell
		// 	}
		// }

		// return resCell
	}

	/**
	 * Data to export
	 */
	get clonedStoreWithoutCircularObjects(): DrawStore {
		let clonedStore: DrawStore = cloneDeep( drawStore )

		deleteCellList()

		clonedStore.panels.map( resolvePanel )

		function resolvePanel( panel, panelIndex ) {
			panel.elements.map( delete__Instance__( panelIndex ) )
		}

		function delete__Instance__( panelIndex ) {
			return ( element, elementIndex ) => {
				delete clonedStore.panels[ panelIndex ].elements[ elementIndex ]
					.__instance__
			}
		}

		function deleteCellList() {
			delete clonedStore[ "cellList" ]
		}

		return clonedStore
	}

	get __storeActiveElementsInstances__(): DrawStoreElementInstance[] {
		function get__instance__( element ) {
			return element.__instance__
		}
		return this.storeActiveElements.map( get__instance__ )
	}

	getStoreElementsByPanelId( id: string ) {
		const foundPanel = find( drawStore.panels, { id } )
		return !isNil( foundPanel ) ? foundPanel.elements : []
	}
}

export default new Getters()
