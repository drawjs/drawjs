export function renderHightlightedPath(
	ctx: CanvasRenderingContext2D,
	path2d: Path2D
) {
	ctx.strokeStyle = "yellow"
	ctx.lineWidth = 1
	ctx.stroke( path2d )
}
