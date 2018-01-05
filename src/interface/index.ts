import { Cell } from 'model/index'


/**
 * sync to schema>SchemaDrawStoreWithoutInstance
 */
export interface DrawStoreWithoutInstance {
	activePanelId: string,
	panels: DrawStorePanelWithoutInstance[]
}


export interface DrawStorePanelWithoutInstance {
	id: string,
	name: string,
	elements: DrawStoreElementWithoutInstance[]
}

export interface DrawStoreElementWithoutInstance {
	_draw?: any,
	id: string,
	type: string,
	top: number,
	left: number,
	width: number,
	height: number,
	fill: string,
	angle: number,
	points: Point[],
	draggable: boolean,
	isSelected: boolean,
}

export interface DrawStoreElementInstance extends DrawStoreElementWithoutInstance {

}


export interface DrawStore extends DrawStoreWithoutInstance  {
	panels: DrawStorePanel[]
}

export interface DrawStorePanel extends DrawStorePanelWithoutInstance {
	elements: DrawStoreElement[]
}

export interface DrawStoreElement extends DrawStoreElementWithoutInstance {
	__instance__: DrawStoreElementInstance
}


export interface Point {
	x: number,
	y: number,
}
