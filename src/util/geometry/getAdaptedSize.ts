/**
 * Suppose that you're resizing incoming B box to A box,
 * with B box keeping the ratio of width and height 
 * 
 
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                                                           
@                                       @                                                           
@                                       @                                                           
@                                       @                                                           
@                                       @                                                           
@                                       @                                                           
@                                       @                                                           
@                                       @      @@@@@@@@@@@@@@@@@@                  @@@@@@@@@@@@@@@@@
@                                       @      @                @                  @               @
@                                       @      @                @                  @               @
@                                       @      @                @                  @               @
@                  B                    @      @                @                  @               @
@                                       @      @                @                  @               @
@                                       @      @                @                  @               @
@                                       @      @                @                  @@@@@@@@@@@@@@@@@
@                                       @      @        A       @         →        @       A       @
@                                       @      @                @                  @               @
@                                       @      @                @                  @               @
@                                       @      @                @                  @       B       @
@                                       @      @                @                  @               @
@                                       @      @                @                  @               @
@                                       @      @                @                  @               @
@                                       @      @                @                  @               @
@                                       @      @                @                  @               @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@      @@@@@@@@@@@@@@@@@@                  @@@@@@@@@@@@@@@@@

 * @param width the width of A box
 * @param height the height of A box 
 * @param incomingWidth the width of incoming B box
 * @param incomingHeight the height of incoming B box
 */
export default function getAdaptedSize(
	width: number,
	height: number,
	incomingWidth: number,
	incomingHeight: number
) {
	let res = { width, height }
	const xRatio = width / incomingWidth
	const yRatio = height / incomingHeight
	let ratio = xRatio

	if ( xRatio > 1 && yRatio > 1 ) {
		res.width = incomingWidth
		res.height = incomingHeight
		return res
	} else {
		ratio = xRatio < yRatio ? xRatio : yRatio
	}

	res.width = incomingWidth * ratio
	res.height = incomingHeight * ratio

	return res
}
