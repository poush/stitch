exports = function(changeEvent) {
  /*
    A Database Trigger will always call a function with a changeEvent.
    Documentation on ChangeEvents: https://docs.mongodb.com/manual/reference/change-events/

    Access the _id of the changed document:
    var docId = changeEvent.documentKey._id;

    Access the latest version of the changed document
    (with Full Document enabled for Insert, Update, and Replace operations):
    var fullDocument = changeEvent.fullDocument;

    var updateDescription = changeEvent.updateDescription;

    See which fields were changed (if any):
    if (updateDescription) {
      var updatedFields = updateDescription.updatedFields; // A document containing updated fields
    }

    See which fields were removed (if any):
    if (updateDescription) {
      var removedFields = updateDescription.removedFields; // An array of removed fields
    }

    Functions run by Triggers are run as System users and have full access to Services, Functions, and MongoDB Data.

    Accessing a mongodb service:
    var collection = context.services.get("mongodb-atlas").db("db_name").collection("coll_name");
    var doc = collection.findOne({ name: "mongodb" });

    To call other named functions:
    var result = context.functions.execute("function_name", arg1, arg2);
  */
  
  user = changeEvent.fullDocument.user;
  location = changeEvent.fullDocument.location;
  
  var fruits = ["Olives","Blackberries","Oranges","Bananas","Red Grapes","Guava","Papaya","Cherries"];
  var http = context.services.get("myHttp");
  const ses = context.services.get('aws').ses("us-east-1");
  var url = "https://pixabay.com/api/?key=6107568-039c90f7f77f0df4cef745fbd&q=" + fruits[location] + "&image_type=photo&pretty=true";
  console.log(url)
  http.get({url: url}).then((res) => {
    const body = EJSON.parse(res.body.text());

    var img = body.hits[0].webformatURL;
  
    const result =  ses.SendEmail({
      Source: "ping@ipiyush.com",
      Destination: { ToAddresses: [user] },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: "<img src='" + img +"' alt='Loading Image'>"
          }
        },
        Subject: {
          Charset: "UTF-8",
          Data: "You won something for your great contribution"
        }
      }
    });
  })
  
};
