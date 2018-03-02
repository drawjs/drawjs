/**
 * sync to schema>SchemaDrawStoreWithoutInstance
 */
interface DrawStoreWithoutInstance {
	activePanelId: string
	panels: DrawStorePanelWithoutInstance[],
	cellList: any[],
	canvas: HTMLCanvasElement
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
	isSelected: boolean
}

interface DrawStoreElementInstance
	extends DrawStoreElementWithoutInstance {}

interface DrawStore extends DrawStoreWithoutInstance {
	panels: DrawStorePanel[],
}

interface DrawStorePanel extends DrawStorePanelWithoutInstance {
	elements: DrawStoreElement[]
}

interface DrawStoreElement extends DrawStoreElementWithoutInstance {
	__instance__: DrawStoreElementInstance
}
