console.log('Hello World !');

// First Example 
const countAButton = document.getElementById('countAButton');
const countBButton = document.getElementById('countBButton');
const axisButton = document.getElementById('axisButton');
// Pure Js
// button.addEventListener('click', () => {
//     console.log('Button Clicked');
// });


// Rx Js
Rx.Observable.fromEvent(countAButton, 'click')
    /* 
        .scan() Operator works like reduce for arrays. It takes a value which is exposed to a callback.
        The returned value of the callback will then become the next value exposed the next time callback runs
    */
    .scan((count) => {
        return count + 1
    }, 0)
    .subscribe((count) => {
        console.log(`A Button Clicked ${count} times`);
    });



// (1) Purity 

/* 
    What makes RxJs Powerful is its ability to produce values using pure functions . That means your code is less prone to errors.
*/


// (2) Flow

/* 
    RxJs has a whole range of operators that helps you control how the events flow through your observables.
    e.g. filter , delay , debounceTime , take , takeUntil , distinct , distinctUntilChanged etc.
*/

Rx.Observable.fromEvent(countBButton, 'click')
    /*
        .throttleTime() Operator allow to filter every 1 sec(1000)
    */
    .throttleTime(1000)
    .scan((count) => {
        return count + 1;
    }, 0)
    .subscribe((count) => {
        console.log(`B Button Clicked ${count} times`);
    });


// (3) Values
/* 
    You can transform the values passed through your observable
    e.g. pluck , parirwise , example
*/

Rx.Observable.fromEvent(axisButton, 'click')
    .throttleTime(1000)
    .map((event) => {
        console.log(event.clientX);
        return event.clientX;
    })
    .scan((count, clientX) => {
        return count + clientX
    },0)
    .subscribe((sum) => {
        console.log(sum)
    });


// (4) Subject (like EventEmitter)
var subject = new Rx.Subject();

subject.subscribe({
    next: (value) => {
        console.log(`ObserverA By Subject: ${value}`);
    }
});

subject.subscribe({
    next: (value) => {
        console.log(`ObserverB By Subject: ${value}`);
    }
});

var numberObservable = Rx.Observable.from([1,2,3]);
// numberObservable.subscribe(subject);


// (5) Multicasted Observable 
/* 
    A "multicasted observable" passes notifications through a Subject which may have many subscribers,
    whereas a plain "unitcasted observable" only sends notifications to a single Observer .
*/

var source = Rx.Observable.from([1,3,4]);
var forMultiObject = new Rx.Subject();
var multicasted = source.multicast(forMultiObject);  // returns a ConnectableObservable
/* 
    multicast returns a ConnectableObservable that works like a Subject when subscribing .
    which is simply an Observable with the connect() method 
*/


multicasted.subscribe((value) => {
    console.log(`Multicasted A : ${value}`);
});

multicasted.subscribe((value) => {
    console.log(`Multicasted B : ${value}`);
});

multicasted.connect();
// Determine exactly when the shared Observable execution will start . 


// (6) Reference Couting 
/* 
    Usually, we want to automatically connect when the first Observer arrives, 
    and automatically cancel the shared execution when the last Observable unsubscribes.
    " refCount() makes the multicasted Observable automatically start executing when the first subscriber arrives , 
    and stop executing when the last subscriber leaves "
*/


// Manually connect and unsubscribe .
var intervalSource = Rx.Observable.interval(500);
var forReferenceCount = new Rx.Subject();
var countMulticasted = intervalSource.multicast(forReferenceCount);
var subscriptionA;
var subscriptionB;
var subscriptionConnect;

let observerACount = 0;
let observerBCount = 0;

console.log('1. First Observer subscribe to multicasted Observable.');
subscriptionA = countMulticasted.subscribe({
    next: (value) => {
        if (observerACount === 0 ) {
            console.log(`3. The next value ${value} is delivered to first Observer.`);
            observerACount ++;
        } else {
            console.log(`5. The next value ${value} is delivered to first Observer.`);
        }
    }
});


