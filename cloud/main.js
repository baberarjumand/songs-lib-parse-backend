/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns the number of records in database
 */
async function numberOfRecordsInDb() {
    const Song = Parse.Object.extend('Song');
    const query = new Parse.Query(Song);
    const count = await query.count();

    return count;
}

Parse.Cloud.define('hello', function(req, res) {
    return 'Hi';
});

Parse.Cloud.define('createSong', async (req) => {
    const currentNumberOfResultsInDb = await numberOfRecordsInDb();

    if (currentNumberOfResultsInDb < 10) {
        const Song = Parse.Object.extend('Song');
        const song = new Song();

        if (req.params.name && req.params.name.length > 0) {
            song.set('name', req.params.name);
        } else {
            song.set('name', 'song' + getRandomInt(1, 10000));
        }

        if (req.params.artist && req.params.artist.length > 0) {
            song.set('artist', req.params.artist);
        } else {
            song.set('artist', 'artist' + getRandomInt(1, 10000));
        }

        if (req.params.album && req.params.album.length > 0) {
            song.set('album', req.params.album);
        } else {
            song.set('album', 'album' + getRandomInt(1, 10000));
        }

        const saveResponse = await song.save();
        return saveResponse;
    } else {
        throw new Error('A max of 10 records are allowed in this database.');
    }
});

Parse.Cloud.define('getAllSongs', async (req) => {
    const Song = Parse.Object.extend('Song');
    const query = new Parse.Query(Song);

    // retrieve only select fields
    // query.select('name', 'artist');

    const results = await query.find();

    return results;
});

Parse.Cloud.define('deleteSong', async (req) => {
    const currentNumberOfResultsInDb = await numberOfRecordsInDb();

    if (currentNumberOfResultsInDb > 0) {
        const Song = Parse.Object.extend('Song');
        const query = new Parse.Query(Song);
        const result = await query.first();
        const deletedObject = await result.destroy();

        return 'Deleted Object with id: ' + deletedObject.id;
    } else {
        throw new Error('No records found in database to delete.');
    }
});
