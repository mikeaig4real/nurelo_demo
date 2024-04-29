import { Actions as actions } from "./constants";


export const reducer = ( state, action ) =>
{
    const { type, payload } = action;
    const actionToStateMap = {
        [ actions.SET_COMMUNITY_ID ]: { ...state, communityId: payload },
        [ actions.SET_COMMUNITIES ]: { ...state, communities: payload },
        [ actions.SET_IS_LOADING ]: { ...state, isLoading: payload },
        [ actions.SET_SUMMARY ]: { ...state, summary: payload },
        [ actions.SET_PAGE ]: { ...state, page: payload },
        [ actions.SET_USE_PAGINATION ]: { ...state, usePagination: payload },
        [ actions.SET_PEOPLE ]: { ...state, people: payload },
        [ actions.SET_TOTAL_PAGES ]: { ...state, totalPages: payload },
        [ actions.SET_PAGE_SIZE ]: { ...state, pageSize: payload },
        [ actions.FETCH_COMMUNITIES_START ]: {
            ...state,
            loadingCommunities: true,
            loadingSummary: true,
            loadingPeople: true,
        },
        [ actions.FETCH_PEOPLE_START ]: {
            ...state,
            loadingPeople: true,
        },
        [ actions.FETCH_SUMMARY_START ]: {
            ...state,
            loadingSummary: true,
        },
        [ actions.FETCH_COMMUNITIES_END ]: {
            ...state,
            loadingCommunities: false,
            loadingSummary: false,
            loadingPeople: false,
        },
        [ actions.FETCH_PEOPLE_END ]: {
            ...state,
            loadingPeople: false,
        },
        [ actions.FETCH_SUMMARY_END ]: {
            ...state,
            loadingSummary: false,
        },
        [ actions.UPDATE_CHECKING_START ]: {
            ...state,
            loadingSummary: true,
        },
        [ actions.UPDATE_CHECKING_END ]: {
            ...state,
            loadingSummary: false,
        },
    };
    if ( actionToStateMap[ type ] )
    {
        return actionToStateMap[ type ];
    }
    return state;
};