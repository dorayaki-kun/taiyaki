'use strict';
class RenderingContext {
  constructor( id ) {
    let canvas   = document.getElementById( id );
    this.gl      = canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' );
    this.program = null;

    let canvasSize = Math.min( window.innerWidth, window.innerHeight );
    canvas.width  = canvasSize;
    canvas.height = canvasSize;
  }

  createProgram( ids ) {
    let gl      = this.gl;
    let program = gl.createProgram();
    ids.map( ( id ) => {
      gl.attachShader( program, this.createShader( id ) );
    } );

    gl.linkProgram( program );

    if ( gl.getProgramParameter( program, gl.LINK_STATUS ) ) {
      gl.useProgram( program );
      this.program = program;
    } else {
      console.error( gl.getProgramInfoLog( program ) );
    }
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

  bindVbos( vboAttribs ) {
    vboAttribs.map( ( vboAttrib ) => {
      this.bindVbo( vboAttrib.name, vboAttrib.vertices, vboAttrib.stride );
    });
  }

  bindVbo( name, vertices, stride ) {
    let gl       = this.gl;
    let program  = this.program;
    let location = gl.getAttribLocation( program, name );
    gl.bindBuffer( gl.ARRAY_BUFFER, this.createVbo( vertices ) );
    gl.enableVertexAttribArray( location );
    gl.vertexAttribPointer( location, stride, gl.FLOAT, false, 0, 0 );
  }

  createVbo( vertices ) {
    let gl  = this.gl;
    let vbo = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vbo );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );
    gl.bindBuffer( gl.ARRAY_BUFFER, null );
    return vbo;
  }

  bindIbo( indexes ) {
    let gl  = this.gl;
    let ibo = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, ibo );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Int16Array( indexes ), gl.STATIC_DRAW );
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null );
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, ibo );
  }

  enableDepthTest() {
    let gl = this.gl;
    gl.enable( gl.DEPTH_TEST );
    gl.depthFunc( gl.LEQUAL );
  }

  // uniform bind
  bindUniforms( uniformAttribs ) {
    uniformAttribs.map( ( uniformAttrib ) =>
                            this.bindUniform( uniformAttrib.name,
                                              uniformAttrib.type,
                                              uniformAttrib.value ) );
  }

  bindUniform( name, type, value ) {
    let gl = this.gl;
    let location = gl.getUniformLocation( this.program, name );

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

  clear( color, viewport, clearDepth = 1.0 ) {
    let gl = this.gl;

    if ( color ) {
      gl.clearColor( color.r, color.g, color.b, color.a );
    } else {
      gl.clearColor( 0.3, 0.3, 0.3, 1.0 );
    }

    if ( viewport ) {
      gl.viewport( viewport.x, viewport.y, viewport.width, viewport.height );
    } else {
      gl.viewport( 0, 0, this.canvas.width, this.canvas.height );
    }

    gl.clearDepth( clearDepth );
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
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

exports = {RenderingContext};
