export function averagePerformanceTest( performanceTestFn, count = 1 ) {
	let sum = 0
	for ( let i = 0; i < count; i++ ) {
		sum = sum + performanceTestFn()
	}
	return sum / count
}
