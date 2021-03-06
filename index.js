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

function tokenize(e) {
    e.preventDefault();
    var secret = $("#secret").val();
    var data = $("#payload").val();
    if (!secret) {
        alert("Secret cannot be empty!");
        return
    }
    if (!secret.trim()) {
        alert("Secret cannot be a blank white space!");
        return
    }
    if (!data) {
        alert("At least one Key-Value pair is required to build the payload!");
        return
    }
    var data = JSON.parse(data);

    var header = {
      "alg": "HS256",
      "typ": "JWT"
    };
    var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
    var encodedHeader = base64url(stringifiedHeader);
    var stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
    var encodedData = base64url(stringifiedData);
    var token = encodedHeader + "." + encodedData;
    var signature = CryptoJS.HmacSHA256(token, secret);
    signature = base64url(signature);
    var signedToken = token + "." + signature;
    document.getElementById("encoded").innerHTML = signedToken;
}

function parseJWT (e) {
    e.preventDefault();
    var token = $("#encoded_token").val().trim();
    if (!token) {
        alert("Token cannot be null!");
        return
    }
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    document.getElementById("decoded").innerHTML = jsonPayload;
    // console.log(JSON.parse(jsonPayload));
}
