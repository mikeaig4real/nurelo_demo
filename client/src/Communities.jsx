import React, { useEffect, useState } from 'react';
import { Texts } from "./constants";
import { useAppContext } from "./Context";


export const Communities = () =>
{
    const {
        communities,
        loadingCommunities,
        communityId,
        changeCommunityId,
        getCommunities,
    } = useAppContext();

    useEffect( () =>
    {
        getCommunities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [] );

    const handleSelectChange = ( /** @type {{ target: { value: any; }; }} */ e ) =>
    {
        const { target: { value } } = e;
        changeCommunityId( value );
    };
    return (
        <>
            <h3>{ Texts.COMMUNITIES }</h3>
            {
                loadingCommunities
                    ? <p>Loading...</p> :
                    <div className="input-field">
                        {/* Event selector */ }
                        <select
                            className="browser-default"
                            value={ communityId }
                            onChange={ handleSelectChange }
                        >
                            {/* Default option */ }
                            <option
                                value={ Texts.SELECT_AN_EVENT }
                            >
                                { Texts.SELECT_AN_EVENT }
                            </option>
                            {/* Render options for each community */ }
                            {
                                communities.map( community =>
                                    <option
                                        key={ community.id }
                                        value={ community.id }
                                    >
                                        { community.name }
                                    </option>
                                )
                            }
                        </select>
                    </div>
            }
        </>
    );
};
