var time = new Date();
console.log('This is new schedule job log ', time);

function mycoolection() {
    console.log("hai from scheduler");
}
mycoolection();
var Parse = require('parse/node');
Parse.initialize('8PsWDzjb8gZN8I2ytJCKQiA4wP8hiL5jRt4hecwI', 'XlEdqca7cbDXkjU47QUJsjzFWY2K50jWfpDWTSkh', '41tclTmcekJEnOzBcHTULQptqfndEMiAtN6VeGin');
Parse.serverURL = 'https://wellkeptbeauty.herokuapp.com/parse/';

 var query = new Parse.Query("MyCollection");
        query.include('PurchasedUserID');
        query.find().then(function(res) {
            console.log("after query is :" + JSON.stringify(res));
            for (var i = 0; i < res.length; i++) {
                var expirydate = res[i].get('PExpirationDate');
                var inputDate = new Date(expirydate);
                var todaysDate = new Date();
                if ((inputDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0))) {
                    console.log("object id is" + res[i].get('PurchasedUserID').get('username'));
                    
            
	 	var email=res[i].get('PurchasedUserID').get('username');
	 var query = new Parse.Query(Parse.Installation);
  query.exists("deviceToken");
      query.equalTo('userId',email);
	console.log("inner query is",email);
	console.log("product name is"+res[i].get('PProductName'));
	
var message="Hello Beautiful! your "+res[i].get('PProductName')+"expirs today.Make sure to toss it and order a new one!";

  // here you can add other conditions e.g. to send a push to sepcific users or channel etc.

  var payload = {
	  title:"Well-Kept Beauty",
    alert: message,
	  sound: "default",
	    badge: 1,
            'content-available': 1
      // you can add other stuff here...
  };


  Parse.Push.send({
      data: payload,
      where: query
    }, {
      useMasterKey: true
    })
    .then(function() {
      response.success("Push Sent!");
    }, function(error) {
      response.error("Error while trying to send push " + error.message);
    });
                    

                       console.log("equal");
                    //res.success("object id is"+JSON.stringify(result));
                } else {
                        console.log("iosPushforsingleuser not equal :")
                }
            }
                        console.log("final result :",results)
            status.success("final result " + results);
            
        }, function queryFailed(reason) {
                        console.log("queryFailed  :",reason)
            status.error("query unsuccessful, length of result " + result.length + ", error:" + error.code + " " + error.message);
        });
