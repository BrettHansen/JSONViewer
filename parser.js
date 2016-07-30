var totalFiles = 0;
var output_vals = [];
var files = [];
var data;
$("#drop").on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
  e.preventDefault();
  e.stopPropagation();
})
.on('dragenter', function(e) {
  $("#drop").addClass("dragging-over");
  $("#drop").removeClass("not-dragging-over");
})
.on('dragleave', function(e) {
  $("#drop").addClass("not-dragging-over");
  $("#drop").removeClass("dragging-over");
})
.on('drop', function(e) {
  $("#drop").remove();
  files = e.originalEvent.dataTransfer.files;
  files = Object.keys(files).map(function (key) {return files[key]});

  var reader = new FileReader();

  reader.onload = testJSON;
  reader.readAsBinaryString(files[0]);
});

function testJSON(e) {
  try {
    data = JSON.parse(e.target.result);
    var viewer = $("#viewer");
    var elements = parseJSON(data, 0);
    viewer.append(elements);
    console.log(elements);
  } catch(e) {
    console.log("Not a valid json.");
  }
}

function parseJSON(data, iter) {
  elements = [];
  for(var key in data) {
    if($.isArray(data[key])) {
      var ret = parseArray(data[key], key);
      console.log(ret);
      elements.push(ret);
    }
    else if(isObject(data[key])) {
      var ret = parseObject(data[key], key);
      console.log(ret);
      elements.push(ret);
    }
    else {
      var ret = parsePrimitive(data[key], key);
      console.log(ret);
      elements.push(ret);
    }
  }
  return elements;
}

function parseObject(value, key) {
  var str = key + " : <br>";
  var parsed = parseJSON(value);
  for(var i in parsed) {
    str += parsed[i] + "<br>";
  }
  return str;
}

function parseArray(value, key) {
  var str = key + " : <br>";
  var parsed = parseJSON(value);
  for(var i in parsed) {
    str += parsed[i] + ", ";
  }
  return str;
}

function parsePrimitive(value, key) {
  var str = key + " : " + value;
  return str;
}

function isObject(obj) {
  return obj === Object(obj);
}