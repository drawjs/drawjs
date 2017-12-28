export interface DrawStore {
	data: {
		currentPanelIndex: number
		panels: DrawStorePanel[]
		setting?: any
	}
}

export interface DrawStorePanel {
	name: string,
	elements: any[]
}

export interface DrawStoreElement {
	type: string,
	id: number,
	top: number,
	left: number,
	width: number,
	height: number,
	fill?: string,
	angle?: string,
	draggable?: boolean,
}

