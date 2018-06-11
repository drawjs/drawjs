const draw = new Draw( document.getElementById( "canvas" ) )

const instance = draw.addElement( "circle", {
	x: 300,
	y: 300,
} )
draw.render()



function calcDefaultRate() {
	const r = 200

	let res = 0.3

	let recurTimes = 0

	recurToGetRes()

	console.log( 'result', res )

	function recurToGetRes() {
		if ( res.toString().length > 20 || recurTimes > 1500 ) {
			return
		}

		recurTimes++

		for ( let i = 1; i < 10; i++ ) {
			const potentialRes = +`${res}${i}`

			if ( i === 1 ) {
				const check = +`${res}${i}`

				if ( compare( check ).heightBiggerThanWidth ) {
					res = `${res}0`
					console.log( res )
					return recurToGetRes()
				}
			}

			if ( i < 9 ) {
				const check = +`${res}${i + 1}`

				if ( compare( check ).heightBiggerThanWidth ) {
					res = potentialRes
					console.log( res )
					return recurToGetRes()
				}
			}

			if ( i == 9 ) {
				const check = +`${res}${i}`

				if ( compare( check ).heightSmallerThanWidth ) {
					res = potentialRes
					console.log( res )
					return recurToGetRes()
				}
			}

		}


		function compare( potentialRes ) {
			const instance = draw.addElement( "circle", {
				x: 300,
				y: 300,
				defaultSegmentHandleLength: r * potentialRes
			} )
			const {bounds} = instance
			const {left, right, top, bottom} = instance.bounds
			const width = right - left
			const height = bottom - top
			return {
				heightBiggerThanWidth: height > width,
				equal: height === width,
				heightSmallerThanWidth: height < width,
			}
		}
	}
}
