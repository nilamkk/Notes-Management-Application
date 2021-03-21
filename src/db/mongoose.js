const mongoose=require('mongoose')

mongoose.connect(process.env.MONGODB_STRING,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true
})