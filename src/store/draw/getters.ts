import { isNil, cloneDeep, find, includes } from "lodash"
import { generateUniqueId, isNotNil } from "util/index"
import { Cell } from "../../model/index"
import Graph from "model/Graph"
import Selector from "../../model/tool/Selector"
import Draw from "Draw"
import selectionExcludingCellTypes from "../exclude/selectionExcludingCellTypes"
import ViewPort from "../../model/tool/ViewPort"
import EventKeyboard from "../../util/EventKeyboard"
import Interaction from "../../core/interaction"
import Grid from "../../model/tool/Grid"
import Renderer from "../../model/tool/Renderer"
import DrawStore from "./DrawStore"

export default class Getters {
	drawStore: DrawStore

	constructor( drawStore ) {
		this.drawStore = drawStore
	}

	get draw(): Draw {
		return this.drawStore.draw
	}

	/**
	 * Store without instances
	 */
	get storeActivePanelId(): string {
		return !isNil( this.drawStore.activePanelId ) ?
			this.drawStore.activePanelId :
			this.drawStore.panels.length > 0 ?
				this.drawStore.panels[ 0 ].id :
				null
	}

	get storeElementsIds(): string[] {
		let ids: string[]
		let cachedElements: DrawStoreElement[] = []

		if ( isNil( this.drawStore ) || isNil( this.drawStore.panels ) ) {
			return []
		}

		this.drawStore.panels.map( pushElementsToCachedElement )

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
		return this.drawStore.panels
	}

	generateDrawUniqueId(): string {
		const self = this
		let id: string = generateUniqueId()
		id = checkAndUpdateIdIfNeeded( id )

		function checkAndUpdateIdIfNeeded( id: string ) {
			return includes( self.storeElementsIds, id ) ?
				checkAndUpdateIdIfNeeded( generateUniqueId() ) :
				id
		}
		return id
	}

	/**
	 * // Cell list
	 */
	get cellList(): Cell[] {
		return this.drawStore.cellList
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
	 * // Canvas
	 */
	get canvas(): HTMLCanvasElement {
		return this.drawStore.canvas
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

	pointOnPath( point: Point2DInitial, path: Path2D ): boolean {
		const pointOnCurrentViewPort: Point2DCurrent = this.viewPort.transform(
			point
		)
		const { x, y }: Point2DCurrent = pointOnCurrentViewPort
		const isContain = this.ctx.isPointInPath( path, x, y )
		return isContain
	}

	/**
	 * Get real-time point on view port
	 */
	getPoint( event ): Point2DCurrent {
		const point: Point2DCurrent = {
			x: event.x - this.canvasLeft,
			y: event.y - this.canvasTop
		}
		return point
	}

	/**
	 * Get point on initial view port
	 */
	getInitialPoint( event ): Point2DInitial {
		const point: Point2DCurrent = this.getPoint( event )
		const res: Point2DInitial = this.viewPort.transformToInitial( point )
		return res
	}

	/**
	 * // View port
	 */
	get viewPort(): ViewPort {
		return this.drawStore.viewPort
	}

	get zoom(): number {
		return this.viewPort.zoom
	}

	get pan(): Point2D {
		return this.viewPort.pan
	}

	get panX(): number {
		return this.viewPort.pan.x
	}

	get panY(): number {
		return this.viewPort.pan.y
	}

	/**
	 *  Horizontal movement of zoomed view port
	 */
	get movementX(): number {
		return this.panX * this.zoom
	}

	/**
	 *  Vertical movement of zoomed view port
	 */
	get movementY(): number {
		return this.panY * this.zoom
	}

	/**
	 * // Renderer
	 */
	get renderer(): Renderer {
		return this.drawStore.renderer
	}

	/**
	 * // Selector
	 */
	get selector(): Selector {
		return this.drawStore.selector
	}
	get cellsInSelectorRigion(): Cell[] {
		const self = this
		return []
		// const res: Cell[] = this.cellList.filter( shouldExclude ).filter( inRigion )

		// function shouldExclude( { type }: Cell ): boolean {
		// 	const res: boolean = !includes( selectionExcludingCellTypes, type )
		// 	return res
		// }
		// function inRigion( cell: Graph ): boolean {
		// 	const { rectContainer } = cell
		// 	const {
		// 		basicLeft,
		// 		basicTop,
		// 		basicWidth,
		// 		basicHeight
		// 	} = rectContainer
		// 	const res: boolean = self.selector.rectInSelectionArea(
		// 		basicLeft,
		// 		basicTop,
		// 		basicWidth,
		// 		basicHeight
		// 	)
		// 	return res
		// }

		// return res
	}

	pointOnSelectionExcludingCells( point: Point2D ): boolean {
		let res: boolean = false
		const mostTopCell: Cell = this.getMostTopCellFocused( point )
		if ( isNotNil( mostTopCell ) ) {
			res = includes( selectionExcludingCellTypes, mostTopCell.type )
		}
		return res
	}

	pointOnCellSelected( point: Point2D ): boolean {
		let res: boolean = false
		const mostTopCell: Cell = this.getMostTopCellFocused( point )
		if ( isNotNil( mostTopCell ) ) {
			const { shouldSelect } = mostTopCell
			res = shouldSelect === true
		}
		return res
	}

	pointOnCellDeselected( point: Point2D ): boolean {
		let res: boolean = false
		const mostTopCell: Cell = this.getMostTopCellFocused( point )
		if ( isNotNil( mostTopCell ) ) {
			const { shouldSelect } = mostTopCell
			res = shouldSelect === false
		}
		return res
	}

	/**
	 * Data to export
	 */
	get clonedStoreWithoutCircularObjects(): DrawStore {
		let clonedStore: DrawStore = cloneDeep( this.drawStore )

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
		const foundPanel = find( this.drawStore.panels, { id } )
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
		return this.drawStore.interaction
	}

	get eventKeyboard(): EventKeyboard {
		return this.interaction.eventKeyboard
	}

	/**
	 * // Grid
	 */
	get grid(): Grid {
		return this.drawStore.grid
	}
}
