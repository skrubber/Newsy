
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


