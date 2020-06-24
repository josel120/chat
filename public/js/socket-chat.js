var socket = io();

var params = new URLSearchParams( window.location.search );

if( !params.has('name') || !params.has('room')){
    window.location = 'index.html';
    throw new Error('Name and room is required');
}

let user = {
    name: params.get('name'),
    room: params.get('room')
};

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('enterChat', user, (response)=>{
        renderizarUsuarios(response);
        scrollBottom();
        // console.log('Conected Users',response)
    });
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});

// Escuchar información
socket.on('createMessage', function(message) {
    renderizarMensajes(message, false);
});
socket.on('listUser', function(listUsers) {

    console.log(listUsers);

});

socket.on('privateMessage', function(message){
    console.log('privateMessage:',message);
});
socket.on('roomMessage', function(message){
    console.log('roomMessage:',message);
});

socket.on('groupMessage', function(message){
    console.log('groupMessage:',message);
});
