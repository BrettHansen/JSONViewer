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
  } catch(e) {
    console.log("Not a valid json.");
    return;
  }
  var viewer = $("#viewer");
  var elements = parseObject(data, files[0].name);
  viewer.append(elements);
}

function parseList(data, surpressKey) {
  var elements = [];
  for(var key in data) {
    if($.isArray(data[key])) {
      var ret = parseArray(data[key], surpressKey ? undefined : key);
      elements.push(ret);
    }
    else if(isObject(data[key])) {
      var ret = parseObject(data[key], surpressKey ? undefined : key);
      elements.push(ret);
    }
    else {
      var ret = parsePrimitive(data[key], surpressKey ? undefined : key);
      elements.push(ret);
    }
  }
  return elements;
}

function parseObject(value, key) {
  var div = $("<div class=\"object\"></div>");
  var head = $("<span class=\"key\">" + (key ? key : "") + "</span>");
  var content = $("<div class=\"content\"></div>");
  content.data("data", value);
  head.prepend($("<img class=\"plus\" src=\"plus.png\">"));
  head.prepend($("<img class=\"minus\" src=\"minus.png\">").hide());
  head.data("toggle", true);
  head.addClass("clickable");
  head.click(function(e) {
    var head = $(this);
    var content = head.next();
    var toggle = head.data("toggle");
    head.data("toggle", !toggle);
    if(toggle) {
      if(head.data("html-generated")) {
        content.show();
      } else {
        head.data("html-generated", true);
        var parsed = parseList(content.data("data"), false);
        for(var i in parsed) {
          content.append(parsed[i] instanceof jQuery ? parsed[i] : parsed[i].object);
        }
      }
      head.children(".plus").hide();
      head.children(".minus").show();
    } else {
      content.hide();
      head.children(".plus").show();
      head.children(".minus").hide();
    }
  });
  div.append(head, content);
  return div;
}

function parseArray(value, key) {
  var div = $("<div class=\"array\"></div>");
  var head = $("<span class=\"key\">" + (key ? key : "") + "</span>");
  var content = $("<div class=\"content\"></div>");
  content.data("data", value);
  head.prepend($("<img class=\"plus\" src=\"plus.png\">"));
  head.prepend($("<img class=\"minus\" src=\"minus.png\">").hide());
  head.data("toggle", true);
  head.addClass("clickable");
  head.click(function(e) {
    var head = $(this);
    var content = head.next();
    var toggle = head.data("toggle");
    head.data("toggle", !toggle);
    if(toggle) {
      if(head.data("html-generated")) {
        content.show();
      } else {
        head.data("html-generated", true);
        var parsed = parseList(content.data("data"), true);
        for(var i in parsed) {
          content.append(parsed[i] instanceof jQuery ? parsed[i] : parsed[i].array);
        }
      }
      head.children(".plus").hide();
      head.children(".minus").show();
    } else {
      content.hide();
      head.children(".plus").show();
      head.children(".minus").hide();
    }
  });
  div.append(head, content);
  return div;
}

function parsePrimitive(value, key) {
  var obj = {
    "key" : key,
    "value" : value
  }

  obj.object = $("<div class=\"primitive\">" +
                (key ? "<span class=\"key\">" + key + "</span>" : "") +
                "<span class=\"value\">" + value + "</span></div>");
  obj.array = $("<div class=\"primitive\"><span class=\"arr_element\">" + value + "</span></div>");
  return obj;
}

function isObject(obj) {
  return obj === Object(obj);
}