export default function ( cell, maxStep = 100 ) {
	let res = null
	const speed = 1
	let mockEvent = {
		x: 0,
		y: 0
	}
	const start = performance.now()
	let end = null

	cell.dragger.enable = true;
	cell.dragger.start( mockEvent )

	for ( let i = 0; i <= maxStep; i++ ) {
		if ( i < maxStep ) {
			mockEvent = {
				x: i * speed,
				y: i * speed
			}

			cell.dragger.dragging( mockEvent )
		}

		if ( i === maxStep ) {
			cell.dragger.stop( mockEvent )
			end = performance.now()
			res = end - start
		}
	}

	return res
}
