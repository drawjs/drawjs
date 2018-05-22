const draw = new Draw( document.getElementById( "canvas" ) )

const segment1 = draw.addElement( 'segment', {
	x: 100,
	y: 100
} )

const segment2 = draw.addElement( 'segment', {
	x: 200,
	y: 200
} )

const instance1 = draw.addElement( "orthogonal-line", {
	showArrow: true,
	startSegment: segment1,
	endSegment: segment2,
	corners: [
		{
			x: 200,
			y: 100
		}
	],
	points: [
		/**
		 * One line, two points
		 */
		// {
		// 	x: 100,
		// 	y: 100
		// },
		// {
		// 	x: 200,
		// 	y: 100
		// },

		/**
		 * Two line - Horizontal
		 */
		// {
		// 	x: 100,
		// 	y: 100
		// },
		// {
		// 	x: 200,
		// 	y: 100
		// },
		// {
		// 	x: 200,
		// 	y: 200
		// },


		/**
		 * Two line - Vertical
		 */
		// {
		// 	x: 100,
		// 	y: 100
		// },
		// {
		// 	x: 100,
		// 	y: 200
		// },
		// {
		// 	x: 200,
		// 	y: 200
		// },



		/**
		 * Horizontal
		 */
		// {
		// 	x: 100,
		// 	y: 100
		// },
		// {
		// 	x: 200,
		// 	y: 100
		// },
		// {
		// 	x: 300,
		// 	y: 300
		// },

		// {
		// 	x: 300,
		// 	y: 400
		// },
		// {
		// 	x: 500 ,
		// 	y: 500
		// },


		/**
		 * Vertical
		 */
		// {
		// 	x: 100,
		// 	y: 100
		// },
		// {
		// 	x: 100,
		// 	y: 300
		// },
		// {
		// 	x: 200,
		// 	y: 300
		// },
		// {
		// 	x: 600,
		// 	y: 100
		// },


		/**
		 * Test
		 */
		// {
		// 	x: 100,
		// 	y: 500
		// },
		// {
		// 	x: 500,
		// 	y: 500
		// },
		// {
		// 	x: 600,
		// 	y: 10
		// },
		// {
		// 	x: 500,
		// 	y: 10
		// },
		// {
		// 	x: 500,
		// 	y: 100
		// }


	]
} )


draw.render()
