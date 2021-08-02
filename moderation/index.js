const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());


app.post('/events',async(req,res) => {
    const data = req.body.data;
    switch(req.body.type) {
        case 'CommentCreated': {
            const {postId,id,content} =data;
            const status = data.content.includes('orange') ? 'rejected': 'approved';

            await axios.post('http://localhost:4005/events',{
                type: 'CommentModerated',
                data: {postId,id,content,status}
            })
            break;
        }
    }

    res.send({});
})

app.listen(4003,()=>{
    console.log("Listern on port",4003);
})