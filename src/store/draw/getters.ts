import drawStore from "store/draw/store"
import { isNil, cloneDeep, find, includes } from "lodash"
import { Cell } from "../../model/index"
import Graph from "model/Graph"
import Selector from "../../model/tool/Selector"
import Draw from "Draw"
import selectionExcludingCellTypes from "../exclude/selectionExcludingCellTypes"
import ViewPort from '../../model/tool/ViewPort';
import EventKeyboard from '../../util/EventKeyboard';
import Interaction from "../../core/interaction";
import Grid from '../../model/tool/Grid';

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
	 * // Cell list
	 */
	get cellList(): Cell[] {
		return drawStore.cellList
	}

	get cellsShouldSelect(): Cell[] {
		const res: Cell[] = this.cellList.filter( shouldCellSelect )
		return res

		function shouldCellSelect( cell ): boolean {
			const { shouldSelect } = cell
			return shouldSelect === true
		}
	}

	get cellsShouldDrag(): Cell[] {
		const res: Cell[] = this.cellList.filter( shouldCellDrag )
		return res

		function shouldCellDrag( cell ): boolean {
			return cell.dragger.enable === true
		}
	}

	getMostTopCellFocused( { x, y }: Point2D ): Cell {
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
	 * // Draw
	 */
	get draw(): Draw {
		return drawStore.draw
	}

	/**
	 * // Canvas
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

	get canvasWidth(): number {
		return this.canvas.getBoundingClientRect().width
	}

	get canvasHeight(): number {
		return this.canvas.getBoundingClientRect().height
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
	 * // View port
	 */
	get viewPort(): ViewPort {
		return drawStore.viewPort
	}

	get zoom(): number {
		return this.viewPort.zoom
	}

	get pan(): Point2D {
		return this.viewPort.pan
	}

	get panX(): number {
		return this.pan.x
	}

	get panY(): number {
		return this.pan.y
	}

	/**
	 * // Selector
	 */
	get selector(): Selector {
		return drawStore.selector
	}
	get cellsInSelectorRigion(): Cell[] {
		const self = this
		const res: Cell[] = this.cellList.filter( shouldExclude ).filter( inRigion )

		function shouldExclude( { type }: Cell ): boolean {
			const res: boolean = !includes( selectionExcludingCellTypes, type )
			return res
		}
		function inRigion( cell: Graph ): boolean {
			const { rectContainer } = cell
			const {
				basicLeft,
				basicTop,
				basicWidth,
				basicHeight
			} = rectContainer
			const res: boolean = self.selector.rectInSelectionArea(
				basicLeft,
				basicTop,
				basicWidth,
				basicHeight
			)
			return res
		}

		return res
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
		const mostTopCell: Cell = this.getMostTopCellFocused( point )
		const res: boolean = isNil( mostTopCell )
		return res
	}



	/**
	 * // Interaction
	 */
	get interaction(): Interaction {
		return drawStore.interaction
	}

	get eventKeyboard(): EventKeyboard {
		return this.interaction.eventKeyboard
	}



	/**
	 * // Grid
	 */
	get grid(): Grid {
		return drawStore.grid
	}
}

export default new Getters()
