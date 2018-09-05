Draw.js is a basic 2d canvas graph library, which is under development currently.


## Features
There're many explicit interative examples describing the features of `draw` on its [official website](https://drawjs.github.io).


## Get started
### CDN
Add following script into your HTML header 
```html
<script src="https://drawjs.github.io/CDN/draw/draw.js"></script>
```
Add a canvas in html, like:
```html
<canvas id="myCanvas"></canvas>
```
Then you can just use it in script
```js
const canvas = document.getElementById( 'myCanvas' )
const draw = new window.Draw( canvas )
```

### Node.js
It also supports Node.js
```bash
npm install ts-draw --save-dev
```
Next import it with
```js
require( 'ts-draw' )
```
or
```js
import 'ts-draw'
```


## Example
### [Data-Sandboxie](https://github.com/drawjs/data-sandboxie)
An interactive graph for multi-level data combination, being used in company's commercial product. Here is a [demo](https://drawjs.github.io/CDN/data-sandboxie/example/index.html).
[![example image](https://drawjs.github.io/CDN/data-sandboxie/example.png)](https://drawjs.github.io/CDN/data-sandboxie/example/index.html)



## Future
Draw.js is still under development now. It will support more elements and more awesome features in the future. Let's look forward to it. And if you had any questions or advices, you could submit it in issues.
