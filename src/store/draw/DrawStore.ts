import { DRAW_STORE_PANEL_DEFAULT_NAME } from "../../store/constant/index"
import { generateUniqueId } from "../../util/index"
import Selector from '../../model/tool/Selector';
import Interaction from '../../core/interaction';
import Grid from '../../model/tool/Grid';
import Renderer from '../../model/tool/Renderer';
import ViewPort from '../../model/tool/ViewPort';
import Draw from '../../Draw';
import MiniMap from '../../model/tool/MiniMap';
import TestUtils from '../../shared/TestUtils';

export default class DrawStore {
	activePanelId = null

	panels = [
		{
			id      : generateUniqueId(),
			name    : DRAW_STORE_PANEL_DEFAULT_NAME,
			elements: []
		}
	]

	/**
	 * Cells collection for sorting visual level,
	 * the more end, the more top
	 */
	cellList = []

	draw: Draw = null

	canvas: HTMLCanvasElement = null

	viewPort: ViewPort = null

	renderer: Renderer = null

	selector: Selector = null

	interaction: Interaction = null

	miniMap: MiniMap = null

	grid: Grid = null

	testUtils: TestUtils = null
}

