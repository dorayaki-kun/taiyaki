( function ( root, factory ) {
  if ( typeof define === 'function' && define.amd ) {
    // AMD
    define( [], factory );
  } else if ( typeof exports === 'object' ) {
    // commonjs
    module.exports = factory();
  } else {
    // Browser globals
    root.YourModule = factory();
  }
} )( this, function () {
  //
  // Class
  // ----------------------------------------------------------------------
  function Taiyaki( id ) {// Taiyaki( id: string ) -> void
    var c    = document.getElementById('canvas');
    if ( !c ) {
      console.error( '' );// FIXME
      return;
    }

    var gl   = c.getContext( 'webgl' ) || c.getContext( 'experimental-webgl' );
    if( !gl ) {
      console.log( '' );// FIXME
    }

    this._gl = gl;
  }

  //
  // Header
  // ----------------------------------------------------------------------
  Taiyaki.prototype.createShader = Taiyaki_createShader; // Taiyaki#createShader( id: string ) -> WebGLShader

  //
  // Implementation
  // ----------------------------------------------------------------------
  function Taiyaki_createShader( id ) {
    var source = document.getElementById( id );
    var shader;

    if ( !source ) {
      console.error('');// FIXME
      return;
    }

    switch( source.type ){
    case 'x-shader/x-vertex':
      shader = this._gl.createShader( this._gl.VERTEX_SHADER );
      break;
    case 'x-shader/x-fragment':
      shader = this._gl.createShader( this._gl.FRAGMENT_SHADER );
      break;
    default :
      console.error( 'The shader type is not an accepted value.' );
      return null;
    }

    this._gl.shaderSource( shader, source.text );
    this._gl.compileShader( shader );
    if ( this._gl.getShaderParameter( shader, this._gl.COMPILE_STATUS ) ){
      return shader;
    } else {
      console.error( this._gl.getShaderInfoLog( shader ) );
      return null;
    }
  }

  return Taiyaki;
} );
