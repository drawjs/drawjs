/**
 * Rewrite CanvasRenderingContext2D to fix unrecognised overloaded methods related to 'Path2D'
 * Overloaded methods:
 * 1. boolean ctx.isPointInPath( path, x, y, [, fillRule] )
 * 2. void ctx.fill( path, [, fillRule] );
 */
export default interface CanvasRenderingContext2D extends Object, CanvasPathMethods {
	readonly canvas: HTMLCanvasElement
	fillStyle: string | CanvasGradient | CanvasPattern
	font: string
	globalAlpha: number
	globalCompositeOperation: string
	imageSmoothingEnabled: boolean
	lineCap: string
	lineDashOffset: number
	lineJoin: string
	lineWidth: number
	miterLimit: number
	msFillRule: CanvasFillRule
	shadowBlur: number
	shadowColor: string
	shadowOffsetX: number
	shadowOffsetY: number
	strokeStyle: string | CanvasGradient | CanvasPattern
	textAlign: string
	textBaseline: string
	mozImageSmoothingEnabled: boolean
	webkitImageSmoothingEnabled: boolean
	oImageSmoothingEnabled: boolean
	beginPath(): void
	clearRect( x: number, y: number, w: number, h: number ): void
	clip( fillRule?: CanvasFillRule ): void
	createImageData( imageDataOrSw: number | ImageData, sh?: number ): ImageData
	createLinearGradient(
		x0: number,
		y0: number,
		x1: number,
		y1: number
	): CanvasGradient
	createPattern(
		image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
		repetition: string
	): CanvasPattern
	createRadialGradient(
		x0: number,
		y0: number,
		r0: number,
		x1: number,
		y1: number,
		r1: number
	): CanvasGradient
	drawFocusIfNeeded( element: Element ): void
	drawImage(
		image:
			| HTMLImageElement
			| HTMLCanvasElement
			| HTMLVideoElement
			| ImageBitmap,
		dstX: number,
		dstY: number
	): void
	drawImage(
		image:
			| HTMLImageElement
			| HTMLCanvasElement
			| HTMLVideoElement
			| ImageBitmap,
		dstX: number,
		dstY: number,
		dstW: number,
		dstH: number
	): void
	drawImage(
		image:
			| HTMLImageElement
			| HTMLCanvasElement
			| HTMLVideoElement
			| ImageBitmap,
		srcX: number,
		srcY: number,
		srcW: number,
		srcH: number,
		dstX: number,
		dstY: number,
		dstW: number,
		dstH: number
	): void
	fill( fillRule?: CanvasFillRule ): void
	fill( path: Path2D, fillRule?: CanvasFillRule ): void
	fillRect( x: number, y: number, w: number, h: number ): void
	fillText( text: string, x: number, y: number, maxWidth?: number ): void
	getImageData( sx: number, sy: number, sw: number, sh: number ): ImageData
	getLineDash(): number[]
	isPointInPath( x: number, y: number, fillRule?: CanvasFillRule ): boolean
	isPointInPath(
		path: Path2D,
		x: number,
		y: number,
		fillRule?: CanvasFillRule
	): boolean
	measureText( text: string ): TextMetrics
	putImageData(
		imagedata: ImageData,
		dx: number,
		dy: number,
		dirtyX?: number,
		dirtyY?: number,
		dirtyWidth?: number,
		dirtyHeight?: number
	): void
	restore(): void
	rotate( angle: number ): void
	save(): void
	scale( x: number, y: number ): void
	setLineDash( segments: number[] ): void
	setTransform(
		m11: number,
		m12: number,
		m21: number,
		m22: number,
		dx: number,
		dy: number
	): void
	stroke( path?: Path2D ): void
	strokeRect( x: number, y: number, w: number, h: number ): void
	strokeText( text: string, x: number, y: number, maxWidth?: number ): void
	transform(
		m11: number,
		m12: number,
		m21: number,
		m22: number,
		dx: number,
		dy: number
	): void
	translate( x: number, y: number ): void
}
