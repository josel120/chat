const { io } = require('../server');
const { Users } = require('../class/users');
const { createMessage } = require('../utils/utils');

const users = new Users();

io.on('connection', (client) => {

    client.on('enterChat', (user, callback) => {

        console.log('user',user);

        if(!user.name || !user.room){
            return callback({
                error: true,
                message: 'Name is required'
            });
        }

        client.join(user.room);

        users.addPerson(client.id, user.name, user.room);
        // client.broadcast.emit('listUser', users.getUsers());
        client.broadcast.to(user.room).emit('listUser', users.getUsersFromRoom(user.room));
        client.broadcast.to(user.room).emit('createMessage', createMessage('Administrator',`${ user.name } is now in the room`));

        callback(users.getUsersFromRoom(user.room));
    });

    client.on('createMessage', (data, callback) =>{
        let user = users.getPerson(client.id);
        let message = createMessage(user.name, data.message);
        client.broadcast.to(user.room).emit('createMessage', message);

        callback(message);

    });

    // client.on('privateMessage', data => {
    //     let user = users.getPerson(client.id);
    //     let message = createMessage(user.name, data.message);

    //     client.broadcast.to(data.to).emit('privateMessage', message);
    // });
    client.on('roomMessage', data => {
        let user = users.getPerson(client.id);
        let message = createMessage(user.name, data.message);

        client.broadcast.to(data.room).emit('roomMessage', message);
    });

    client.on('disconnect', (data) =>{
        let disconnectedUser = users.deletePerson( client.id );
        // client.broadcast.emit('createMessage', createMessage('Administrator',`${ disconnectedUser.name } has left chat`));
        // client.broadcast.emit('listUser', users.getUsers());
        client.broadcast.to(disconnectedUser.room).emit('createMessage', createMessage('Administrator',`${ disconnectedUser.name } has left the chat`));
        client.broadcast.to(disconnectedUser.room).emit('listUser', users.getUsersFromRoom(disconnectedUser.room));
    });
    

});