const { io } = require('../index');


const Bands = require('../models/bands');
const Band = require('../models/band');

const bands = new Bands();

bands.addBand( new Band( 'Kiss' ) );
bands.addBand( new Band( 'Bon Jovi' ) );
bands.addBand( new Band( 'Héroes del Silencio' ) );
bands.addBand( new Band( 'Metallica' ) );

console.log(bands);


// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    // emits bands list
    client.emit('active-bands', bands.getBands() );


    // state disconnect
    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });


    // emits new txt "Nuevo mensaje"
    client.on('mensaje', ( payload ) => {
        console.log('Mensaje', payload);
        io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );
    });


    // broadcast(emits to all except initial emitter) message 
    client.on('nuevo-mensaje', ( payload ) => {
        console.log(payload);

        // to all socket listeners
        //io.emit( 'nuevo-mensaje', payload );

        // to socket listeners accept emitter
        client.broadcast.emit('nuevo-mensaje', payload);        
    });


    // add vote to band
    client.on('vote-band', (payload) => {
        //console.log(payload);
        bands.voteBand( payload.id );
        io.emit('active-bands', bands.getBands() );

    })


    // add band
    client.on('add-band', ( payload ) => {
        console.log(payload);
        bands.addBand( new Band( payload.name ));
        io.emit('active-bands', bands.getBands() );


        /* const newBand = new Band( payload.name );
        bands.addBand( newBand );
        io.emit('active-bands', bands.getBands() ); */
    })


    // delete band
    client.on('delete-band', (payload) => {
        bands.deleteBand( payload.id );
        io.emit('active-bands', bands.getBands())
    })
});
