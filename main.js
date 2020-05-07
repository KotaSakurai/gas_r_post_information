var sheet = SpreadsheetApp.getActive().getSheetByName('投稿情報');

function createRow(sheet, parameter) {
  var keys = sheet.getDataRange().getValues()[0];
  var row = [];
  keys.map(function(key) {
    var value = parameter[key];
    if (value) {
      row.push(value);
    }
  });
  return row;
}

function appendRow(sheet, parameter) {
  parameter['uuid'] = Utilities.getUuid();
  var row = createRow(sheet, parameter);
  sheet.appendRow(row);
}

function updateRow(sheet, parameter) {
  // moment js id: MHMchiX6c1bwSqGM1PZiW_PxhMjh3Sh48
  var date = Moment.moment();
  var formattedDate = date.format("YYYY/MM/DD HH:mm:ss");

  sheet.getRange("D" + parameter.row_number).setValue(1);
  sheet.getRange("E" + parameter.row_number).setValue(formattedDate);
}

function deleteRow(sheet, parameter) {
  var row = createRow(sheet, parameter);
  var values = sheet.getDataRange().getValues();
  for (var i = 0; i < values.length; i++) {
    if (values[i][0] === row[0]) {
      sheet.deleteRow(i + 1);
    }
  }
}

function doPost(e) {
  if (e.parameter.action) {
    var action = e.parameter.action.toLowerCase();
    if (action === 'update') {
      updateRow(sheet, e.parameter);
    } else if (action === 'delete') {
      deleteRow(sheet, e.parameter);
    }
  } else {
    appendRow(sheet, e.parameter);
    return ContentService.createTextOutput(JSON.stringify({ status: 200, message: "success" }, null, 2))
    .setMimeType(ContentService.MimeType.JSON);
  }
}


function getData(sheetName) {
  var sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);

  var col = "D";
  var sh = SpreadsheetApp.getActiveSheet();
  var last_row = sh.getLastRow();
  var range = sh.getRange(col + "1:" + col + last_row)
  var values = range.getValues();

  var index = 0;
  for(var i = 0; i < values.length; i++){
    if (values[i][0] == 0) {
      index = i + 1; // 0から開始するので1を足す
      break;
    }
  }
  Logger.log(index);
  if (index == 0) {
    obj = { status: 404, message: "NOT FOUND" };
    return obj;
  }

  var url_value = sh.getRange("B"+ index).getValue();
  var description_value = sh.getRange("C"+ index).getValue();

  obj = { }
  obj["url"] = url_value
  obj["description"] = description_value
  obj["row_number"] = index
  return obj;
}

function doGet() {
  var data = getData('投稿情報');
  return ContentService.createTextOutput(JSON.stringify(data, null, 2))
  .setMimeType(ContentService.MimeType.JSON);
}
