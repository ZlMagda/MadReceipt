angular.module('database.services', ['ionic', 'ngCordova'])

  .factory('DatabaseService', ['$q', '$cordovaSQLite', function ($q, $cordovaSQLite) {


    function createOrOpenDB() {
      var receiptsDB;

      if (window.cordova && window.SQLitePlugin) { // because Cordova is platform specific and doesn't work when you run ionic serve
        receiptsDB = window.sqlitePlugin.openDatabase({"name": "MadReceipts.db", iosDatabaseLocation: 'default'}); //device
                                                                                                                   // -
                                                                                                                   // SQLite
      } else {

        receiptsDB = window.openDatabase("APSNetMobileDb", "1.0", "MadReceipts.db", 100 * 1024 * 1024); // browser
                                                                                                        // webSql, a
                                                                                                        // fall-back
                                                                                                        // for
                                                                                                        // debugging
      }

      receiptsDB.transaction(createReceiptsTable, errorCB, successCB);

      return receiptsDB;
    }


    function createReceiptsTable(tx) {

      //tx.executeSql("DROP TABLE IF EXISTS receipts");


      tx.executeSql('CREATE TABLE IF NOT EXISTS receipts (' +
        'id integer primary key unique,' +
        'server_id integer default 0,' +
        'att blob,' +
        'category varchar,' +
        'companyName varchar,' +
        'nip varchar,' +
        'dateReceipt date,' +
        'dateCreation varchar, ' +
        'dateLastModification varchar, ' +
        'price real,' +
        'textReceipt varchar,' +
        'online byte DEFAULT 0)');

    }


    function errorCB() {
      alert("DB access FAILED");
    }

    function successCB() {
     //alert("DB access SUCCEEDED");
    }

    var databaseServices = {};

    databaseServices.open = function () {

      return createOrOpenDB();

    };


    return {
      insert: function (receiptsList) {


        var deferred = $q.defer();
        var receiptsDB = createOrOpenDB();

        receiptsDB.transaction(function (tx) {
          for (var i = 0; i < receiptsList.length; i++) {
            tx.executeSql("INSERT INTO receipts (att) VALUES (?)", [receiptsList[i]]);
          }


        }, deferred.reject, deferred.resolve);
        return deferred.promise;


      },

      insertFromServer: function (receiptsList) {

        console.log("in insert");
        var deferred = $q.defer();
        var receiptsDB = createOrOpenDB();

        receiptsDB.transaction(function (tx) {

          console.log("in transaction");
          console.log(receiptsList);
          for (var i = 0; i < receiptsList.data.length; i++) {
            console.log(receiptsList.data[i].data.companyName);

            tx.executeSql("INSERT INTO receipts (server_id, att, companyName, nip, dateReceipt, dateCreation, dateLastModification, price, textReceipt, online) VALUES (?,?,?,?, ?, ?, ?, ?, ?, 1)",
              [receiptsList.data[i].data._id, receiptsList.data[i].data.attTN, receiptsList.data[i].data.companyName, receiptsList.data[i].data.nip, receiptsList.data[i].data.dateReceipt, receiptsList.data[i].data.dateCreation, receiptsList.data[i].data.dateLastModification, receiptsList.data[i].data.price, receiptsList.data[i].data.textReceipt]);
          }
        }, deferred.reject, deferred.resolve);
        return deferred.promise;
      },

      select: function(receiptId){


        var deferred = $q.defer();
        var receiptsDB = createOrOpenDB();

        receiptsDB.transaction(function (tx) {

          tx.executeSql("SELECT * FROM receipts where id=(?)", [receiptId], function (tx, results) {
            var len = results.rows.length, i;


            for (i = 0; i < len; i++){

              var receipt = {
                "_id": results.rows.item(i).id,
                "server_id": results.rows.item(i).server_id,
                "att": results.rows.item(i).att,
                "category": results.rows.item(i).category,
                "companyName": results.rows.item(i).companyName,
                "nip": results.rows.item(i).nip,
                "dateReceipt": results.rows.item(i).dateReceipt,
                "dateCreation": results.rows.item(i).dateCreation,
                "dateLastModification": results.rows.item(i).dateLastModification,
                "price": results.rows.item(i).price,
                "textReceipt": results.rows.item(i).textReceipt,
                "online": results.rows.item(i).online
              };

            }

            deferred.resolve(receipt);


          }, null);

        }, deferred.reject, deferred.resolve);
        return deferred.promise;
      },


      selectAll: function(){
        var deferred = $q.defer();
        var receiptsDB = createOrOpenDB();

        receiptsDB.transaction(function (tx) {

            tx.executeSql("SELECT * FROM receipts", [], function (tx, results) {
              var len = results.rows.length, i;

              var receiptsList = [];


              for (i = 0; i < len; i++){

                var receipt = {
                  "_id": results.rows.item(i).id,
                  "att": results.rows.item(i).att,
                  "category": results.rows.item(i).category,
                  "companyName": results.rows.item(i).companyName,
                  "nip": results.rows.item(i).nip,
                  "dateReceipt": results.rows.item(i).dateReceipt,
                  "price": results.rows.item(i).price,
                  "textReceipt": results.rows.item(i).textReceipt,
                  "online": results.rows.item(i).online
                };
                receiptsList.push(receipt);
              }

              deferred.resolve(receiptsList);


            }, null);

        }, deferred.reject, deferred.resolve);
        return deferred.promise;
      },

      selectAllOffline: function () {
        var deferred = $q.defer();
        var receiptsDB = createOrOpenDB();

        receiptsDB.transaction(function (tx) {

          tx.executeSql("SELECT * FROM receipts where online=0", [], function (tx, results) {
            var len = results.rows.length, i;

            var receiptsList = [];


            for (i = 0; i < len; i++) {

              var receipt = {
                "_id": results.rows.item(i).id,
                "att": results.rows.item(i).att,
                "category": results.rows.item(i).category,
                "companyName": results.rows.item(i).companyName,
                "nip": results.rows.item(i).nip,
                "dateReceipt": results.rows.item(i).dateReceipt,
                "price": results.rows.item(i).price,
                "textReceipt": results.rows.item(i).textReceipt,
                "online": results.rows.item(i).online
              };
              receiptsList.push(receipt);
            }

            deferred.resolve(receiptsList);


          }, null);

        }, deferred.reject, deferred.resolve);
        return deferred.promise;
      },

      update: function(receipt){


        var deferred = $q.defer();
        var receiptsDB = createOrOpenDB();

        receiptsDB.transaction(function (tx) {
          tx.executeSql("UPDATE receipts SET " +
            "category=(?), companyName=(?), nip=(?), dateReceipt=(?), price=(?), textReceipt=(?) WHERE id= (?)",
            [receipt.category, receipt.companyName, receipt.nip, receipt.dateReceipt, receipt.price, receipt.textReceipt, receipt._id]);

        }, deferred.reject, deferred.resolve);
        return deferred.promise;
      },

      updateOnlineStatus: function (receiptId) {


        var deferred = $q.defer();
        var receiptsDB = createOrOpenDB();

        receiptsDB.transaction(function (tx) {
          tx.executeSql("UPDATE receipts SET " +
            "online=1 WHERE id= (?)",
            [receiptId]);

        }, deferred.reject, deferred.resolve);
        return deferred.promise;
      },

      remove: function(receiptId){


        var deferred = $q.defer();
        var receiptsDB = createOrOpenDB();

        receiptsDB.transaction(function (tx) {
            tx.executeSql("DELETE FROM receipts WHERE id= (?)", [receiptId]);

        }, deferred.reject, deferred.resolve);
        return deferred.promise;
      },


      removeOnline: function () {


        var deferred = $q.defer();
        var receiptsDB = createOrOpenDB();

        receiptsDB.transaction(function (tx) {
          tx.executeSql("DELETE FROM receipts WHERE online=1");

        }, deferred.reject, deferred.resolve);
        return deferred.promise;
      }

    }
  }]);
