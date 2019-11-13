let mongoose = require('mongoose'); //dependency to connect Node with Mongo
mongoose.Promise = global.Promise; // 

let studentSchema = mongoose.Schema({ //Schema is a meethod to build a schema, you pass in an object with the attributes the schema will have
	firstName : { type : String }, //
	lastName : { type : String },
	id : { type : Number, required : true }
});

let Student = mongoose.model('Student', studentSchema); //Model is a method to create a collection
