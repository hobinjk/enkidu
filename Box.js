function Box(id) {
  this.id = id;
  this.files = null;

  this.elem = document.getElementById(id);
  this.elem.addEventListener("dragenter", this.onDragEnter(this), false);
  this.elem.addEventListener("dragleave", this.onDragLeave(this), false);
  this.elem.addEventListener("dragover", Box.stop, false);
  this.elem.addEventListener("drop", this.onDrop(this), false);

  this._onClickListener = this.onClick(this);
  this.addOnClick();
}

Box.prototype.onDragEnter = function(self) {
  return function(e) {
    //Box.stop(e);
    console.log("ondragenter");
    self.elem.classList.add(this.id+"-drag-over");
  };
}


Box.prototype.onDragLeave = function(self) {
  return function(e) {
    //Box.stop(e);
    console.log("ondragleave");
    self.elem.classList.remove(this.id+"-drag-over");
  };
}

Box.prototype.onDrop = function(self) {
  return function(e) {
    Box.stop(e);
    self.files = e.dataTransfer.files;
    console.log(e);
    if(!self.files) return;
    self.handleFiles(self.files);
  };
};

Box.prototype.onClick = function(self) {
  return function() {
    var hiddenInput = document.getElementById("hidden-input");
    hiddenInput.addEventListener("change", function changeListener(event) {
      self.handleFiles(event.target.files);
      event.target.removeEventListener("change", changeListener, false);
    }, false);
    hiddenInput.click();
  };
};

Box.prototype.removeOnClick = function() {
  this.elem.removeEventListener("click", this._onClickListener, false);
};

Box.prototype.addOnClick = function() {
  this.elem.addEventListener("click", this._onClickListener, false);
};

Box.prototype.handleFiles = function(files) {
  console.log(this+" is receiving "+files.length+" files");
  this.files = files;
  var fileList = Box.createFileListElement(this.files);
  this.elem.innerHTML = "";
  this.elem.appendChild(fileList);
  Box.centerFileListElement(fileList);
  if(this.onFilesReady) {
    this.onFilesReady();
  }
};

Box.centerFileListElement = function(list) {
  var style = window.getComputedStyle(list, null);
  var heightStr = style.height;
  console.log("height: "+heightStr);
  var heightPx = parseInt(heightStr.substr(0, heightStr.length - 2));
  console.log("setting marginTop to: "+(-heightPx/2)+"px");
  list.style.marginTop = (-heightPx/2)+"px";
}

Box.stop = function(e) {
  e.stopPropagation();
  e.preventDefault();
}

Box.createFileListElement = function(files) {
  var fileList = document.createElement("ul");
  fileList.classList.add("file-list");
  for(var i = 0; i < files.length; i++) {
    var file = files[i];
    var li = document.createElement("li");
    li.classList.add("file-list-file");
    li.textContent = file.name;
    fileList.appendChild(li);
  };
  return fileList;
};

