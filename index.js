"use strict";

var dbu = require('./database');
var Swal = require('sweetalert2');

var Placeholder = function () {
    var placeholder = ["Bir dil öğreneceğim", "Kitap okuyacağım", "Yürüyüşe çıkacağım", "Yeni şeyler keşfedeceğim", "Ders çalışacağım", "Resim çizeceğim", "Çikolata yiyeceğim", "Kahve içeceğim."];
    var i = Math.floor(Math.random() * placeholder.length);
    document.getElementById('gorev_input').placeholder = placeholder[i];
    ///$('gorev_input').attr('placeholder', placeholder[i]); // with jQuery
};
setInterval(function () {
    Placeholder();
}, 10000);

// listeners
var cbl = function () {
    document.querySelectorAll('input[id^="gorev-"]').forEach(function (item) {
        item.addEventListener('change', function () {
            dbu.updateTask(item.dataset.id, (item.checked) ? 1 : 0).then(data => {
                console.log(data, item.checked);
            });
        });
    });
}

var abl = function (){
    document.getElementById('gorev_ekle').addEventListener('click', function () {
        var inputValue = document.getElementById('gorev_input').value;
        if (inputValue) {
            dbu.insertTask(inputValue).then(data => {
                console.log(`A row has been inserted with id: ${data.lastRowID}`);
                document.getElementById('gorev_input').value = ''; // clear input
                loadList(); // reload list
            });
        }
    });
}

var dbl = function (){
    document.querySelectorAll('.deletebttn').forEach(function (item) {
        item.addEventListener('click', function () {
            dbu.deleteTask(item.dataset.id).then(data => {
                console.log(`Row(s) deleted ${data}`);
                loadList(); // reload list
            });
        });
    });
}


// change status
var changeStatus = function (value) {
    var status = document.getElementById('status');
    status.innerText = (value === undefined || value === '' || value === null) ? 'Hazır.' : value;
};

// create to-do item
var createLi = function (value, id, complete) {
    var LiNode = document.createElement('li');
    LiNode.innerHTML = "<input id='gorev-" + id + "' type='checkbox' data-id='" + id + "' " + ((complete) ? 'checked' : '') + "/><label for='gorev-" + id + "'> <h2> " + value + " </h2></label> <span class=\"deletebttn\" data-id=\"" + id + "\"> <strong>\u2718</strong> </span>";
    return LiNode;
};

// list all to-do's
var loadList = function () {
    var toDoList = document.getElementById('todolist');
    toDoList.innerHTML = '';
    dbu.getAllTasks().then((data) => {
        toDoList.innerHTML = '';
        for(var i = 0;i < data.length;i++){
            var liNode = createLi(data[i].gorev, data[i].id, data[i].type);
            toDoList.appendChild(liNode);
        }
        cbl(); // add listeners to new items
        dbl(); // add listeners to new items
        changeStatus();
    });
};

// startup
loadList();
abl();

// About Button
document.getElementsByClassName('about')[0].addEventListener('click', function () {
    Swal.fire({
        title: '<strong style="color:white;">Geliştiriciler</strong>',
        html: '<a href="https://github.com/merchizm">Merchizm</a> <br/><a href="https://github.com/Zynpnaz">Zeyish</a>',
        background: `#000 url('https://www.merich.rocks/wp-content/uploads/2020/12/Safari-Background_Emoji_Vacation.jpg')`,
        confirmButtonColor:'#6CA5EA',
        confirmButtonText:'Kapat'
    });
});