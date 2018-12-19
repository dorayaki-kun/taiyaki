"use strict";

const mat4 = require("gl-matrix-mat4");
const quat = require("gl-matrix-quat");
const { RenderingContext } = require("../build/src/RenderingContext");

function createSphere(widthSegment, heightSegment, radius, rgba) {
  const position = [];
  const normal = [];
  const color = [];
  const textureCoord = [];
  const index = [];

  for (let i = 0; i <= widthSegment; i++) {
    const r = (Math.PI / widthSegment) * i;
    const ry = Math.cos(r);
    const rr = Math.sin(r);
    for (let j = 0; j <= heightSegment; j++) {
      const tr = ((Math.PI * 2) / heightSegment) * j;
      const tx = rr * radius * Math.cos(tr);
      const ty = ry * radius;
      const tz = rr * radius * Math.sin(tr);
      const rx = rr * Math.cos(tr);
      const rz = rr * Math.sin(tr);
      position.push(tx, ty, tz);
      normal.push(rx, ry, rz);
      color.push(rgba[0], rgba[1], rgba[2], rgba[3]);
      textureCoord.push(1 - (1 / heightSegment) * j, (1 / widthSegment) * i);
    }
  }
  let r = 0;
  for (let k = 0; k < widthSegment; k++) {
    for (let l = 0; l < heightSegment; l++) {
      r = (heightSegment + 1) * k + l;
      index.push(r, r + 1, r + heightSegment + 2);
      index.push(r, r + heightSegment + 2, r + heightSegment + 1);
    }
  }
  return {
    position,
    normal,
    color,
    textureCoord,
    index
  };
}

function setupVbos(ctx, lightProgram, sphere) {
  ctx.bindVbos(lightProgram, [
    { name: "position", value: sphere.position, stride: 3 },
    { name: "normal", value: sphere.normal, stride: 3 },
    { name: "color", value: sphere.color, stride: 4 }
  ]);

  ctx.bindIbo(sphere.index);
}

function initRender(ctx, frameBufferAttr, bufferSize) {
  ctx.bindFramebuffer(frameBufferAttr.value);
  ctx.clear({ r: 0.3, g: 0.3, b: 0.3, a: 1 }, 1);
  ctx.viewport({
    x: 0,
    y: 0,
    width: bufferSize,
    height: bufferSize
  });
}

function setupUniforms(ctx, lightProgram, qt) {
  const vMatrix = createVMatrix(qt);
  const pMatrix = createPMatrix();
  const vpMatrix = createVpMatrix(vMatrix, pMatrix);
  const mMatrix = mat4.identity(mat4.create());

  const mvpMatrix = createMvpMatrix(mMatrix, vpMatrix);
  const invMatrix = createInvMatrix(mMatrix);
  const light = [1, 1, 1];
  ctx.bindUniforms(lightProgram, [
    { name: "mvpMatrix", type: "matrix4fv", value: mvpMatrix },
    { name: "invMatrix", type: "matrix4fv", value: invMatrix },
    { name: "light", type: "3fv", value: light }
  ]);
}

function convertToVec3(dst, q, p) {
  const r = quat.create();
  quat.invert(r, q);

  const rp = quat.create();
  quat.multiply(rp, r, p);

  const rpq = quat.create();
  quat.multiply(rpq, rp, q);

  dst[0] = rpq[0];
  dst[1] = rpq[1];
  dst[2] = rpq[2];
}

function createVMatrix(qt) {
  const cx = 1 * Number(Math.sin(0));
  const cz = 1 * Number(Math.cos(0));

  const eyePosition = quat.create();
  eyePosition[0] = cx;
  eyePosition[1] = 0;
  eyePosition[2] = cz;

  const centerPosition = [0.0, 0.0, 0.0];

  const cameraUp = quat.create();
  cameraUp[0] = 0;
  cameraUp[1] = 1;
  cameraUp[2] = 0;

  const rotatedEyePosition = new Array(3);
  convertToVec3(rotatedEyePosition, qt, eyePosition);

  const rotatedCameraUp = new Array(3);
  convertToVec3(rotatedCameraUp, qt, cameraUp);

  const vMatrix = mat4.identity(mat4.create());
  mat4.lookAt(vMatrix, rotatedEyePosition, centerPosition, rotatedCameraUp);

  return vMatrix;
}

function createPMatrix() {
  const pMatrix = mat4.identity(mat4.create());
  mat4.perspective(pMatrix, 45, 1, 0.1, 10);
  return pMatrix;
}

function createVpMatrix(vMatrix, pMatrix) {
  const vpMatrix = mat4.identity(mat4.create());
  mat4.multiply(vpMatrix, pMatrix, vMatrix);
  return vpMatrix;
}

function createMvpMatrix(mMatrix, vpMatrix) {
  const mvpMatrix = mat4.identity(mat4.create());
  mat4.multiply(mvpMatrix, vpMatrix, mMatrix);
  return mvpMatrix;
}

