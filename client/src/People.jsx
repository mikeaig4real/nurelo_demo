import React, { useEffect } from 'react';
import { Texts } from "./constants";
import { Person } from "./Person";
import { PageButtonControl } from "./PageButtonControl";
import { useAppContext } from "./Context";


export const People = () =>
{
    const {
        communityId,
        page,
        usePagination,
        people,
        loadingPeople,
        totalPages,
        pageSize,
        setPage,
        getPeople,
        toggleUsePagination,
    } = useAppContext();

    useEffect( () => 
    {
        getPeople();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , [ communityId, page, usePagination, pageSize ] );

    return (
        <div>
            <h3>{ Texts.PEOPLE }</h3>
            <button
                className={ `btn waves-effect waves-heavy ${ usePagination ? 'green' : 'black' }` }
                onClick={ () => toggleUsePagination( !usePagination ) }
            >
                Toggle Pagination
            </button>
            {
                loadingPeople ? <p>Loading...</p> :
                    <ul>
                        { people.map( ( {
                            id,
                            firstName,
                            lastName,
                            title = 'Unknown',
                            companyName,
                            checkedIn = false,
                            checkInDate = null,
                            checkOutDate = null,
                        } ) =>
                            <Person
                                key={ id }
                                id={ id }
                                firstName={ firstName }
                                lastName={ lastName }
                                title={ title }
                                companyName={ companyName }
                                checkedIn={ checkedIn }
                                checkInDate={ checkInDate }
                                checkOutDate={ checkOutDate }
                            />
                        ) }
                        {
                            usePagination && totalPages > 1 &&
                            // @ts-ignore
                            <PageButtonControl
                                page={ page }
                                totalPages={ totalPages }
                                setPage={ setPage }
                            />
                        }
                    </ul>
            }
        </div>
    );
};