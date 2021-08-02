const express = require('express');
const cors = require('cors');
const app = express();
const axios = require('axios');
app.use(express.json());
app.use(cors());


const posts ={};
app.get('/posts',(req, res) => {
    res.send(posts);
});

const handelEvents = (type,data)=>{
    switch(type) {
        case 'PostCreated': {
            const {id,title} =data;
            posts[id] = {id,title,comments: []};
            break;
        }
        case 'CommentCreated': {
            const {postId,id,content,status} =data;
            const post = posts[postId];
            post.comments.push({id,content,status});
            break;
        }

        case 'commentUpdated':{
            const {postId,id,content,status} = data;
            const post = posts[postId];
            const comment = post.comments.find(comment =>{
                return comment.id === id;
            })

            comment.status = status;
            comment.content = content;
            break;
        }
    }
}

app.post('/events', (req, res) => {
    const data = req.body.data;
    const type = req.body.type;
   
    handelEvents(type, data);
    res.send({});
});

app.listen(4002,async ()=>{
    console.log('Listinig on Port ',4002);
    try {
        const res = await axios.get('http://localhost:4005/events');
        for(let events of res.data){
            console.log("Event Is processing-->", events);
            handelEvents(events.type, events.data);
        }
    } catch (error) {
        console.log(error);
    }
    
})