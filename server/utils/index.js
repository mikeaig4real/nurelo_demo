const isEmptyObject = ( obj ) => Object.keys( obj ).length === 0;

const modifyResult = ( methodName, { data } ) =>
{
    return data?.data;
};

const registerMethods = async ( { excluded, methodNames, socket, methods, io } ) =>
{
    const registeredMethods = [];
    for ( const methodName of methodNames )
    {
        if ( excluded.some( (/** @type {string} */ prefix ) => methodName.startsWith( prefix ) ) ) continue;
        socket.on( methodName, async (/** @type {any[]} */ ...args ) =>
        {
            const ack = args.length && typeof args[ args.length - 1 ] === 'function' ? args.pop() : null;
            try
            {
                const [ arg1 ] = args;
                const callWithArgs = arg1 && ( typeof arg1 === 'object' && !isEmptyObject( arg1 ) || typeof arg1 !== 'object' );
                const result = callWithArgs ? await methods[ methodName ]( ...args ) : await methods[ methodName ]();
                ack && ack( modifyResult( methodName, result ), null );
            } catch ( { status, code, message, stack, name } )
            {
                ack && ack( null, { status, code, message, stack, name } );
            }
        } );
        registeredMethods.push( methodName );
    }
    return registeredMethods;
};

const registerServiceMethods = async ( service, io, socket ) =>
{
    const excluded = [ 'constructor', 'update', 'create', 'delete' ];
    const prototype = Object.getPrototypeOf( service );
    const nameOfService = service.constructor.name;
    const methodNames = Object.getOwnPropertyNames( prototype ).filter( name =>
    {
        return typeof service[ name ] === 'function';
    } );
    const registeredMethods = await registerMethods( { excluded, methodNames, socket, methods: service, io } );
    console.table( registeredMethods.map( methodName => ( { [ nameOfService ]: methodName } ) ) );
};


const registerCustomMethods = async ( methods, io, socket ) =>
{
    const methodNames = Object.keys( methods );
    const registeredMethods = await registerMethods( { excluded: [], methodNames, socket, methods, io } );
    console.table( registeredMethods.map( methodName => ( { 'CustomMethods': methodName } ) ) );
};


module.exports = {
    registerServiceMethods,
    registerCustomMethods,
    modifyResult,
    isEmptyObject,
};