function addRow() {

    var key = document.getElementById("key");
    var value = document.getElementById("value");

    if (!key.value || !value.value) {
        alert("Neither 'Key' nor 'Value' can be null!");
        return
    }
    if (!key.value.trim() || !value.value.trim()) {
        alert("Neither 'Key' nor 'Value' can contain blank white spaces!");
        return
    }

    var table = document.getElementById("myTableData");

    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);

    row.insertCell(0).innerHTML= '<input type="button" value = "Delete" onClick="Javacsript:deleteRow(this)">';
    row.insertCell(1).innerHTML= key.value;
    row.insertCell(2).innerHTML= value.value;

}

function deleteRow(obj) {

    var index = obj.parentNode.parentNode.rowIndex;
    var table = document.getElementById("myTableData");
    table.deleteRow(index);

}

function tableCells(t){
   if(t.cells) return t.cells; // use internal routine when supported
   for(var a=[], r=t.rows, y=0, c, x; t=r[y++];){
      for(c=t.cells, x=0; t=c[x++]; a.push(t));
   }
   return a;
}

function addTable(e) {
    e.preventDefault();
    var secret = $("#secret").val();
    if (!secret) {
        alert("Secret cannot be empty!");
        return
    }
    if (!secret.trim()) {
        alert("Secret cannot be a blank white space!");
        return
    }
    var table = document.getElementById("myTableData");
//    for (var i = 0, row; row = table.rows[i]; i++) {
//        console.log(row.innerHTML);
//       for (var j = 0, col; col = row.cells[j]; j++) {
//            console.log(col.innerHTML);
//       }
//    }
    var array = [];
    for (var i = 3, cell; cell = tableCells(table)[i]; i++) {
        if (i === 3 || i % 3 == 0 ) { continue; }
        array.push(cell.innerHTML);
    }
    if (array.length < 2) {
        alert("At least one Key-Value pair is required to build the payload!");
        return
    }
    var dict = {}
    for (var j = 0; j < array.length - 1; j++) {
        if (j === 0 || j % 2 == 0 ) {
            dict[array[j]] = array[j+1]
        }
    }
    tokenize(secret, dict);
}

function load() {
    console.log("Page load finished");
}

function base64url(source) {
  // Encode in classical base64
  encodedSource = CryptoJS.enc.Base64.stringify(source);

  // Remove padding equal characters
  encodedSource = encodedSource.replace(/=+$/, '');

  // Replace characters according to base64url specifications
  encodedSource = encodedSource.replace(/\+/g, '-');
  encodedSource = encodedSource.replace(/\//g, '_');

  return encodedSource;
}

function tokenize(secret, payload) {
    var header = {
      "alg": "HS256",
      "typ": "JWT"
    };
    var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
    var encodedHeader = base64url(stringifiedHeader);
    var stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(payload));
    var encodedData = base64url(stringifiedData);
    var token = encodedHeader + "." + encodedData;
    var signature = CryptoJS.HmacSHA256(token, secret);
    signature = base64url(signature);
    var signedToken = token + "." + signature;
    document.getElementById("token").innerHTML = signedToken;
}
