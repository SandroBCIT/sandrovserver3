const port = process.env.PORT || 10000;
const server = require("http").Server();

var io = require("socket.io")(server);

var allUsers = {};

io.on("connection", function(socket){    
    socket.on("joinroom", function(roomNum){
        socket.join(roomNum);
        
        socket.myRoom = roomNum;
        
        if(!allUsers[roomNum]){
            allUsers[roomNum] = [];
        }
        
        //adds new user to array 
        allUsers[roomNum].push(socket.id);
        
        //sends updated array to all users in room
        io.to(roomNum).emit("userJoined", allUsers[roomNum]);
    });
    
    socket.on("playInstrument", function(data1, data2){
        socket.broadcast.to(this.myRoom).emit("playInstrument", data1, data2)
    })
    
    //leaving room 1
    socket.on("leftRoom", function(){
        var index = allUsers[this.myRoom].indexOf(socket.id);
            
        allUsers[this.myRoom].splice(index, 1);
        io.to(this.myRoom).emit("userJoined", allUsers[this.myRoom]);    
    })
    
    //leaving room 2
    socket.on("disconnect", function(){
        
        if(this.myRoom){
            var index = allUsers[this.myRoom].indexOf(socket.id);
            
            allUsers[this.myRoom].splice(index, 1);
            io.to(this.myRoom).emit("userJoined", allUsers[this.myRoom]);   
        }
        
    })
});

server.listen(port, (err)=>{
    if(err){
        console.log(err);
        return false;
    }
    
    console.log("Port is running");
})