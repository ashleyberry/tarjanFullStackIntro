$( document ).ready( onReady );

function onReady(){
    getSongs();
    $( '#addSongButton' ).on( 'click', addSong );
    $( document ).on( 'click', '.deleteSongBtn', deleteSong );
    $( document ).on( 'click', '.rankUpBtn', rankUp );
    $( document ).on( 'click', '.rankDownBtn', rankDown );
} // end onReady

function addSong(){
    let objectToSend = {
        rank: $( '#rankIn' ).val(),
        artist: $( '#artistIn' ).val(),
        track: $( '#trackIn' ).val(),
        published: $( '#publishedIn' ).val()
    } // end object to send
    $.ajax({
        method: 'POST',
        url: '/songs',
        data: objectToSend
    }).then( function( response ){
        console.log( 'back from POST with:', response );
        getSongs();
    }).catch( function( err ){
        alert( 'error!' );
        console.log( err );
    }) // end AJAX POST
} // end addSong

function getSongs(){
    $.ajax({
        method: 'GET',
        url: '/songs'
    }).then( function( response ){
        console.log( 'back from GET with:', response ); 
        // display songs on DOM 
        let el = $( '#songsOut' );
        el.empty();
        for( let i=0; i<response.length; i++ ){
            el.append( `<li>
            ${ response[i].rank }
            ${ response[i].track }
            ${ response[i].artist }
            ${ response[i].published.split( 'T' )[0] }
            <button class='deleteSongBtn' data-id=${response[i].id}>Delete</button>
            <button class='rankUpBtn' data-id="${response[i].id}">Up</button>
            <button class='rankDownBtn' data-id='${response[i].id}'>Down</button>
            </li>`)
        } // end for
    }).catch( function( err ){
        alert( 'error!' );
        console.log( err );
    }) // end AJAX GET
} // end getSongs()

function deleteSong(){
    // grab the 'data-id' attribute from our 'button'
    console.log( 'in deleteSong' );
    let songId = $(this).data('id');
    $.ajax({
        method: 'DELETE',
        url: `/songs/${songId}` // convention for how we pass through IDs
    }).then( function( response ){
        console.log( 'Deleted!', response )
        // refresh page (aka do another GET request)
        getSongs();
    }).catch( function( err ){
        console.log( 'error in delete', err )
        alert('oh noes!');
    }) // end AJAX
} // end deleteSong

function rankUp(){
    let songId = $(this).data('id');
    console.log('up', songId);
    $.ajax({
        method: 'PUT', // means edit
        url: `/songs/${songId}`,
        data: { // data to send
            direction: 'up'
        }
    }).then( function ( response ){
        console.log( 'response from rankUp:', response );
        getSongs();
    }).catch( function( err ){
        console.log( 'error in rankUp', err )
        alert('oh noes!');
    }) // end AJAX
} // end rankUp

function rankDown(){
    let songId = $(this).data('id');
    console.log('down', songId);
    $.ajax({
        method: 'PUT', // means edit
        url: `/songs/${songId}`,
        data: { // data to send
            direction: 'down'
        }
    }).then( function ( response ){
        console.log( 'response from rankUp:', response );
        getSongs();
    }).catch( function( err ){
        console.log( 'error in rankUp', err )
        alert('oh noes!');
    }) // end AJAX
} // end rankDown