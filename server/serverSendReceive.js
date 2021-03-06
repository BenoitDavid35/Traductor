//tuto -> https://www.scriptol.fr/javascript/nodejs-serveur.php
// see -> for UPLOAD http://blog.robomatix.net/blog/uploader-un-fichier-avec-nodejs
http = require("http"),
path = require("path"),
url = require("url"),
fs = require("fs");

//fonction de retour d'erreur
function sendError(errCode, errString, response)
{
  response.writeHead(errCode, {"Content-Type": "text/plain"});
  response.write(errString + "\n");
  response.end();
  return;
}

//fonction qui va envoyer un fichier
function sendFile(err, file, response)
{
  if(err) return sendError(500, err, response);
  response.writeHead(200);
  response.write(file, "binary");
  response.end();
}

//fonction qui va permettre la réception d'un fichier
function getFile(exists, response, localpath)
{
  if(!exists) return sendError(404, '404 Not Found', response);
  fs.readFile(localpath, "binary",
   function(err, file){ sendFile(err, file, response);});
}

//fonction qui va permettre de récupérer l'URL de destination du fichier et son chemin local afin de revoyer le bon fichier au bon client
function getFilename(request, response)
{
  console.log(request.url+response);
  var urlpath = url.parse(request.url).pathname; // following domain or IP and port
  var localpath = path.join(process.cwd(), urlpath); // if we are at root
  fs.exists(localpath, function(result) { getFile(result, response, localpath)});
}

var server = http.createServer(getFilename);
server.listen(8082);
console.log("Server available...");
