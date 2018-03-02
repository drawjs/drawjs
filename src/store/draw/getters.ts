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

	getPoint( event ): Point2D {
		const point: Point2D = {
			x: event.x - this.canvasLeft,
			y: event.y - this.canvasTop
		}
		return point
	}

	/**
	 * Cell list
	 */
	get cellList(): Cell[] {
		return drawStore.cellList
	}

	getMostTopCellFocus( { x, y }: Point2D ): Cell {
		let res: Cell
		this.cellList.map( getProperCell )
		return res

		function getProperCell( Cell ) {
			if ( Cell.contain( x, y ) ) {
				res = Cell
			}
		}
	}

	/**
	 * Data to export
	 */
	get clonedStoreWithoutCircularObjects(): DrawStore {
		let clonedStore: DrawStore = cloneDeep( drawStore )

		deleteCellList()

		clonedStore.panels.map( resolvePanel )

		return clonedStore

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
	}

	get __storeActiveElementsInstances__(): DrawStoreElementInstance[] {
		const res: DrawStoreElementInstance[] = this.storeActiveElements.map(
			get__instance__
		)
		return res

		function get__instance__( element ) {
			return element.__instance__
		}
	}

	getStoreElementsByPanelId( id: string ): any {
		const foundPanel = find( drawStore.panels, { id } )
		const res: any = !isNil( foundPanel ) ? foundPanel.elements : []
		return res
	}

	pointOnEmpty( point: Point2D ): boolean {
		const mostTopCell: Cell = this.getMostTopCellFocus( point )
		const res: boolean = mostTopCell === null
		return res
	}
}

export default new Getters()
