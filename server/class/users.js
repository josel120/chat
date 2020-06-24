class Users{
    constructor(){
        this.person = [];
    }

    addPerson(id, name, room){
        let person = { id, name, room};
        this.person.push(person);
        return this.person;
    }

    getPerson(id){
        let person = this.person.filter(per => per.id === id)[0];
        return person;
    }
    getUsers(id){
        return this.person;
    }
    getUsersFromRoom(room){
        let peopleInRoom = this.person.filter(per => per.room === room);
        return peopleInRoom;
    }

    deletePerson(id){
        let deletedPerson = this.getPerson(id);
        this.person = this.person.filter( per => per.id !== id);
        return deletedPerson;
    }
}

module.exports ={
    Users
}