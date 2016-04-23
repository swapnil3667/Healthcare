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

var plotly = require('plotly')("amanvidurae2c6", "6ul96petu3");

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
          var query = "SELECT * from AVERAGE_RENT where LOCATION='"+req.query.key+"'";
          console.log("okkkkk");
          console.log(req.query.key);
          conn.query(query, function(err, rows) {
            if (err) throw err;
            var data=[];
            console.log("Entering Here");
            console.log(rows);
          //    res.end(JSON.stringify(data));
            res.end(JSON.stringify(rows));
          });
      }
  });
});

app.get('/prioritise_school',function(req,res){
  console.log("comeon");
  ibmdb.open(dbConnString, function(err, conn) {
      if (err) {
          console.log("swapnil");
          console.log("Error", err);
      } else {
          var data=[];
          var query = "select * from schools_rank limit 10";
        //  var query = "SELECT COMMON_ROOM, MASTER_ROOM, HDB_2_ROOM from AVERAGE_RENT where LOCATION='"+req.query.key+"'";
          console.log("okkkkk");
          console.log(req.query.key);
          conn.query(query, function(err, rows) {
            if (err) throw err;
            console.log("Entering Here");
            console.log(rows);
            var chart_x = [];
            var chart_y = [];
            for(var i=0; i<rows.length; i++) {
              chart_x.push(rows[i].AREA);
              chart_y.push(rows[i].COUNT);
            }

            console.log(chart_x);
            console.log(chart_y);
            var chart_data = [
            {
              x: chart_x,
              y: chart_y,
              type: "bar"
            }
            ];
            var graphOptions = {filename: "prioritise_school_count", fileopt: "overwrite"};
            plotly.plot(chart_data, graphOptions, function (err, msg) {
                console.log(msg);
              });

          //    res.end(JSON.stringify(data));
            res.end(JSON.stringify(rows));
          });
      }
  });
});


app.get('/prioritise_school_and_hospital',function(req,res){
  console.log("comeon");
  ibmdb.open(dbConnString, function(err, conn) {
      if (err) {
          console.log("swapnil");
          console.log("Error", err);
      } else {
        //var query = "select post_sec, rank from hospital_score order by rank asc"
          var query = "select * from SCHOOLS_HOSPITALS_COUNT";
        //  var query = "SELECT COMMON_ROOM, MASTER_ROOM, HDB_2_ROOM from AVERAGE_RENT where LOCATION='"+req.query.key+"'";
          console.log("okkkkk");
          console.log(req.query.key);
          conn.query(query, function(err, rows) {
            if (err) throw err;
            console.log("Entering Here");
            console.log(rows);
          //    res.end(JSON.stringify(data));
            res.end(JSON.stringify(rows));
          });
      }
  });
});

app.get('/prioritise_hospital',function(req,res){
  console.log("comeon");
  ibmdb.open(dbConnString, function(err, conn) {
      if (err) {
          console.log("swapnil");
          console.log("Error", err);
      } else {
        //var query = "select post_sec, rank from hospital_score order by rank asc"
          var query = "Select  data2.Location,data1.count, data1.rank as hospital_rank from hospital_score data1,Location_Postal_Sector_Map data2 where data2.Postal_Sector=data1.POST_SEC order by hospital_rank limit 10";
        //  var query = "SELECT COMMON_ROOM, MASTER_ROOM, HDB_2_ROOM from AVERAGE_RENT where LOCATION='"+req.query.key+"'";
          console.log("okkkkk");
          console.log(req.query.key);
          conn.query(query, function(err, rows) {
            if (err) throw err;
            console.log("Entering Here");
            console.log(rows);
          //    res.end(JSON.stringify(data));
            res.end(JSON.stringify(rows));
          });
      }
  });
});

app.get('/ethnicity_analysis', function(req, res) {
  var location = req.query.key;
  console.log("ethnicity_analysis for location -- " + location);
  ibmdb.open(dbConnString, function(err, conn) {
      if (err) {
          console.log("swapnil");
          console.log("Error", err);
      } else {
        var populationQ = "select Chinese_Total AS CT, Malays_Total AS MT, Indians_Total AS IT, OthersTotal AS OT from ETHNICITY_LOCATIONS where Locations_1='" + location +"'";
          conn.query(populationQ, function(err, rows) {
            if (err) throw err;
            console.log("Ethicity Percentage enter .....");
            console.log(rows);
            if(rows.length>0){

              var dataval=[];
              dataval.push(rows[0].CT);
              dataval.push(rows[0].IT);
              dataval.push(rows[0].MT);
              dataval.push(rows[0].OT);
              var data = [{
                  hole: 0.4,
                  labels: ["Chinese", "Indians", "Malays", "Others"],
                  marker: {colors: ["#FFB03B", "#468966", "#8E2800","#00008B"]},
                  type: "pie",
                  uid:"df58a9",
                  values: dataval
              }];
              var title = "Ethnicity Percentage -- " + location;
              var layout = {
                autosize: true,
                height: 541,
                title: title,
                width: 1121
              };
              console.log(data);
              var graphOptions = {layout: layout};
              var result = {};
              result.rows = rows;
              var plotly_eth = require("plotly")("sivakumar27071990", "iqj02vf6d2");
              plotly_eth.plot(data, graphOptions, function (err1, msg) {
                console.log(msg);
                result.url = msg.url;
                console.log(err1);
                console.log("pie plot created--1");
                console.log(result);
                res.end(JSON.stringify(result));
              });
              console.log("pie plot created");
            }
          });
      }
  });
});

