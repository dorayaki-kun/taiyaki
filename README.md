# taiyaki

## Overview

`taiyaki` is a lightweight library of WebGL.

The origin of the name is the famous song in Japan.

## Example

``` js
var taiyaki = require( 'taiyaki' );
var Context = taiyaki.RenderingContext;

var ctx = new Context( 'canvas' );

ctx.createProgram( [ 'vs', 'fs' ] );

ctx.bindVbos([
  { name: 'positions', value: positions, stride: 3 },
  { name: 'colors',    value: colors,    stride: 4 },
  { name: 'normals',   value: normals,   stride: 3 },
]);

ctx.bindIbo( indexes );

ctx.toggleDepthFunc( true );
ctx.depthFunc();

...

ctx.bindUniforms( [
  { name: 'mvpMatrix',      type: 'matrix4fv', value: mvpMatrix },
  { name: 'invMatrix',      type: 'matrix4fv', value: invMatrix },
  { name: 'lightDirection', type: '3fv',       value: lightDirection },
  { name: 'eyePosition',    type: '3fv',       value: eyePosition },
  { name: 'centerPoint',    type: '3fv',       value: centerPosition },
  { name: 'ambientColor',   type: '4fv',       value: ambientColor },
]);

ctx.clear( { r: 0.3, g: 0.3, b:0.3, a: 1 }, 1.0 );
ctx.viewport( { x: 0, y: 0, width: 512, height: 512 } );

ctx.drawElements( ctx.gl.TRIANGLES, indexes.length );
```

## Licence

The MIT License (MIT) Copyright (c) 2015 dorayaki-kun
