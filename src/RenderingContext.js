'use strict';
class RenderingContext {
  constructor( canvas ) {
    this.canvas  = canvas;
    this.gl      = canvas.getContext( 'webgl' ) ||
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

  bindVbos( vboAttribs ) {
    vboAttribs.forEach( ( vboAttrib ) => {
      this.bindVbo( vboAttrib.name, vboAttrib.vertices, vboAttrib.stride );
    });
  }

  bindVbo( program, vboAttrib ) {
    let gl       = this.gl;
    let location = gl.getAttribLocation( program, vboAttrib.name );
    gl.bindBuffer( gl.ARRAY_BUFFER, this.createVbo( vboAttrib.value ) );
    gl.enableVertexAttribArray( location );
    gl.vertexAttribPointer( location, vboAttrib.stride, gl.FLOAT, false, 0, 0 );
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

  enable( cap ) {
    this.gl.enable( cap );
  }

  disable( cap ) {
    this.gl.disable( cap );
  }

  depthFunc( type ) {
    this.gl.depthFunc( type );
  }

  bindUniforms( uniformAttribs ) {
    uniformAttribs.forEach( ( uniformAttrib ) =>
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
