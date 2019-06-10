/*
  See https://developer.github.com/v3/activity/events/types/#webhook-payload-example for
  examples of payloads.

  Try running in the console below.
*/
  
exports = function(payload) {
  
  var collection = context.services.get("mongodb-atlas").db("showoff").collection("commits");
  
  payload.commits.forEach(function(commit){
    author = commit['author']['email'];
    message = commit['message'];
    
    collection.findOneAndUpdate({"user": author}, {"$inc": {"total": 1 }}, {"upsert": true, "returnNewDocument": true}).then( (r) => {
      console.log(r);
    })
    
    // do something with message
    
  })
  
  
  
};