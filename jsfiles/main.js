
function opendoc() {
    var Comp = localStorage.getItem('CompanyID');
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) { window.location.href = './../' + Comp + '.docx'; }
    };
    xhttp.open("GET", "/doc/" + Comp, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}
var obj1 = {
    "name": "name1",
    "fruit":"Orange",
    "Link":"123"
  };
  var obj2 = {
    "name": "name3",
    "fruit":"Apple",
    "Link":"xyz"
  };
  var obj3 = {
    "name": "name1",
    "fruit":"CUstard",
    "Link":"abc"
  };
