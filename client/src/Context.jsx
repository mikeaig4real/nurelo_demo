import React, { useContext, createContext, useReducer } from 'react';
import { Texts, Events, Actions as actions } from "./constants";
import { socket } from "./socket";
import { reducer } from "./reducer";


const initialState = {
    communityId: Texts.SELECT_AN_EVENT,
    communities: [ { id: 0, name: "" } ],
    loadingCommunities: true,
    loadingPeople: true,
    loadingSummary: true,
    summary: {
        peopleCheckedIn: [],
        peopleNotCheckedInCount: 0,
        peopleCheckedInCount: 0,
    },
    page: 1,
    usePagination: false,
    people: [],
    totalPages: 0,
    pageSize: 30,
    checkInSuccess: '',
    checkOutSuccess: '',
};


// @ts-ignore
const AppContext = createContext( );

// eslint-disable-next-line react/prop-types
const AppProvider = ( { children } ) =>
{
    // @ts-ignore
    const [ state, dispatch ] = useReducer( reducer, initialState );

    const changeCommunityId = ( id ) =>
    {
        // @ts-ignore
        dispatch( { type: actions.SET_COMMUNITY_ID, payload: id } );
    }

    const changeLoading = ( isLoading ) =>
    {
        // @ts-ignore
        dispatch( { type: actions.SET_IS_LOADING, payload: isLoading } );
    }

    const changeCommunities = ( communities ) =>
    {
        // @ts-ignore
        dispatch( { type: actions.SET_COMMUNITIES, payload: communities } );
    }

    const getCommunities = () =>
    {
        // @ts-ignore
        dispatch( { type: actions.FETCH_COMMUNITIES_START } );
        socket.connect();
        socket.emit( Events.findCommunities, {}, ( data, error ) =>
        {
            if ( error )
            {
                console.error( error );
                error.message = 'Error fetching communities';
                // @ts-ignore
                dispatch( { type: actions.FETCH_COMMUNITIES_END } );
                return;
            }
            // @ts-ignore
            dispatch( { type: actions.SET_COMMUNITIES, payload: data } );
            // @ts-ignore
            dispatch( { type: actions.FETCH_COMMUNITIES_END } );
        } );
    }


    const getSummary = () =>
    {
        if ( state.communityId === Texts.SELECT_AN_EVENT )
        {
            // @ts-ignore
            dispatch( { type: actions.SET_SUMMARY, payload: initialState.summary } );
            return;
        }
        // @ts-ignore
        dispatch( { type: actions.FETCH_SUMMARY_START } );
        socket.emit( Events.aggregateSummary, { communityId: state.communityId }, ( data, error ) =>
        {
            if ( error )
            {
                console.error( error );
                // @ts-ignore
                dispatch( { type: actions.FETCH_SUMMARY_END } );
                return;
            }
            // @ts-ignore
            dispatch( { type: actions.SET_SUMMARY, payload: { ...state.summary, ...data } } );
            // @ts-ignore
            dispatch( { type: actions.FETCH_SUMMARY_END, payload: false } );
        } );
    }

    const getPeople = () =>
    {
        if ( state.communityId === Texts.SELECT_AN_EVENT )
        {
            // @ts-ignore
            dispatch( { type: actions.SET_PEOPLE, payload: [] } );
            // @ts-ignore
            dispatch( { type: actions.SET_USE_PAGINATION, payload: false } );
            return;
        }
        // @ts-ignore
        dispatch( { type: actions.FETCH_PEOPLE_START } );
        const skip = ( state.page - 1 ) * state.pageSize;
        socket.emit( Events.aggregatePeople, { communityId: state.communityId, usePagination: state.usePagination, skip, pageSize: state.pageSize }, ( data, error ) =>
        {
            if ( error )
            {
                console.error( error );
                error.message = 'Error fetching people';
                // @ts-ignore
                dispatch( { type: actions.SET_IS_LOADING, payload: false } );
                return;
            }
            const { peopleInCommunity, peopleInCommunityCount } = data;
            // @ts-ignore
            dispatch( { type: actions.SET_PEOPLE, payload: peopleInCommunity } );
            // @ts-ignore
            dispatch( { type: actions.SET_TOTAL_PAGES, payload: Math.ceil( peopleInCommunityCount / state.pageSize ) } );
            // @ts-ignore
            dispatch( { type: actions.FETCH_PEOPLE_END } );
        } );
    }

    const toggleUsePagination = () =>
    {
        // @ts-ignore
        dispatch( { type: actions.SET_USE_PAGINATION, payload: !state.usePagination } );
    }

    const checkInPerson = ( personId, update ) =>
    {
        // @ts-ignore
        socket.emit( Events.checkIn, personId, update, ( data, error ) =>
        {
            if ( error )
            {
                console.error( error );
                // @ts-ignore
                dispatch( { type: actions.SET_CHECK_IN_SUCCESS, payload: 'false' } );
                error.message = 'Error checking in person';
                return;
            }
            // @ts-ignore
            dispatch( { type: actions.SET_CHECK_IN_SUCCESS, payload: 'true' } );
            getSummary();
        } );
    }

    const checkOutPerson = ( personId, update ) =>
    {
        socket.emit( Events.checkOut, personId, update, ( data, error ) =>
        {
            if ( error )
            {
                console.error( error );
                // @ts-ignore
                dispatch( { type: actions.SET_CHECK_OUT_SUCCESS, payload: 'false' } );
                error.message = 'Error checking out person';
                return;
            }
            // @ts-ignore
            dispatch( { type: actions.SET_CHECK_OUT_SUCCESS, payload: 'true' } );
            getSummary();
        } );
    }

    const setPage = ( page ) =>
    {
        // @ts-ignore
        dispatch( { type: actions.SET_PAGE, payload: page } );
    }

    return (
        <AppContext.Provider value={ {
            // @ts-ignore
            ...state,
            changeCommunityId,
            changeLoading,
            changeCommunities,
            getCommunities,
            getSummary,
            getPeople,
            toggleUsePagination,
            checkInPerson,
            checkOutPerson,
            setPage,
        } }>
            { children }
        </AppContext.Provider>
    );
};

const useAppContext = () =>
{
    return useContext( AppContext );
};

// eslint-disable-next-line react-refresh/only-export-components
export { AppProvider, initialState, useAppContext };
