var testStr = "a".repeat(1000000);
var testBuf = Module.intArrayFromString(testStr);
var testKey = "asdf";

function testPure() {
  var bpure = new BlowfishPure(testKey);
  var start = Date.now();
  var pureN = 1;
  for(var i = 0; i < pureN; i++) {
    var pureOut = bpure.encrypt(testStr);
  }
  console.log("pure takes: "+((Date.now() - start)/pureN));
}

function testAsm() {
  Blowfish.initialize();
  var asmN = 3;
  var start = Date.now();
  for(var i = 0; i < asmN; i++) {
    var asmOut = Blowfish.encrypt(testKey, testBuf);
  }
  console.log("asm takes: "+((Date.now() - start)/asmN));
}

testPure();
testAsm();
testPure();
testAsm();

