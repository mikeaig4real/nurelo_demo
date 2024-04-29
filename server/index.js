require( "dotenv" ).config();

const { Server } = require( "socket.io" );

const {
    CommunitiesApiService,
    PeopleApiService,
} = require( 'neurelo-sdk' );

const CustomMethods = require( './customMethods.js' );

const {
    registerServiceMethods,
    registerCustomMethods,
} = require( './utils' );

const {
    BE_PORT = 8000,
    FE_PORT = 5173,
} = process.env;

const io = new Server( +BE_PORT, {
    cors: {
        origin: `http://localhost:${ FE_PORT }`,
    },
} );

io.on( "connection", async ( socket ) =>
{
    console.log('A user connected')
    registerServiceMethods( CommunitiesApiService, io, socket );
    registerServiceMethods( PeopleApiService, io, socket );
    registerCustomMethods( CustomMethods, io, socket );
    socket.on( "disconnect", () =>
    {
        console.log( "A user disconnected" );
    } );
} );

console.log( `SOCKET.IO Server is running on http://localhost:${ BE_PORT }. Registered events can be found below...` );