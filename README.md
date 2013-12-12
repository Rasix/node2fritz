# node2fritz

Node module to communicate with a AVM FritzBox

## Install

```bash
npm install node2fritz
```

## How to use

```js
var fritz = require('node2fritz');

fritz.getSessionID("user", "password", function(sid){
    console.log(sid);
    fritz.getPhoneList(sid,function(calls){
        console.log(calls);
    })
})
```