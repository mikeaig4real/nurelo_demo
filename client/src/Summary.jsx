/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { Texts } from "./constants";
import { useAppContext } from "./Context";

export const Summary = () =>
{
    const {
        summary,
        loadingSummary,
        communityId,
        getSummary,
    } = useAppContext();

    useEffect( () =>
    {
        getSummary();
    }, [ communityId ] );

    const generateSummaryText = ( people ) =>
    {
        if ( !people || people.length === 0 )
        {
            return '';
        }
        const companies = people.reduce( ( acc, {
            companyName
        } ) =>
        {
            if ( !companyName ) companyName = 'Unknown';
            if ( !acc[ companyName ] )
            {
                acc[ companyName ] = 0;
            }
            acc[ companyName ] += 1;
            return acc;
        }, {} );
        return Object.keys( companies ).map( ( company ) => `${ company }: ${ companies[ company ] }` ).join( ', ' );
    };
    const {
        peopleCheckedIn,
        peopleNotCheckedInCount,
        peopleCheckedInCount,
    } = summary;
    return (
        <>
            <h3>{ Texts.SUMMARY }</h3>
            {
                // Show loading message if isLoading is true, otherwise render the summary data
                loadingSummary ? <p>Loading...</p> :
                    <div className="summary_all">
                        <p><strong>{ `People in the event right now: ${ peopleCheckedInCount }` }</strong></p>
                        <p className="summary"><strong>People by company in the event right now: <span>{ generateSummaryText( peopleCheckedIn ) || 'None' }</span></strong></p>
                        <p><strong>People not checked-in: { peopleNotCheckedInCount }</strong></p>
                    </div>
            }
        </>
    );
};