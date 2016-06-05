angular.module('server.services', [])

  .factory('ReceiptsServer', function ($q, $http, $window) {


    var serverServices = {};

    serverServices.insertUser = function (email, password) {

      var dataToPost = 'email=' + email + '&password=' + password;


      var req = {
        method: 'POST',
        url: 'https://walletapplication.herokuapp.com/api/local/users',
        headers: {'Content-Type': 'application/x-www-form-urlencoded',
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE",
          "Access-Control-Max-Age": "3600",
          "Access-Control-Allow-Headers": "x-requested-with"},
        data: dataToPost
      };


      return $http(req);

    };




    serverServices.loginUser = function (email, password) {

      var dataToPost = 'email=' + email + '&password=' + password;

      var req = {
        method: 'POST',
        url: 'https://walletapplication.herokuapp.com/api/local/login',
        headers: {'Content-Type': 'application/x-www-form-urlencoded',
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE",
          "Access-Control-Max-Age": "3600",
          "Access-Control-Allow-Headers": "x-requested-with"},
        data: dataToPost
      };


      return $http(req);

    };

    serverServices.loginUserWithFacebook = function () {

      var auth = 'JWT ' + $window.sessionStorage.token;

      var req = {
        method: 'GET',
        url: 'https://walletapplication.herokuapp.com/api/local/user',
        headers: {'Content-Type': 'application/x-www-form-urlencoded',
          "Authorization": auth,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE",
          "Access-Control-Max-Age": "3600",
          "Access-Control-Allow-Headers": "x-requested-with"
        }

      };


      return $http(req);

    };


    serverServices.insertReceipt = function (receipt) {
      //var image = receipt.att.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
      var image = receipt.att;

      var dataToPost = {};
      dataToPost["att"] = image;


      if (receipt.dateReceipt != null) {
        dataToPost["dateReceipt"] = receipt.dateReceipt;
      }
      if (receipt.nip != null) {
        dataToPost["nip"] = receipt.nip;
      }
      if (receipt.companyName != null) {
        dataToPost["companyName"] = receipt.companyName;
      }
      if (receipt.textReceipt != null) {
        dataToPost["textReceipt"] = receipt.textReceipt;
      }
      if (receipt.price != null) {
        dataToPost["price"] = receipt.price;
      }

      var auth = 'JWT ' + $window.sessionStorage.token;

      return $http.post("https://walletapplication.herokuapp.com/api/receipts", dataToPost, {
        headers: {

          "Authorization": auth,
          "X-Powered-By": "Express",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE"
        }
      });

    };

    serverServices.insertReceiptWithImageOnly = function (receiptImage) {
      //console.log(receiptImage);
      //var image = receiptImage.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
      var image = receiptImage;

      var dataToPost = {};
      dataToPost["att"] = image;

      var auth = 'JWT ' + $window.sessionStorage.token;

      return $http.post("https://walletapplication.herokuapp.com/api/receipts", dataToPost, {
        headers: {

          "Authorization": auth,
          "X-Powered-By": "Express",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE"
        }
      });

    };

    serverServices.selectReceipt = function (receiptId) {

      var auth = 'JWT ' + $window.sessionStorage.token;

      var url = 'https://walletapplication.herokuapp.com/api/receipts/' + receiptId;

      var req = {
        method: 'GET',
        url: url,
        headers: {'Authorization': auth}
      };

      return $http(req);

    };


    serverServices.selectAllReceipts = function () {

        var auth = 'JWT ' + $window.sessionStorage.token;

        var req = {
          method: 'GET',
          url: 'https://walletapplication.herokuapp.com/api/receipts',
          headers: {'Authorization': auth}
        };


      return $http(req);

      };

    serverServices.updateReceipt = function (receipt) {

      var auth = 'JWT ' + $window.sessionStorage.token;
      var url = 'https://walletapplication.herokuapp.com/api/receipts/' + receipt.server_id;

      var dataToPost = {};

      dataToPost["categoryId"] = ''; //TODO: Obecnie nie ma categoryID w paragonie
      dataToPost["dateReceipt"] = receipt.dateReceipt;
      dataToPost["nip"] = receipt.nip;
      dataToPost["companyName"] = receipt.companyName;
      /*dataToPost["textReceipt"] = receipt.textReceipt;*/ //TODO: Nie można wstawiać textReceipt
      dataToPost["price"] = receipt.price;

      var req = {
        method: 'PUT',
        url: url,
        headers: {'Authorization': auth},
        data: dataToPost
      };

      return $http(req);

    };


    serverServices.deleteReceipt = function (receiptId) {

      var auth = 'JWT ' + $window.sessionStorage.token;

      var url = 'https://walletapplication.herokuapp.com/api/receipts/' + receiptId;

      var req = {
        method: 'DELETE',
        url: url,
        headers: {'Authorization': auth}
      };

      return $http(req);

    };


    return serverServices;
  });
