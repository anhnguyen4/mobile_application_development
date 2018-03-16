var http = require("http");
var url = require("url");
var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyBpp6qukvKfoyF58uS7ssAuD5R-dymT4BU'
});

var toRad = function(num) {
   return num * Math.PI / 180;
}

http.createServer(function(request, response) {
  var q = url.parse(request.url, true).query;
  response.writeHead(200, {"Content-Type": "text/plain"});
  if (q.latlng) {
    googleMapsClient.reverseGeocode({
      latlng: q.latlng
    }, function(err, res) {
      if (!err) {
        response.write("This location's address is " + res.json.results[0].formatted_address + "\n");
        response.end();
      } else {
        response.write("Remote server error\n");
        response.end();
      }
    });
  } else if (q.lt1 && q.lt2 && q.ln1 && q.ln2) {
    var R = 6371; // km
    var dLat = toRad(q.lt2 - q.lt1);
    var dLon = toRad(q.ln2 - q.ln1);
    var lat1 = toRad(q.lt1);
    var lat2 = toRad(q.lt2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    response.write(d.toString() + " km\n");
    response.end();
  } else {
    response.write("Invalid arguments\n");
    response.end();
  }
}).listen(8675);

console.log('Server running at http://127.0.0.1:8675/');
