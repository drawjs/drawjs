const draw = new Draw( document.getElementById( "canvas" ) )

const instance1 = draw.addElement( "orthogonal-line", {
	points: [
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
		{
			x: 100,
			y: 100
		},
		{
			x: 100,
			y: 200
		},
		{
			x: 200,
			y: 200
		},



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
		// 	x: 200,
		// 	y: 200
		// },
		// {
		// 	x: 600,
		// 	y: 100
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


	]
} )


draw.render()
