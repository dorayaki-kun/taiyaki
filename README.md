# taiyaki

## Overview

`taiyaki` is a lightweight library of WebGL.

The origin of the name is the famous song in Japan.

## Example

``` js
var Context = require( 'taiyaki' );

var context = new Context( 'canvas' );

context.createProgram( [ 'vs', 'fs' ] );

context.bindVbos([
  { name: 'positions', vertices: positions, stride: 3 },
  { name: 'colors',    vertices: colors,    stride: 4 },
  { name: 'normals',   vertices: normals,   stride: 3 },
]);

context.bindIbo( indexes );

context.enable( context.gl.DEPTH_TEST );
context.depthFunc( context.gl.LEQUAL );

...

context.bindUniforms( [
  { name: 'mvpMatrix',      type: 'matrix4fv', value: mvpMatrix },
  { name: 'invMatrix',      type: 'matrix4fv', value: invMatrix },
  { name: 'lightDirection', type: '3fv',       value: lightDirection },
  { name: 'eyePosition',    type: '3fv',       value: eyePosition },
  { name: 'centerPoint',    type: '3fv',       value: centerPosition },
  { name: 'ambientColor',   type: '4fv',       value: ambientColor },
]);

context.clear();

context.drawElements( context.gl.TRIANGLES, indexes.length );
```

## Licence

The MIT License (MIT) Copyright (c) 2015 dorayaki-kun
