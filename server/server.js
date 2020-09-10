// requries
const express = require( 'express' );
const app = express();
const bodyParser = require( 'body-parser' );
const pg = require( 'pg' ); // this is what lets us talk to db

// uses
app.use( express.static( 'server/public' ) );
app.use( bodyParser.urlencoded( { extended: true } ) );

// globals
const port = 3000;

// db setup
const Pool = pg.Pool;
// configure the connection to db
const pool = new Pool({
    database: "music_library", // db name (NOT table name)
    host: "localhost", // deafult when running locally, will change when deploying
    port: 5432, // default port for local, also will change when deployed
    max: 12, // max # of connections
    idleTimeoutMillis: 20000 // connection time out in ms
}); // end pool setup

// spin up server
app.listen( port, ()=>{
    console.log( 'server up:', port );
}) // end server up

app.get( '/songs', ( req, res )=>{
    console.log( 'in /songs GET' );
    // test query: top 40 songs by rank
    // SELECT * FROM "songs" ORDER BY "rank" DESC LIMIT 40;
    const queryString = 'SELECT * FROM "songs" ORDER BY "rank" ASC LIMIT 40;';
    pool.query( queryString ).then( ( results )=>{
        res.send( results.rows ); //runs if query was successful
    }).catch( ( err )=>{
        console.log( err ); // if there was an error running query
        res.sendStatus( 500 );
    }) // end query
}) // end /songs GET

app.post( '/songs', ( req, res )=>{
    console.log( 'in /songs POST:', req.body );
    // create query string
    const queryString = `INSERT INTO "songs" (rank, artist, track, published) VALUES ( $1, $2, $3, $4 )`;
    // ask pool to run our Query String
    pool.query( queryString, [ req.body.rank, req.body.artist, req.body.track, req.body.published ] ).then( ( results )=>{
        res.sendStatus( 201 ); // success, created
    }).catch( ( err ) =>{
        console.log( err );
        res.sendStatus( 500 );
    }) // end query
}) // end /songs POST

app.delete( '/songs/:id', ( req, res )=>{
    //grab the :id param from the URL
    let songId = req.params.id;
    const queryString = `DELETE FROM "songs" WHERE "id" = $1;`;
    console.log( 'going to delete songs with id=', songId );
    // execute DB query
    pool.query( queryString, [ songId ] )
    .then( ( response ) => {
        console.log( 'deleted song!' );
        res.sendStatus( 200 ); // ALWAYS need some kind of response. 200 would send back OK
    }).catch( ( err ) => {
        console.log( 'error deleting song', err );
        res.sendStatus( 500 );
    }) // end catch
}) // end delete song

app.put( '/songs/:id', ( req, res )=>{
    // param is what song to do that to. 
    // req.body is data - object that contains data whether going up or down
    console.log( 'params', req.params.id, req.body ); 
    let queryString = '';
    if( req.body.direction === 'up' ){
        queryString = `UPDATE "songs" SET "rank" = "rank"+1 WHERE "id" = $1`; // first put ${req.params.id} instead of $1 to test
    } else if (req.body.direction === 'down'){
        queryString = `UPDATE "songs" SET "rank" = "rank"-1 WHERE "id" = $1`;
    } else {
        console.log( 'send better data' );
    }
    pool.query( queryString, [ req.params.id ] ) // first used just ( queryString ) when testing, then added [r.p.i]
    .then(( result ) => {
        console.log( 'result from PUT:', result );
        res.sendStatus( 200 );
    }).catch(( err ) => {
        console.log( 'result from PUT:', err );
        res.sendStatus( 500 )
    }) 
})// end edit rank