export default function(): string {
	var result, i, j
	result = ''
	const topic = "Draw"
	for( j = 0; j < 32; j++ ) {
	  if( j == 8 || j == 12 || j == 16 || j == 20 )
		result = result + '-'
	  i = Math.floor( Math.random() * 16 ).toString( 16 ).toUpperCase()
	  result = result + i
	}
	return `${ topic }-${ result }-${ btoa(  '' +  ( new Date() ).getTime() ) }`
}
