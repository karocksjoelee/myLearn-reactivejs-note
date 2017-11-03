const Rx = require('rxjs/Rx');

Rx.Observable.of('Hello Joe')
    .subscribe( function(x) {
        console.log(x);
    });