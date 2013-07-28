importScripts('blowfish.js', 'blowfish-wrapper.js');

onmessage = function(event) {
  var data = event.data;
  //data should be key, input, crypt
  //output should be output
  var out = Blowfish.crypt(data.key, data.input, data.crypt);
  postMessage({output: out});
};
