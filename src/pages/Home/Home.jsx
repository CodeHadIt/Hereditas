import React, {useState, useEffect} from 'react';
import Headline from './Headline';
import How from './How';
import CTA from './CTA';

const Home = (props) => {

    return (
        <>
            <Headline />
            <How />
            <CTA/>
        </>
    )
}

export default Home