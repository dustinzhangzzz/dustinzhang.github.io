function creataList(){
  document.querySelector("#warning").style.display="none";
  var button = document.querySelector("#creatList");
  button.style.display = "none";
  var input = document.querySelector("#inputTitle");
  var button = document.querySelector("#titleSaver");
  document.querySelector("#enterTitle").style.display="inline";
  input.style.display = "inline";
  button.style.display = "inline";
}
function saveTitle(){
  var input = document.querySelector("#inputTitle");
  var parent = document.querySelector("#main");
  var inputVal = input.value;
  var mytitle = document.querySelector("#mytitle");
  var saver = document.querySelector("#titleSaver")
  mytitle.innerHTML = inputVal;
  document.querySelector("#searchBar").style.display = "inline";
  document.querySelector("#searchButton").style.display = "inline";
  document.querySelector("#addproduct").style.display = "inline";
  var changebutton = document.querySelector("#changetitle");
  changebutton.style.display ="inline";
  saver.style.display ="none";
  input.style.display="none";
  document.querySelector("#enterTitle").style.display="none";
  document.querySelector("#share").style.display="block"

}
function changeTitle(){
  var input = document.querySelector("#inputTitle");
  var saver = document.querySelector("#titleSaver")
  var mytitle = document.querySelector("#mytitle");
  mytitle.innerHTML = "";
  input.style.display="inline";
  saver.style.display="inline";
  document.querySelector("#enterTitle").style.display="inline";
  var changebutton = document.querySelector("#changetitle");
  changebutton.style.display ="none";

}
function addproduct(){
  var videoContainer = document.querySelector("#video-container");
  videoContainer.innerHTML="";
  var product = document.createElement("LI");
  product.innerHTML = document.querySelector("#searchBar").value+"      ";
  var list = document.getElementById("wishList");
  list.appendChild(product);
  var delButton = document.createElement("button");
  delButton.className = "delete";
  delButton.innerHTML ="delete this product";
  delButton.addEventListener("click", function(){
    var parent = this.parentElement;
    parent.removeChild(this);
  }.bind(product));
  product.appendChild(delButton);
}
