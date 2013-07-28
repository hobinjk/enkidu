(function() {

var plainBox = new Box("plain");
var cryptBox = new Box("crypt");
document.body.addEventListener("drop", Box.stop, false);//onContainerDrop, false);

var centerContainer = document.getElementById("center-container");
var cryptText = document.getElementById("crypt-text");
var workingText = document.getElementById("working-text");
var key = "asdf";

var keyEntry = new KeyEntry("key-entry");
keyEntry.onSubmit = function onKeyEntrySubmit() {
  key = keyEntry.input.value;
  keyEntry.hide();
  cryptText.style.display = "inline";
  cryptText.style.opacity = 1;

  centerContainer.classList.remove("key-entry");
  centerContainer.classList.add("crypt-button");

  setTimeout(
    function() {
      centerContainer.addEventListener("click", onCryptClick, false);
    },
    0
  );

};


var filesLeft;

function onCryptClick() {
  centerContainer.removeEventListener("click", onCryptClick, false);
  var encrypt, files;
  if(plainBox.files) {
    files = plainBox.files;
    encrypt = true;
  } else if(cryptBox.files) {
    files = cryptBox.files;
    encrypt = false;
  } else {
    return;
  }

  filesLeft = files.length;
  centerContainer.classList.remove("crypt-button");
  centerContainer.classList.add("working");
  cryptText.style.display = "none";
  cryptText.style.opacity = 0;
  workingText.style.display = "inline";
  workingText.style.opacity = 1;


  var fileList = Box.createFileListElement([]);
  var box = encrypt ? cryptBox : plainBox;
  box.elem.innerHTML = "";
  box.removeOnClick();
  box.elem.appendChild(fileList);

  for(var i = 0; i < files.length; i++) {
    var file = files[i];
    var reader = new FileReader();
    reader.onload = (function(file) {
      return function(e) {
        console.log(e.target);
        var arrayBuffer = new Uint8Array(e.target.result);
        if(typeof(Worker) !== "undefined") {
          console.log("using worker");
          var bfWorker = new Worker("blowfish-worker.js");
          bfWorker.onmessage = function(wEvent) {
            var data = wEvent.data;
            createLink(fileList, file.name, encrypt, data.output);
          };
          bfWorker.postMessage({key: key, input: arrayBuffer, crypt: encrypt});
        } else {
          var outBuffer = Blowfish.crypt(key, arrayBuffer, encrypt);
          createLink(fileList, file.name, encrypt, outBuffer);
        }
      };
    })(file);
    reader.readAsArrayBuffer(file);
  };
}
function createLink(fileList, name, encrypt, outBuffer) {
  var outBlob = new Blob([outBuffer]);//, {"type": "application/octet-binary"});
  var href = window.URL.createObjectURL(outBlob);
  var fileLink = document.createElement("a");
  fileLink.href = href;
  if(encrypt) {
    name = name+".enc";
  } else if(name.lastIndexOf(".enc") === name.length - 4) {
    name = name.substr(0,name.length - 4);
  }
  fileLink.textContent = fileLink.download = name;

  var fileLinkContainer = document.createElement("li");
  fileLinkContainer.classList.add("file-list-file");
  fileLinkContainer.appendChild(fileLink);
  fileList.appendChild(fileLinkContainer);
  Box.centerFileListElement(fileList);
  filesLeft -= 1;
  if(filesLeft > 0) return;

  centerContainer.classList.remove("working");
  centerContainer.classList.add("key-entry");
  workingText.style.display = "none";
  workingText.style.opacity = 0;
  keyEntry.show();

}


})();