function createInvMatrix(mMatrix) {
  const invMatrix = mat4.identity(mat4.create());
  mat4.invert(invMatrix, mMatrix);
  return invMatrix;
}

function initOrthoRender(canvas, ctx) {
  ctx.bindFramebuffer(null);
  ctx.clear({ r: 0.3, g: 0.3, b: 0.3, a: 1 }, 1);
  ctx.viewport({
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height
  });
}

function setupOrthoVbos(ctx, program) {
  const position = [-1, 1, 0, 1, 1, 0, -1, -1, 0, 1, -1, 0];

  const textureCoord = [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0];

  const index = [0, 1, 2, 2, 1, 3];

  ctx.bindVbos(program, [
    { name: "position", value: position, stride: 3 },
    { name: "textureCoord", value: textureCoord, stride: 2 }
  ]);
  ctx.bindIbo(index);
}

function setupuOrthoUniforms(canvas, ctx, program, hWeight, vWeight) {
  const vMatrix = createOrthoVmatrix();
  const pMatrix = createOrthoPmatrix();
  const orthoMatrix = createOrthoMatrix(vMatrix, pMatrix);
  ctx.bindUniforms(program, [
    { name: "orthoMatrix", type: "matrix4fv", value: orthoMatrix },
    { name: "texture", type: "1i", value: 0 },
    { name: "resolution", type: "2fv", value: [canvas.width, canvas.height] },
    { name: "hWeight", type: "1fv", value: hWeight },
    { name: "vWeight", type: "1fv", value: vWeight }
  ]);
}

function createOrthoVmatrix() {
  const vMatrix = mat4.identity(mat4.create());
  mat4.lookAt(vMatrix, [0, 0, 0.5], [0, 0, 0], [0, 1, 0]);
  return vMatrix;
}

function createOrthoPmatrix() {
  const pMatrix = mat4.identity(mat4.create());
  mat4.ortho(pMatrix, -1, 1, 1, -1, 0.1, 1);
  return pMatrix;
}

function createOrthoMatrix(vMatrix, pMatrix) {
  const orthoMatrix = mat4.identity(mat4.create());
  mat4.multiply(orthoMatrix, pMatrix, vMatrix);
  return orthoMatrix;
}

function calculateQuat(e, canvas, qt) {
  const cw = canvas.width;
  const ch = canvas.height;
  const wh = 1 / Math.sqrt(cw * cw + ch * ch);

  const x = e.clientX - canvas.offsetLeft - cw * 0.5;
  const y = e.clientY - canvas.offsetTop - ch * 0.5;
  const vector = Math.sqrt(x * x + y * y);

  const theta = vector * 2.0 * Math.PI * wh;

  const axis = [y / vector, x / vector, 0];
  quat.setAxisAngle(qt, axis, theta);
}

function render(
  canvas,
  ctx,
  hWeight,
  vWeight,
  frameBufferAttr,
  bufferSize,
  qt
) {
  const lightProgram = ctx.createProgram(["light_vs", "light_fs"]);
  ctx.useProgram(lightProgram);

  const sphere = createSphere(64, 64, 0.3, [0, 1, 0, 1]);

  setupVbos(ctx, lightProgram, sphere);
  initRender(ctx, frameBufferAttr, bufferSize);
  setupUniforms(ctx, lightProgram, qt);
  ctx.drawElements(ctx.gl.TRIANGLES, sphere.index.length);

  ctx.bindTexture(frameBufferAttr.texture, 0);
  initOrthoRender(canvas, ctx);
  const program = ctx.createProgram(["vs", "fs"]);
  ctx.useProgram(program);
  setupOrthoVbos(ctx, program);
  setupuOrthoUniforms(canvas, ctx, program, hWeight, vWeight);
  ctx.drawElements(ctx.gl.TRIANGLES, 6);

  requestAnimationFrame(() => {
    render(canvas, ctx, hWeight, vWeight, frameBufferAttr, bufferSize, qt);
  });
}

const main = () => {
  const ctx = new RenderingContext("canvas");

  const canvas = document.getElementById("canvas");

  ctx.toggleDepthFunc(true);
  ctx.depthFunc();

  const bufferSize = 512;
  const frameBufferAttr = ctx.createFrameBuffer(bufferSize, bufferSize);

  const qt = quat.identity(quat.create());
  document.addEventListener("mousemove", e => calculateQuat(e, canvas, qt));

  // kernel
  const hWeight = [1.0, 0.0, -1.0, 2.0, 0.0, -2.0, 1.0, 0.0, -1.0];
  const vWeight = [1.0, 2.0, 1.0, 0.0, 0.0, 0.0, -1.0, -2.0, -1.0];

  render(canvas, ctx, hWeight, vWeight, frameBufferAttr, bufferSize, qt);
};

window.onload = main;
