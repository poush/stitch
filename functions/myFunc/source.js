

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
  if(changeEvent.fullDocument.total % 10 == 0){
     const http = context.services.get("myHttp");

    http.get({url: "https://www.random.org/integers/?num=1&min=0&max=49&col=1&base=10&format=plain&rnd=new"}).then((res) => {
        const body = EJSON.parse(res.body.text());
        // console.log(body);
      // const twilio = context.services.get("twilio");
      var db = context.services.get("mongodb-atlas").db("showoff").collection("trips");
      db.insertOne({"user": changeEvent.fullDocument.user, "location": parseInt(res) });
      // twilio.send({
      //   to: "+919818325292",
      //   from: context.values.get("twilioNumber"),
      //   body: changeEvent.fullDocument.user + " - " + places[parseInt(res)]
      // });
    });
  }
};
