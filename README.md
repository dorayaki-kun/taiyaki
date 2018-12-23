# taiyaki

[![](http://img.shields.io/npm/dm/taiyaki.svg)](https://www.npmjs.org/package/taiayaki)
[![Greenkeeper Enabledflat](https://badges.greenkeeper.io/dorayakikun/taiyaki.svg)](https://greenkeeper.io/)
[![CircleCI](https://circleci.com/gh/dorayakikun/taiyaki.svg?style=svg)](https://circleci.com/gh/dorayakikun/taiyaki)
[![npm version](https://badge.fury.io/js/taiyaki.svg)](https://www.npmjs.com/package/taiyaki)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## Overview

`taiyaki` is a lightweight library of WebGL.

The origin of the name is the famous song in Japan.

## Example

```js
import { RenderingContext } from 'taiyaki'

const ctx = new RenderingContext('canvas')

const program = ctx.createProgram(['vs', 'fs'])
ctx.useProgram(program)

ctx.bindVbos([
  { name: 'positions', value: positions, stride: 3 },
  { name: 'colors', value: colors, stride: 4 },
  { name: 'normals', value: normals, stride: 3 },
])

ctx.bindIbo(index)

ctx.toggleDepthFunc(true)
ctx.depthFunc()

// ...

ctx.bindUniforms([
  { name: 'mvpMatrix', type: 'matrix4fv', value: mvpMatrix },
  { name: 'invMatrix', type: 'matrix4fv', value: invMatrix },
  { name: 'lightDirection', type: '3fv', value: lightDirection },
  { name: 'eyePosition', type: '3fv', value: eyePosition },
  { name: 'centerPoint', type: '3fv', value: centerPosition },
  { name: 'ambientColor', type: '4fv', value: ambientColor },
])

ctx.clear({ r: 0.3, g: 0.3, b: 0.3, a: 1 }, 1.0)
ctx.viewport({ x: 0, y: 0, width: 512, height: 512 })

ctx.drawElements(ctx.gl.TRIANGLES, indexes.length)
```

## Licence

The MIT License (MIT) Copyright (c) 2015 dorayakikun
