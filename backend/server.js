const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors')

const server = express();

// Add bodyParser middleware
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.use(cors())

//database connect
const db = mysql.createConnection({
      host:"localhost",
      user:"root",
      password:"",
      database:"angular-db",
});

db.connect(function (error) {
      if(error){
            console.log("Error Connecting to DB");
      }
      else{
            console.log("Successfully Connected to DB");
      }
})

server.listen(8000,function check(error) {
      if(error) {
            console.log("Error...!!!");
      }
      else {
            console.log("Started...!!!");
      }
});


//create record

server.post("/api/student/add",(req,res) => {
      // console.log(req.body)
      let details = {
            stName:req.body.stName,
            dob:req.body.dob,
            address:req.body.address,
            contactNumber:req.body.contactNumber,
            email:req.body.email,
      };
      let sql = "INSERT INTO student SET ?";
      db.query(sql,details,(error) => {
            if(error){
                  res.send({status: false, message: "Student created failed"});
            }
            else{
                  res.send({status: true, message: "Student created successfully"});
            }
      })
});

// View record

server.get("/api/student",(req,res)=>{
      var sql = "SELECT * FROM student";
      db.query(sql,function(error,result){
            if(error){
                  console.log("Error Connecting to DB");
            }
            else{
                  res.send({status:true, data:result});
            }
      });
});

//Search record

server.get("/api/student/:id", (req,res) =>{
      var studentId = req.params.id;
      var sql = "SELECT * FROM student WHERE id="+studentId;
      db.query(sql, function (error,result) {
            if(error){
                  console.log("Error Connecting to DB");
            }
            else{
                  res.send({status:true, data:result});
            }
      });
});

// update record

server.put("/api/student/update/:id",(req,res) => {
      let sql = "UPDATE student SET stName='" +
      req.body.stName +
      "',dob='"+
      req.body.dob +
      "',address='"+
      req.body.address +
      "',contactNumber='"+
      req.body.contactNumber +
      "',email='"+
      req.body.email + "' WHERE id="+
      req.params.id;

      let a = db.query(sql,(error,result)=> {
            if(error) {
                res.send({status:false, message: "Student Updated Failed"}); 
            }
            else {
                  res.send({status:true, message: "Student Updated Successfully"}); 
            }
      })

});

//delete record

server.delete("/api/student/delete/:id", (req, res) => {
      let sql = "DELETE FROM student WHERE id = ?";
      let query = db.query(sql, [req.params.id], (error) => {
        if (error) {
          res.send({ status: false, message: "Student Deletion Failed" });
        } else {
          res.send({ status: true, message: "Student Deleted Successfully" });
        }
      });
});
    