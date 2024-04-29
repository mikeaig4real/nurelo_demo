import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useAppContext } from "./Context";

export const Person = ( { id, firstName, companyName, title, lastName, checkInDate, checkOutDate, checkedIn } ) =>
{
    const {
        checkInPerson,
        checkOutPerson,
    } = useAppContext();
    const [ textKey, setTextKey ] = useState( 'checkIn' );
    const [ isCheckedIn, setIsCheckedIn ] = useState( checkedIn );
    const [ personCheckInDate, setPersonCheckInDate ] = useState( checkInDate );
    const [ personCheckOutDate, setPersonCheckOutDate ] = useState( checkOutDate );
    // Format the date in MM/DD/YYYY, HH:mm format or 'N/A' if date is not available
    const formatDate = ( date ) =>
    {
        if ( date )
        {
            const formattedDate = new Date( date ).toLocaleString( 'en-US', {
                month: 'numeric',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            } );
            return formattedDate;
        }
        return 'N/A';
    };

    // Handle check-in button click
    const handleCheckIn = () =>
    {
        if ( isCheckedIn ) return; // Do nothing if already checked in
        // Call the check-in method
        const personUpdate = {
            checkedIn: true, // Set checkedIn to true
            checkInDate: Date.now(), // Set checkInDate to current date and time
        };
        checkInPerson( id, personUpdate );
        setIsCheckedIn( personUpdate.checkedIn );
        setPersonCheckInDate( personUpdate.checkInDate );
    };

    // Handle check-out button click
    const handleCheckOut = () =>
    {
        if ( !isCheckedIn ) return; // Do nothing if not checked in
        // Call the check-out method
        const personUpdate = {
            checkedIn: false, // Unset checkedIn
            checkOutDate: Date.now(), // Set checkOutDate to current date and time
        };
        checkOutPerson( id, personUpdate );
        setIsCheckedIn( personUpdate.checkedIn );
        setPersonCheckOutDate( personUpdate.checkOutDate );
        setTextKey( 'checkIn' ); // Set the text key to 'checkIn' after check-out
    };

    // Generate the text for the check-in/check-out button
    const generateButtonText = () =>
    {
        const textMap = {
            checkIn: `Check-in ${ firstName } ${ lastName }`,
            checkOut: `Check-out ${ firstName } ${ lastName }`,
        };
        return textMap[ textKey ];
    };

    // Update the text key to 'checkOut' if checked in for more than 5 seconds
    useEffect( () =>
    {
        const maxCheckInTime = 5000;
        let timeout;

        // Set the timeout to change the text key to 'checkOut' after 5 seconds
        if ( isCheckedIn )
        {
            // Calculate the time elapsed since check-in
            const timeElapsed = Date.now() - new Date( personCheckInDate ).getTime();
            // Calculate the remaining time to reach 5 seconds, if timeElapsed is beyond maxCheckInTime, hence no need to wait till 5 seconds
            const timeOutMilliseconds = Math.max( maxCheckInTime - timeElapsed, 0 );

            // Set the timeout to change the text key to 'checkOut' after the remaining time
            timeout = setTimeout( () =>
            {
                setTextKey( 'checkOut' );
            }, timeOutMilliseconds );
        }

        return () => clearTimeout( timeout ); // Clear the timeout when component unmounts
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ isCheckedIn ] );

    return (
        <li
            key={ id }
            className="card-panel hoverable"
        >
            <h6>FullName : { firstName } { lastName }</h6>
            <br />
            <h6>Company : { companyName }</h6>
            <br />
            <h6>Title : { title }</h6>
            <br />
            <h6>Check-in Date : { formatDate( personCheckInDate ) }</h6>
            <br />
            <h6>Check-out Date : { formatDate( personCheckOutDate ) }</h6>
            <br />
            { textKey === 'checkIn' ? (
                <button
                    className="btn waves-effect waves-light"
                    disabled={ isCheckedIn }
                    onClick={ handleCheckIn }>{ generateButtonText() }
                </button>
            ) : (
                <button
                    className="btn waves-effect waves-light"
                    onClick={ handleCheckOut }>{ generateButtonText() }
                </button>
            ) }
        </li>
    );
};

Person.propTypes = {
    id: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    companyName: PropTypes.string,
    title: PropTypes.string,
    lastName: PropTypes.string.isRequired,
    checkInDate: PropTypes.number,
    checkOutDate: PropTypes.number,
    checkedIn: PropTypes.bool,
};