subscriptionConnect = countMulticasted.connect();
console.log('2. The multicasted Observable is connected');

setTimeout(() => {
    console.log('4. Second Observer subscribe to multicasted Observable.');
    subscriptionB = countMulticasted.subscribe({
        next : (value) => {
            if (observerBCount === 0 ) {
                console.log(`6. The next value ${value} is delivered to second Observer.`);
                observerBCount ++;
            } else {
                console.log(`8. The next value ${value} is delivered to second Observer.`);
            }
            // console.log(`ObserverB ${value}`);
        }
    })
}, 600);

setTimeout(() => {
    console.log(`7. First Observer unsubscribes from the multicasted Observable.`);
    subscriptionA.unsubscribe();
}, 1200);


setTimeout(() => {
    subscriptionB.unsubscribe();
    console.log(`9. Second Observer unsubscribes from the multicasted Observable.`);
    subscriptionConnect.unsubscribe();
    console.log(`10. The connection to the multicasted Observable is unsubscribed`);
},2000);


// (7) Behavior Subject
/* 
   BehaviorSubjects are useful for representing 'values over time' . For instnace, an event stream of birthdays is a Subject,
   but the stream of a person's age would be a BehaviorSubject.
*/
var myBehavSubject = new Rx.BehaviorSubject(0) // 0 is the initial value

myBehavSubject.subscribe({
    next: (value) => {
        console.log(`BehaviorSubject - Observer A : ${value}`);
    }
});

myBehavSubject.next(1);
myBehavSubject.next(2);

myBehavSubject.subscribe({
    next: (value) => {
        console.log(`BehaviorSubject - Observer B : ${value}`);
    }
});

myBehavSubject.next(3);



// (8) Replay Subject
/* 
   A ReplaySubject records multiple values from the Observable execution and replays them to new subscriber. 
*/

var myReplaySubject = new Rx.ReplaySubject(3); // Buffer 3 values for new subscribers. 

myReplaySubject.subscribe({
    next: (value) => {
        console.log(`ReplaySubject - Observer A : ${value}`);
    }
});

myReplaySubject.next(1);
myReplaySubject.next(2);
myReplaySubject.next(3);
myReplaySubject.next(4);

myReplaySubject.subscribe({
    next: (value) => {
        console.log(`ReplaySubject - Observer B : ${value}`);
    }
});

myReplaySubject.next(5);



// (9) Async Subject
/* 
   A AsyncSubject is a variant wherre only the last value of the Observable execution is sent to its observers, and only when the 
   execution completes.
*/

var myAsyncSubject = new Rx.AsyncSubject();

myAsyncSubject.subscribe({
    next: (value) => {
        console.log(`AsyncSubject - Observer A : ${value}`);
    }
});


myAsyncSubject.next(1);
myAsyncSubject.next(2);
myAsyncSubject.next(3);
myAsyncSubject.next(4);

myAsyncSubject.subscribe({
    next: (value) => {
        console.log(`AsyncSubject - Observer B : ${value}`);
    }
});

myAsyncSubject.next('AsyncSubject Final Value');
myAsyncSubject.complete();


// (10) Operators ( Pure Function )
/* 
   An Operator is a function which creates a new Observable based on the current Observable. This s a pure operation: 
   the previous Observalbe stays unmodified.
*/


// Custom Operator Example : 
function multipleByTen(input) {
    var output = Rx.Observable.create(function subscribe(observer) {
        input.subscribe({
            next: (value) => {
                observer.next(10 * value);
            },
            error: (err) => {
                observer.error(err);
            },
            completed: () => {
                observer.complete();
            }
        });
    });

    return output;

}

var input = Rx.Observable.from([1,3,4,6]);
var output = multipleByTen(input);
output.subscribe({
    next: (value) => {
        console.log(value);
    }
});
