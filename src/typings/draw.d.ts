/**
 * sync to schema>SchemaDrawStoreWithoutInstance
 */
interface DrawStoreWithoutInstance {
	activePanelId: string
	panels: DrawStorePanelWithoutInstance[]
}

interface DrawStorePanelWithoutInstance {
	id: string
	name: string
	elements: DrawStoreElementWithoutInstance[]
}

interface DrawStoreElementWithoutInstance {
	draw?: any
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
	shouldSelect: boolean
}

interface DrawStoreElementInstance extends DrawStoreElementWithoutInstance {}

interface DrawStore extends DrawStoreWithoutInstance {
	cellList: any[]
	panels: DrawStorePanel[]
	draw: any,
	canvas: HTMLCanvasElement
	viewPort: any,
	selector: any,
	interaction: any,
}

interface DrawStorePanel extends DrawStorePanelWithoutInstance {
	elements: DrawStoreElement[]
}

interface DrawStoreElement extends DrawStoreElementWithoutInstance {
	__instance__: DrawStoreElementInstance
}
