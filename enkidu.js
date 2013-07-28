(function() {

var plainBox = new Box("plain");
var cryptBox = new Box("crypt");
document.body.addEventListener("drop", Box.stop, false);//onContainerDrop, false);

var centerContainer = document.getElementById("center-container");
var cryptButtonText = document.getElementById("crypt-button-text");
var key = "asdf";

var keyEntry = new KeyEntry("key-entry");
keyEntry.onSubmit = function onKeyEntrySubmit() {
  key = keyEntry.input.value;
  keyEntry.hide();
  cryptButtonText.style.display = "inline";
  cryptButtonText.style.opacity = 1;

  centerContainer.classList.remove("key-entry");
  centerContainer.classList.add("crypt-button");

  setTimeout(
    function() {
      centerContainer.addEventListener("click", onCryptClick, false);
    },
    0
  );

};

function onCryptClick() {
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
        var outBuffer = Blowfish.crypt(key, arrayBuffer, encrypt);
        var outBlob = new Blob([outBuffer]);//, {"type": "application/octet-binary"});
        var href = window.URL.createObjectURL(outBlob);
        var fileLink = document.createElement("a");
        fileLink.href = href;
        var name = file.name;
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
      };
    })(file);
    reader.readAsArrayBuffer(file);
  };
}

})();
