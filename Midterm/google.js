function authenticate() {
  return gapi.auth2.getAuthInstance()
      .signIn({scope: "https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send"})
      .then(function() { console.log("Sign-in successful");
      updateSigninStatus(true)},
            function(err) { console.error("Error signing in", err); });
}

function loadClient() {
  gapi.client.setApiKey("AIzaSyBM-0pKFORZ6oHvG71mZftMHTcXzLmBtw4");
  return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
      .then(function() { console.log("GAPI client loaded for API"); },
            function(err) { console.error("Error loading GAPI client for API", err); });
}
function loadClient2(){
  gapi.client.setApiKey("AIzaSyBM-0pKFORZ6oHvG71mZftMHTcXzLmBtw4");
  return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest")
      .then(function() { console.log("GAPI client loaded for API"); },
            function(err) { console.error("Error loading GAPI client for API", err); });
  }
// Make sure the client is loaded and sign-in is complete before calling this method.
function search() {
  var keyword = document.querySelector("#searchBar").value;
  var main = document.querySelector("#main");
  return gapi.client.youtube.search.list({
    "part": "snippet",
    "order": "relevance",
    "q": `${keyword}`,
    "type": "video"
  })
      .then(function(response) {
            console.log("Response",response);
            var output =`<h4 style="center-align;">Related Videos<h4>`;
            var container = document.querySelector("#video-container");
            var counter = 1;
            for (item of response.result.items){
              var id = item.id.videoId;
              var url = "https://www.youtube.com/embed/"+id;
              var title = item.snippet.title;
              output +=`<div style="font:Bebas Neue;">
              <div>${counter}.${title}</div>
                        <iframe width="auto" height="auto" src=${url}
                        <frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        </div>`
              counter=counter+1;
            }
            console.log("success")
            container.innerHTML = output;
            },
            function(err) { console.error("Execute error", err); alert("error!")});
}
gapi.load("client:auth2", function() {
  gapi.auth2.init({client_id: "411935288663-s3rfe141sd25hqecu4qonocjp37arpon.apps.googleusercontent.com"});
  updateSigninStatus(false);
});

function updateSigninStatus(isSignedIn) {
        var authorizeButton =  document.querySelector("#loginButton");
        var signoutButton = document.querySelector("#logoutButton")
        if (isSignedIn) {
          authorizeButton.style.display = 'none';
          signoutButton.style.display = 'block';
        } else {
          authorizeButton.style.display = 'block';
          signoutButton.style.display = 'none';
        }
      }
function signOut() {
          var auth2 = gapi.auth2.getAuthInstance();
          auth2.signOut().then(function () {
            console.log('User signed out.');
            updateSigninStatus(false);
          });
        }
function sendMessage() {
          // Using the js-base64 library for encoding:
          var email = document.querySelector("#emailAdress").value;
          var status = document.querySelector("#status")
          var output = "";
          var order = 1;
          var wish_list = document.querySelector("#wishList");
          for(each of wish_list.children){
            output+= `${order}. ${each.innerHTML.split(" <button ")[0]}\n`;
            order+=1;
          }
          var title = document.querySelector("#mytitle").innerHTML;
          const message =
          `To: ${email}\r\n` +
          `Subject: ${title} wishList\r\n\r\n` +
          output;


          // The body needs to be base64url encoded.
const encodedMessage = btoa(message)

const readedEncodedMessage = encodedMessage.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
gapi.client.gmail.users.messages.send({
    'userId': 'me',
    'resource': {
      'raw': readedEncodedMessage
              }
          }).then(function () {status.innerHTML = "successfully send to: "+email});
}
