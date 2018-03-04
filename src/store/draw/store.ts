import { DRAW_STORE_PANEL_DEFAULT_NAME } from "store/constant/index"
import { generateUniqueId } from "../../util/index";

let drawStore: DrawStore = {
	activePanelId: null,

	panels: [
		{
			id      : generateUniqueId(),
			name    : DRAW_STORE_PANEL_DEFAULT_NAME,
			elements: []
		}
	],

	/**
	 * Cells collection for sorting visual level,
	 * the more end, the more top
	 */
	cellList: [],

	draw: null,

	canvas: null,

	selector: null,

	interaction: null,


}

export default drawStore
