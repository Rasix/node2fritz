# node2fritz

Node module to communicate with a AVM FritzBox providing the following functions:

- Get the session ID (getSessionID)
- Get the phone list (getPhoneList)
- Set the guest wlan (setGuestWLan)
- Get the guest wlan settings (getGuestWLan)


## Install

```bash
npm install node2fritz
```

## How to use

Get the session ID:
```js
var fritz = require('node2fritz');

fritz.getSessionID("user", "password", function(sid){
    console.log(sid);
});
```

Get the phone list:
```js
var fritz = require('node2fritz');

fritz.getPhoneList(sid,function(calls){
    console.log(calls);
});

```

Enable or disable guest wlan:
```js
var fritz = require('node2fritz');

fritz.setGuestWLan(sid, true, function(enabled){
    console.log("Guest WLan Enabled: "+enabled);
});
```

Get guest wlan settings:
```js
var fritz = require('node2fritz');

fritz.getGuestWLan(sid, function(settings){
    console.log(settings);
});
```