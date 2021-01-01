function start(){
    loadJSON();
    loadXML();
}

async function loadJSON(){
    var result = document.getElementById('json');
    fetch('http://localhost:3000/json/07.json')
        .then(response => response.json())
        .then(resp => {
            result.innerText = JSON.stringify(resp);
        });
}

async function loadXML() {
    var result = document.getElementById('xml');
    fetch('http://localhost:3000/xml/07.xml')
        .then(response => response.text())
        .then(resp => {
            result.innerText = resp;
        });
}