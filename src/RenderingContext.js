'use strict';
class RenderingContext {
  constructor( id ) {
    const canvas = document.getElementById( id );
    this.canvas = canvas;
    this.gl = canvas.getContext( 'webgl' ) ||
                canvas.getContext( 'experimental-webgl' );
  }

  createProgram( ids ) {
    let gl      = this.gl;
    let program = gl.createProgram();

    ids.forEach( ( id ) => {
      gl.attachShader( program, this.createShader( id ) );
    } );

    gl.linkProgram( program );

    if ( !gl.getProgramParameter( program, gl.LINK_STATUS ) ) {
      console.error( gl.getProgramInfoLog( program ) );
    }

    return program;
  }

  useProgram( program ) {
    this.gl.useProgram( program );
  }

  createShader( id ) {
    let gl     = this.gl;
    let source = document.getElementById( id );
    let shader;

    switch ( source.type ) {
    case 'x-shader/x-vertex':
      shader = gl.createShader( gl.VERTEX_SHADER );
      break;
    case 'x-shader/x-fragment':
      shader = gl.createShader( gl.FRAGMENT_SHADER );
      break;
    default :
      console.error( 'The shader type is not an accepted value.' );
    }

    gl.shaderSource( shader, source.text );
    gl.compileShader( shader );

    if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {
      console.error( gl.getShaderInfoLog( shader ) );
    }

    return shader;
  }

  bindFramebuffer( frameBuffer ) {
    this.gl.bindFramebuffer( this.gl.FRAMEBUFFER, frameBuffer );
  }

  createFrameBuffer( width, height ) {
    let gl = this.gl;
    let frameBuffer = gl.createFramebuffer();

    gl.bindFramebuffer( gl.FRAMEBUFFER, frameBuffer);

    let renderBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer( gl.RENDERBUFFER, renderBuffer );

    gl.renderbufferStorage( gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height );
    gl.framebufferRenderbuffer(
      gl.FRAMEBUFFER,
      gl.DEPTH_ATTACHMENT,
      gl.RENDERBUFFER,
      renderBuffer
    );

    let texture = this.createFrameBufferTexture( width, height );
    gl.bindRenderbuffer( gl.RENDERBUFFER, null );
    gl.bindFramebuffer( gl.FRAMEBUFFER, null );

    return {value : frameBuffer, renderbuffer : renderBuffer, texture : texture};
  }

  createFrameBufferTexture( width, height ) {
    let gl = this.gl;
    let texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      width,
      height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null);

    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );

    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT );
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0
    );

    gl.bindTexture( gl.TEXTURE_2D, null );

    return texture;
  }

  bindVbos( program, vboAttribs ) {
    vboAttribs.forEach( ( vboAttrib ) => {
      this.bindVbo( program, vboAttrib );
    });
  }

  bindVbo( program, vboAttrib ) {
    let gl       = this.gl;
    let location = gl.getAttribLocation( program, vboAttrib.name );
    gl.bindBuffer( gl.ARRAY_BUFFER, this.createVbo( vboAttrib.value ) );
    gl.enableVertexAttribArray( location );
    gl.vertexAttribPointer( location, vboAttrib.stride, gl.FLOAT, false, 0, 0 );
  }

  createVbo( value ) {
    let gl  = this.gl;
    let vbo = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vbo );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( value ), gl.STATIC_DRAW );
    gl.bindBuffer( gl.ARRAY_BUFFER, null );
    return vbo;
  }

  bindIbo( index ) {
    let gl  = this.gl;
    let ibo = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, ibo );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Int16Array( index ), gl.STATIC_DRAW );
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null );
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, ibo );
  }

  bindTexture( texture, slot ) {
    let gl = this.gl;
    gl.activeTexture( gl.TEXTURE0 + slot );
    gl.bindTexture( gl.TEXTURE_2D, texture );
  }

  enable( cap ) {
    this.gl.enable( cap );
  }

  disable( cap ) {
    this.gl.disable( cap );
  }

  toggleCulFace( enable ) {
    let gl = this.gl;
    if ( enable ) {
      gl.enable( gl.CULL_FACE );
    } else {
      gl.disable( gl.CULL_FACE );
    }
  }

  toggleDepthFunc( enable ) {
    let gl = this.gl;
    if ( enable ) {
      gl.enable( gl.DEPTH_TEST );
    } else {
      gl.disable( gl.DEPTH_TEST );
    }
  }

  depthFunc() {
    let gl = this.gl;
    gl.depthFunc( gl.LEQUAL );
  }

  bindUniforms( program, uniformAttribs ) {
    uniformAttribs.forEach( ( uniformAttrib ) => {
      this.bindUniform( program, uniformAttrib );
    });
  }

  bindUniform( program, uniformAttrib ) {
    let gl = this.gl;
    let {name, type, value} = uniformAttrib;
    let location = gl.getUniformLocation( program, name );

    switch ( type ) {
    case 'matrix4fv':
      gl.uniformMatrix4fv( location, false, value );
      break;
    case '4fv':
      gl.uniform4fv( location, value );
      break;
    case '3fv':
      gl.uniform3fv( location, value );
      break;
    case '2fv':
      gl.uniform2fv( location, value );
      break;
    case '1fv':
      gl.uniform1fv( location, value );
      break;
    case '1f':
      gl.uniform1f( location, value );
      break;
    case '1iv':
      gl.uniform1iv( location, value );
      break;
    case '1i':
      gl.uniform1i( location, value );
      break;
    default:
    }
  }

  clear( color, depth ) {
    let gl = this.gl;
    let flag = gl.COLOR_BUFFER_BIT;

    gl.clearColor( color.r, color.g, color.b, color.a );

    if ( depth ) {
      gl.clearDepth( depth );
      flag = flag | gl.DEPTH_BUFFER_BIT;
    }

    gl.clear( flag );
  }

  viewport( viewport ) {
    this.gl.viewport(
      viewport.x,
      viewport.y,
      viewport.width,
      viewport.height);
  }

  drawArrays( mode, count, first = 0 ) {
    let gl = this.gl;
    gl.drawArrays( mode, first, count );
  }

  drawElements( mode, count, offset = 0 ) {
    let gl = this.gl;
    gl.drawElements( mode, count, gl.UNSIGNED_SHORT, offset );
  }
}

export {RenderingContext};
