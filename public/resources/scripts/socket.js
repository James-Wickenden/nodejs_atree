
/*
  var socket = io();
      
        var messages = document.getElementById('messages');
        var form = document.getElementById('form');
        var input = document.getElementById('input');
      
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          if (input.value) {
            socket.emit('chat message', input.value);
            input.value = '';
          }
        });
      
        socket.on('chat message', function(msg) {
          var item = document.createElement('li');
          item.textContent = msg;
          messages.appendChild(item);
          window.scrollTo(0, document.body.scrollHeight);
        });
*/

'use strict';

// Starts a clienside socket connection
var socket = io();

function EmitTree(graph) {
    var nodes = [];
    TraverseTree(graph, function(vertex) { nodes.push(vertex); });
    console.log(nodes);
    socket.emit('event', nodes);
};