//BASE SETUP
//=======================================
//call the packages----------------------
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var port = process.env.PORT || 1337;
//mongoose.connect('mongodb://localhost:27017/movieDatabase1');
mongoose.connect('mongodb://webapigrader:webapigrader@ds161210.mlab.com:61210/movies')
var Movie = require('./app/models/movie');
//app configuration----------------------
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(function(req, res, next){
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, \Authorization');
	next();
});
app.use(morgan('dev'));
//ROUTES FOR API
//======================================
app.get('/',function(req, res){
	res.send('Welcome to the Home Page!!');
});
// home page
var apiRouter = express.Router();
apiRouter.use(function(req, res, next){
	console.log('Somebody just came to our app!');
	
	next();
});
//console logger
apiRouter.get('/', function(req, res){
	res.json({message: 'Hooray! Welcome to our API!!'});
});
apiRouter.route('/movies')
	.post(function(req, res){
		var movie = new Movie();
		movie.title = req.body.title;
		movie.year = req.body.year;
		movie.actor = req.body.actor;
		movie.save(function(err){
			if(err){
				if(err.code == 11000)
					return res.json({success: false,
					message: 'A movie with that title already exists.'});
				else
					return res.send(err);
			}
			res.json({message: 'Movie created!'});
		});
	})
	//end post function
	
	.get(function(req, res){
		Movie.find(function(err, movies){
			if(err) res.send(err);
			res.json(movies);
		});		
	});
	//end get function
//end /movies
apiRouter.route('/movies/:movie_id')
	.get(function(req, res){
		Movie.findByID(req.params.movie_id,
		function(err, movie){
			if(err) res.send(err);
			res.json(movie);
		});
	})
	//end get function
	.put(function(req, res){
		Movie.findById(req.params.movie_id,
		function(err, movie){
			if(err) res.send(err);
			if(req.body.title) movie.title = req.body.title;
			if(req.body.year) movie.year = req.body.year;
			if(req.body.actor) movie.actor = req.body.actor;
			movie.save(function(err){
				if(err) res.send(err);
				res.json({message: 'Movie updated!'});
			});
		});
	})
	//end put function
	.delete(function(req, res){
		Movie.remove({
			_id: req. params.movie_id
		}, function(err, user){
			if(err) return res.send(err);
			res.json({message: 'Successfully deleted.'});
		});
	});
	//end delete function
// end /users/:user_id
//register routes-----------------------
app.use('/api', apiRouter);
//START THE SERVER
//=======================================
app.listen(port);
console.log('Magic happens on port ' + port);