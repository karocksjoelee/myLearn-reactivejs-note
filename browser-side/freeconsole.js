var former = console.log;
console.log = function(msg) {

    former(msg);
    if (typeof msg === 'object') {
        msg = JSON.stringify(msg, null ,4);
    }
    var node = document.createElement('P');
    var textNode = document.createTextNode(`${msg}`);
    node.appendChild(textNode);
    document.getElementById('myLog').appendChild(node);

}

