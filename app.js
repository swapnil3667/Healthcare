/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

var ibmdb = require('ibm_db');

var dbConnString = "DATABASE=BLUDB;HOSTNAME=dashdb-entry-yp-dal09-07.services.dal.bluemix.net;PORT=50000;PROTOCOL=TCPIP;UID=dash6878;PWD=xAYarZfJhl61;";

app.get('/search',function(req,res){
    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);

    ibmdb.open(dbConnString, function(err, conn) {
        if (err) {
            console.log("swapnil");
            console.log("Error", err);
        } else {
            var query = "SELECT * FROM TEST";
            conn.query(query, function(err, rows) {
                if (err) {
                    console.log("swapnil");
                    console.log("Error", err);
                    return;
                } else {
                    console.log(rows);
                    conn.close(function() {
                        console.log("Connection closed successfully");
                    });
                }
            });
        }
    })
});

app.get('/search1',function(req,res){
  console.log("comeon");
  ibmdb.open(dbConnString, function(err, conn) {
      if (err) {
          console.log("swapnil");
          console.log("Error", err);
      } else {
          var query = "SELECT COL1 from TEST where COL2='"+req.query.key+"'";
          console.log("okkkkk");
          console.log(req.query.key);
          conn.query(query, function(err, rows) {
            if (err) throw err;
            var data=[];
            console.log("Entering Here");
            console.log(rows);
            for(i=0;i<rows.length;i++)
              {
                data.push(rows[i].COL1);
              }
              res.end(JSON.stringify(data));
          });
      }
  });
});
