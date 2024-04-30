require( 'dotenv' ).config();
const MongoClient = require( 'mongodb' ).MongoClient;

const {
    MONGO_URI,
    DB_NAME,
} = process.env;

const {
    communities: COMMUNITIES_DATA,
    people: PEOPLE_DATA,
} = require( './sample' );

const dbOptions = {

};

let client;
let connection;

const connectDB = async () =>
{
    try
    {
        if ( !client )
        {
            if ( !MONGO_URI ) throw 'mongodb url (MONGO_URI) missing, check your env file or dotenv installation';
            client = await MongoClient.connect( MONGO_URI, dbOptions );
            if ( !DB_NAME ) throw 'database name (DB_NAME) missing, check your env file or dotenv installation';
            if ( !connection ) connection = client.db( DB_NAME );
            return { success: true, message: 'connection successful' };
        }
    } catch ( error )
    {
        throw error;
    }
};

const findManyData = async ( collection, query, options ) =>
{
    try
    {
        const result = await connection.collection( collection ).find( query, options ).toArray();
        return ( { success: true, data: result, message: '' } );
    } catch ( error )
    {
        throw error;
    }
};

const insertData = async ( collection, object, options ) =>
{
    try
    {
        const result = await connection.collection( collection ).insertOne( object, options );
        return ( { success: true, message: "inserted successfully", id: result.insertedId.toString() } );
    } catch ( error )
    {
        throw error;
    }
};


const deleteManyData = async ( collection, object, options ) =>
{
    try
    {
        const result = await connection.collection( collection ).deleteMany( object, options );
        return ( { success: true, message: "deleted successfully" } );
    } catch ( error )
    {
        throw error;
    }
};

const COLLECTION_NAMES = {
    Communities: 'Communities',
    People: 'People',
};


const loadInitialData = async ( emptyDB = false ) =>
{
    try
    {

        if ( emptyDB )
        {

            await deleteManyData( COLLECTION_NAMES.Communities, {} );

            await deleteManyData( COLLECTION_NAMES.People, {} );

        };

        let { data: communities } = await findManyData( COLLECTION_NAMES.Communities, {} );

        if ( !communities.length )
        {
            await Promise.all( COMMUNITIES_DATA.map( async ( community ) =>
            {
                await insertData( COLLECTION_NAMES.Communities, community );
            } ) );
            let { data } = await findManyData( COLLECTION_NAMES.Communities, {} );
            communities = data;
        }

        let { data: people } = await findManyData( COLLECTION_NAMES.People, {} );

        if ( people.length ) return;

        await Promise.all( PEOPLE_DATA.map( async ( person, idx ) =>
        {
            const community = communities[ idx % communities.length ];
            await insertData( COLLECTION_NAMES.People, {
                ...person,
                communityId: community._id,
                checkedIn: null,
                checkInDate: null,
                checkOutDate: null,
            } );
        } ) );
    } catch ( error )
    {
        throw error;
    }
};

(
    async () =>
    {
        try
        {
            await connectDB();
            await loadInitialData(  );
            console.log( 'Data loaded successfully' );
            process.exit( 0 );
        } catch ( error )
        {
            console.log( 'Error while loading data', error );
            process.exit( 1 );
        }
    }
)();
