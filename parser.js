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
    var elements = parseJSON(data);
    console.log(elements);
    viewer.append(parseJSON(data));
  } catch(e) {
    console.log("Not a valid json.");
  }
}

function parseJSON(data) {
  elements = [];
  for(var key in data) {
    if(isObject(data[key]))
      elements.push(parseArray(data[key], key));
    else if($.isArray(data[key]))
      elements.push(parseObject(data[key], key));
    else {
      elements.push(parsePrimitive(data[key], key));
    }
  }
  return elements;
}

function parseObject(value, key) {
  var div = $("<div class=\"object\"></div>");
  var elements = parseJSON(value);
  div.append($("<span class=\"key\"></span>").text(key));
  for(var i in elements) {
    div.append($("<span class=\"element\"></span>").text());
  }
  return div;
}

function parseArray(value, key) {
  var div = $("<div class=\"array\"></div>");
  var elements = parseJSON(value);
  div.append($("<span class=\"key\"></span>").text(key));
  for(var i in elements) {
    div.append($("<span class=\"element\"></span>").text());
  }
  return div;
}

function parsePrimitive(value, key) {
  var div = $("<div class=\"primitive\"></div>");
  var span1 = $("<span class=\"key\"></span>").text(key);
  var span2 = $("<span class=\"value\"></span>").text(value);
  div.append(span1).append(span2);
  return div;
}

function isObject(obj) {
  return obj === Object(obj);
}