app.get('/nearbylocation',function(req,res){
  console.log("comeon");
  ibmdb.open(dbConnString, function(err, conn) {
      if (err) {
          console.log("swapnil");
          console.log("Error", err);
      } else {
          var query = "SELECT Location from Location_Postal_Sector_Map where  Postal_Sector in (SELECT POSTAL_SECTOR from POSTALCODE_AND_SECTOR where POSTAL_CODE in (select  POSTAL_CODE from POSTALCODE_AND_SECTOR where POSTAL_SECTOR in (SELECT Postal_Sector from Location_Postal_Sector_Map where Location='"+req.query.key+"')) and POSTAL_SECTOR not in (SELECT Postal_Sector from Location_Postal_Sector_Map where Location='"+req.query.key+"'))";
          console.log("okkkkk");
          console.log(req.query.key);
          var result_sec;
          conn.query(query, function(err, rows) {
            if (err) throw err;
            var data=[];
            console.log("Entering Here");
            console.log(rows);
            var str = "<input list=\"resultlist\" type=\"text\" name=\"resultarea\">" + "<datalist id=\"resultlist\">";
            for (var i=0; i<rows.length; i++) {
            //  console.log(data1[i].LOCATION);
                 str = str + "<option value=\"" + rows[i].LOCATION + "\"/>";
            }
            str = str + "</datalist>" + "<br>" + "<button id=\"SubmitBtnfly\" type=\"submit\">Submit</button>";
            str = str + "<table>" + "<div id=\"testfly\"></div>" + "</table>";
        //    for(i=0;i<rows.length;i++)
        //      {
        //        data.push(rows[i].COL1);
        //      }
            //  result_sec = rows[0].POSTAL_SECTOR
          //    res.end(JSON.stringify(data));
          //  res.end(JSON.stringify(rows));
            res.end(str);
          });

      }
  });
});


app.get("/rentforecast", function(req, res){
  ibmdb.open(dbConnString, function(err, conn) {
      if (err) {
          console.log("swapnil");
          console.log("Error", err);
      } else {
        console.log(req.query.key2);
        console.log(req.query.key1);
//	var median_rent = [{"RENT":1795,"YEAR":2011},{"RENT":1950,"YEAR":2012},{"RENT":2000,"YEAR":2013},{"RENT":2000,"YEAR":2014},{"RENT":1925,"YEAR":2015}];
  var query = "SELECT (SUM(\""+req.query.key2+"\") / 4) AS RENT,YEAR FROM DASH6878.MEDIAN_RENT AS MR WHERE TOWN = '"+req.query.key1+ "' GROUP BY YEAR ORDER BY YEAR";
  console.log(query);
  conn.query(query, function(err, rows) {
    console.log(rows);
    var median_rent = rows;
  var length = median_rent.length;

	var median_rent_16 = {"RENT":0,"YEAR":2016};
	var median_rent_17 = {"RENT":0,"YEAR":2017};

	median_rent_16["RENT"] = ((median_rent[length - 1]["RENT"] * 1) + (median_rent[length - 2]["RENT"] * 2) + (median_rent[length - 3]["RENT"] * 3) + (median_rent[length - 4]["RENT"] * 4)) / 10;

	median_rent.push(median_rent_16);

	length = median_rent.length;

	median_rent_17["RENT"] = ((median_rent[length - 1]["RENT"] * 1) + (median_rent[length - 2]["RENT"] * 2) + (median_rent[length - 3]["RENT"] * 3) + (median_rent[length - 4]["RENT"] * 4)) / 10;

	median_rent.push(median_rent_17);

 	var xAxis = [];
	var yAxis = [];

	for (var i = 0; i < median_rent.length; i++) {
		xAxis.push(median_rent[i]["YEAR"]);
		yAxis.push(median_rent[i]["RENT"]);
	}

	var plotData = [
	  {
	    x: xAxis,
	    y: yAxis,
	    type: "scatter"
	  }
	];

  var layout = {
  	  title: "<b>Median Rent Trend - " + "location</b>",
  	  xaxis: {
  	    title: "<b>Year</b>",
  	    titlefont: {
  	      family: "Courier New, monospace",
  	      size: 18,
  	      color: "#7f7f7f"
  	    }
  	  },
  	  yaxis: {
  	    title: "<b>Median Rent</b>",
  	    titlefont: {
  	      family: "Courier New, monospace",
  	      size: 18,
  	      color: "#7f7f7f"
  	    }
  	  }
  	};

  	var plotly = require('plotly')("amanvidurae2c6", "6ul96petu3");

  	var graphOptions = {layout: layout, filename: "date-axes", fileopt: "overwrite"};
	var url;
	var sendMsg;

	plotly.plot(plotData, graphOptions, function (err, msg) {
	    console.log(msg);
	    url = msg["url"];
	    console.log("url");
	    console.log(url);
	    sendMsg = "<iframe width=\"900\" height=\"800\" frameborder=\"0\" scrolling=\"no\" src=\"" + url + ".embed\"></iframe>";

	    console.log("sendMsg");
		console.log(sendMsg);

	    res.end(sendMsg);
	   });
  });
  }
});
});
