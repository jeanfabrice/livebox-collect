var request = require( 'request' );
var debug   = require( 'debug' )( 'livebox-collect' );

function _stdCall( request, contextID, args, callback ) {
  request({
    headers: {
      "X-Context"    : contextID,
      "Content-Type" : "application/x-sah-ws-4-call+json"
    },
    body: args
  }, function( err, response, data ) {
    debug( 'err: '     , JSON.stringify( err, null, 2 ) );
    debug( 'response: ', JSON.stringify( response, null, 2 ) );
    debug( 'data: '    , JSON.stringify( data, null, 2 )  );
    if( err ) {
      return callback( err );
    }
    if( Object.prototype.hasOwnProperty.call( data, 'status' ) ) {
      return callback( null, data );
    }
    return callback( data );
  });
}

module.exports = Livebox;

function Livebox( host, login, password ) {
  var contextID;
  var obj = {};
  request = request.defaults({
    jar     : true,
    json    : true,
    url     : 'http://' + host + '/ws',
    method  : 'POST'
  });

  obj.connect = function( callback ) {
    request({
      headers: {
        "Authorization" : "X-Sah-Login",
        "Content-Type"  : "application/x-sah-ws-4-call+json"
      },
      body: {
        "service" : "sah.Device.Information",
        "method"  : "createContext",
        "parameters" : {
          "applicationName" : "so_sdkut",
          "username"        : login,
          "password"        : password
        }
      }
    },
    function onRequest( err, response, data ) {
      debug( 'err: '     , JSON.stringify( err, null, 2 ) );
      debug( 'response: ', JSON.stringify( response, null, 2 ) );
      debug( 'data: '    , JSON.stringify( data, null, 2 )  );
      if( err ) {
        return callback( err );
      }
      if( Object.prototype.hasOwnProperty.call( data, 'status' ) && data.status === 0 ) {
        contextID = data.data.contextID;
        return callback( null );
      }
      return callback( data );
    });
  }

  obj.getDSLStats = function( callback ) {
    _stdCall( request, contextID, {
      "service"    : "NeMo.Intf.dsl0",
      "method"     : "getDSLStats",
      "parameters" : {}
    },
    callback );
  }

  obj.deviceInfo = function( callback ) {
    _stdCall( request, contextID, {
      "service"    : "DeviceInfo",
      "method"     : "get",
      "parameters" : {}
    },
    callback );
  }

  obj.getMibs = function( mib, callback ) {
    _stdCall( request, contextID, {
      "service"    : "NeMo.Intf.data",
      "method"     : "getMIBs",
      "parameters" : {
        "mibs": mib
      }
    },
    callback );
  }

  return obj;
}
