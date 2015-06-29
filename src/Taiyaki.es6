'use strict';
export class Taiyaki {
  constructor( id ) {
    let canvas   = document.getElementById( id );
    this.gl      = canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' );
    this.program = null;
  }

  createProgram( ids ) {
    let gl      = this.gl;
    let program = gl.createProgram();

    ids.forEach( gl.attachShader( program, this.createShader ) );
    gl.linkProgram( program );

    if ( gl.getProgramParameter( program, gl.LINKS_STATUS ) ) {
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
    vboAttribs.forEach(( vboAttrib ) => {
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

  drawArrays( mode, count, first = 0 ) {
    let gl = this.gl;
    gl.drawArrays( mode, first, count );
  }

  drawElements( mode, count, offset = 0 ) {
    let gl = this.gl;
    gl.drawElements( mode, count, gl.UNSIGNED_SHORT, offset );
  }
}
