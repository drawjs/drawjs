const draw = new Draw( document.getElementById( "canvas" ) )

const instance1 = draw.addElement( "rect", {
	left  : 100,
	top   : 200,
	width : 300,
	height: 400
} )

draw.render()

// // Skip
// function loadDraw(callback){loadScript("https://terry-su.github.io/CDN/Draw/draw.js",callback);function loadScript(src,callback){const script=document.createElement("script");script.src=src;script.onload=callback||function(){};document.head.appendChild(script)}}
// function appendFitCanvasToBody(){document.body.style.height='100%';document.documentElement.style.height='100%';const canvas=document.createElement('canvas');const info=document.body.getBoundingClientRect();console.log(info.width,info.height);canvas.setAttribute('width',info.width);canvas.setAttribute('height',info.height);document.body.appendChild(canvas);return canvas}

// loadDraw( () => {
// 	const canvas = appendFitCanvasToBody()
// 	const draw = new window.Draw( canvas )
// 	const rect = draw.addElement( "rect", {
// 		left  : 50,
// 		top   : 50, 
// 		width : 50,
// 		height: 50
// 	} )

// 	draw.render()
// } )
