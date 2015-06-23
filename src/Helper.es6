'use strict';
export class Helper {
  constructor( id ) {
    let canvas = document.getElementById( id );
    this.gl = canvas.getContext( 'webgl' ) || canvas.getContext( '' );
  }

  createShader( id ) {
    let source = document.getElementById( id );
    let shader;
    switch ( source.type ) {
    case 'x-shader/x-vertex':
      shader = this.gl.createShader( this.gl.VERTEX_SHADER );
      break;
    case 'x-shader/x-fragment':
      shader = this.gl.createShader( this.gl.FRAGMENT_SHADER );
      break;
    default :
      console.error( 'The shader type is not an accepted value.' );
    }
    this.gl.shaderSource( shader, source.text );
    this.gl.compileShader( shader );

    if ( !this.gl.getShaderParameter( shader, this.gl.COMPILE_STATUS ) ) {
      console.error( this.gl.getShaderInfoLog( shader ) );
    }

    return shader;
  }

}
