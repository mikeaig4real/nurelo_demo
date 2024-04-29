import React, { useEffect, useState } from 'react';
import { Communities } from "./Communities";
import { Texts } from "./constants";
import './App.css';
import { Summary } from "./Summary";
import { People } from "./People";

function App ()
{
  return (
    <>
      <h1>{ Texts.HOME_TITLE }</h1>
      <div className="container">
        {/* Display communities component */ }
        <Communities />
        {/* Display summary component */ }
        <Summary />
        {/* Display people component */ }
        <People />
      </div>
    </>
  );
}

export default App;
