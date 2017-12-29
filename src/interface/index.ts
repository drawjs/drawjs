import { Cell } from 'model/index'

export interface DrawStore {
	activePanelId: string
	panels: DrawStorePanel[]
	// setting?: any
}

export interface DrawStorePanel {
	id: string,
	name: string,
	elements: any[]
}

export interface DrawStoreElement {
	__instance__?: Cell,
	id: string,
	type: string,
	top: number,
	left: number,
	width: number,
	height: number,
	fill?: string,
	angle?: number,
	draggable?: boolean,
}

