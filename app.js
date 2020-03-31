require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const spotifyApi = new SpotifyWebApi({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
	.clientCredentialsGrant()
	.then((data) => spotifyApi.setAccessToken(data.body['access_token']))
	.catch((error) => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:

app.get('/', (req, res) => {
	res.render('index');
});

app.get('/artist-search', (req, res) => {
	spotifyApi
		.searchArtists(req.query.artistName)
		.then((data) => {
			console.log('The received data from the API: ', data.body.artists.items);
			// ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
			const artists = data.body.artists.items;
			artists.forEach((artist) => {
				if (artist.name.length > 20) {
					artist.name = artist.name.slice(0, 20);
					artist.name += '...';
				}
			});
			res.render('artist-search-results', {
				artists
			});
		})
		.catch((err) => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {
	// .getArtistAlbums() code goes here
	spotifyApi
		.getArtistAlbums(req.params.artistId)
		.then((data) => {
			const albums = data.body.items;
			albums.forEach((album) => {
				if (album.name.length > 20) {
					album.name = album.name.slice(0, 20);
					album.name += '...';
				}
			});
			res.render('view-albuns', {
				albums
			});
		})
		.catch((err) => console.log(err));
});

app.get('/albums/tracks/:tracksId', (req, res, next) => {
	spotifyApi
		.getAlbumTracks(req.params.tracksId)
		.then((data) => {
			console.log(data.body);
			const tracks = data.body.items;
			res.render('view-tracks', {
				tracks
			});
		})
		.catch((err) => console.log(err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
