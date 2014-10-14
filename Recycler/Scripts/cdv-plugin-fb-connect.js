CDV = ( typeof CDV == 'undefined' ? {} : CDV );
var PhoneGap = window.PhoneGap || window.PhoneGap;
CDV.FB = {
  init: function(apiKey, fail) {
    // create the fb-root element if it doesn't exist
    if (!document.getElementById('fb-root')) {
      var elem = document.createElement('div');
      elem.id = 'fb-root';
      document.body.appendChild(elem);
    }
    PhoneGap.exec(function() {
    var authResponse = JSON.parse(localStorage.getItem('cdv_fb_session') || '{"expiresIn":0}');
    if (authResponse && authResponse.expirationTime) { 
      var nowTime = (new Date()).getTime();
      if (authResponse.expirationTime > nowTime) { 
        // Update expires in information
        updatedExpiresIn = Math.floor((authResponse.expirationTime - nowTime) / 1000);
        authResponse.expiresIn = updatedExpiresIn;
                 
        localStorage.setItem('cdv_fb_session', JSON.stringify(authResponse));
        FB.Auth.setAuthResponse(authResponse, 'connected');
       }
      }
      console.log('PhoneGap Facebook Connect plugin initialized successfully.');
    }, (fail?fail:null), 'ConnectPlugin', 'init', [apiKey]);
  },
  login: function(params, cb, fail) {
    params = params || { scope: '' };
    PhoneGap.exec(function(e) { // login
        if (e.authResponse && e.authResponse.expiresIn) {
          var expirationTime = e.authResponse.expiresIn === 0
          ? 0 
          : (new Date()).getTime() + e.authResponse.expiresIn * 1000;
          e.authResponse.expirationTime = expirationTime; 
        }
        localStorage.setItem('cdv_fb_session', JSON.stringify(e.authResponse));
        FB.Auth.setAuthResponse(e.authResponse, 'connected');
        if (cb) cb(e);
    }, (fail?fail:null), 'ConnectPlugin', 'login', params.scope.split(',') );
  },
  logout: function(cb, fail) {
    PhoneGap.exec(function(e) {
      localStorage.removeItem('cdv_fb_session');
      FB.Auth.setAuthResponse(null, 'notConnected');
      if (cb) cb(e);
    }, (fail?fail:null), 'ConnectPlugin', 'logout', []);
  },
  getLoginStatus: function(cb, fail) {
    PhoneGap.exec(function(e) {
      if (cb) cb(e);
    }, (fail?fail:null), 'ConnectPlugin', 'getLoginStatus', []);
  },
  dialog: function(params, cb, fail) {
    PhoneGap.exec(function(e) { // login
      if (cb) cb(e);
                  }, (fail?fail:null), 'ConnectPlugin', 'showDialog', [params] );
  }
};