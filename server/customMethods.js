const {
    PeopleApiService,
} = require( 'neurelo-sdk' );

const nestWithData = ( data ) =>
{
    return {
        data: {
            data
        }
    };
};

module.exports = {
    'aggregateSummary': async ( { communityId } ) =>
    {
        try
        {
            if ( !communityId ) throw { message: 'No communityId provided' };
            if ( typeof communityId !== 'string' ) throw { message: 'Invalid communityId provided' };
            // @ts-ignore
            const { data: { data: { _count: { id: peopleInCommunity } } } } = await PeopleApiService.aggregateByPeople( {
                _count: [ 'id' ],
            }, {
                communityId
            } );
            const { data: { data: peopleCheckedIn } } = await PeopleApiService.findPeople( {
                communityId: true,
                id: true,
                companyName: true,
            }, {
                communityId,
                checkedIn: true
            } );
            const peopleNotCheckedInCount = peopleInCommunity - peopleCheckedIn.length;
            return nestWithData( {
                peopleCheckedIn,
                peopleNotCheckedInCount,
                peopleCheckedInCount: peopleCheckedIn.length,
            } );
        } catch ( { message, stack, code, name } )
        {
            throw { message, stack, code, name };
        }
    },
    'checkIn': async ( personId, update ) =>
    {
        try
        {
            const { checkedIn } = update;
            if ( !personId ) throw { message: 'No personId provided' };
            if ( checkedIn === null ) throw { message: 'No checkedIn value provided' };
            if ( typeof checkedIn !== 'boolean' ) throw { message: 'Invalid checkedIn value provided' };
            if ( !checkedIn ) throw { message: 'Invalid checkedIn value provided' };
            const result = await PeopleApiService.updatePeopleById( personId, update );
            return result;
        } catch ( { message, stack, code, name } )
        {
            throw { message, stack, code, name };
        }
    },
    'checkOut': async ( personId, update ) =>
    {
        try
        {
            const { checkedIn } = update;
            if ( !personId ) throw { message: 'No personId provided' };
            if ( checkedIn === null ) throw { message: 'No checkedIn value provided' };
            if ( typeof checkedIn !== 'boolean' ) throw { message: 'Invalid checkedIn value provided' };
            if ( checkedIn ) throw { message: 'Invalid checkedIn value provided' };
            const result = await PeopleApiService.updatePeopleById( personId, update );
            return result;
        } catch ( { message, stack, code, name } )
        {
            throw { message, stack, code, name };
        }
    },
    'aggregatePeople': async ( { communityId, usePagination, skip, pageSize } ) =>
    {
        try
        {
            if ( !communityId ) throw { message: 'No communityId provided' };
            if ( typeof communityId !== 'string' ) throw { message: 'Invalid communityId provided' };
            const findPeopleArgs = [
                undefined,
                { communityId },
                [ { firstName: 'asc' } ],
                ...( usePagination ? [ skip, pageSize ] : [] ),
            ];
            const { data: { data: peopleInCommunity } } = await PeopleApiService.findPeople( 
                ...findPeopleArgs,
            );
            let peopleInCommunityCount = peopleInCommunity.length;
            if ( usePagination )
            {
                // @ts-ignore
                let { data: { data: { _count: { id: totalPeople } } } } = await PeopleApiService.aggregateByPeople( {
                    _count: [ 'id' ],
                }, {
                    communityId
                } );
                peopleInCommunityCount = totalPeople;
            }
            // @ts-ignore
            return nestWithData( {
                peopleInCommunity,
                peopleInCommunityCount,
            } );
        } catch ( { message, stack, code, name } )
        {
            throw { message, stack, code, name };
        }
    }
};