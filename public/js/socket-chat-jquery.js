var params = new URLSearchParams(window.location.search);

var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');

var name = params.get('name');
var room = params.get('room');

function renderizarUsuarios(personas){
    var html = '';

    html += '<li>';
    html += '    <a href="javascript:void(0)" class="active"> Chat de <span> '+params.get('room')+'</span></a>';
    html += '</li>';

    for(var i = 0; i < personas.length; i++){
        html += '<li>';
        html += '    <a data-id="'+ personas[i].id+'" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>'+personas[i].name+'<small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    divUsuarios.html(html);
}

function renderizarMensajes( message, me ){

    var newDate = new Date(message.date);
    var newHour = newDate.getHours()+':'+newDate.getMinutes();
    var html = '';

    var adminClass = "info";
    if(message.name === 'Administrator'){
        adminClass = "danger";
    }

    if(me){
        html += '<li class="reverse">';
        html += '<div class="chat-content">';
        html += '    <h5>'+ message.name +'</h5>';
        html += '    <div class="box bg-light-inverse">'+ message.message +'</div>';
        html += '</div>';
        html += '<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '<div class="chat-time">'+newHour+'</div>';
    }else{
        html += '<li class="animated fadeIn">';
        if(message.name !== 'Administrator'){
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += '    <div class="chat-content">';
        html += '        <h5>'+ message.name +'</h5>';
        html += '        <div class="box bg-light-'+adminClass+'">'+ message.message +'</div>';
        html += '    </div>';
        html += '    <div class="chat-time">'+newHour+'</div>';
        html += '</li>';
    }



    divChatbox.append(html);
}

divUsuarios.on('click', 'a', function(){
    var id = $(this).data('id');
    if(id){
        console.log('id',id);
    }
})

formEnviar.on('submit', function(e){
    e.preventDefault();

    if(txtMensaje.val().trim().length === 0){ return;}

    socket.emit('createMessage',{
        name,
        message: txtMensaje.val()
    }, function(message){
        txtMensaje.val('').focus();
        renderizarMensajes(message, true);
        scrollBottom();
    });

})

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}