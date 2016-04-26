var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var config = require('./config/configServer.json');
var service = require('./service/routeService')

app.set('port', process.env.PORT || config.serverLocal.port);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));



app.use(require('connect-livereload')());

app.get('/listBook', service.getAllList);

app.get('/panier', service.getPanier);
app.get('/listOffre/:idisbn', service.getOffre);
app.use('/', express.static(__dirname + '/src'));

app.use('/img',express.static(__dirname +'/src/img/'));

app.listen(app.get('port'), function() {
	console.log('-- Express server listening on http://localhost:%d/', app.get('port'));
});
