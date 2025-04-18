import React from 'react';
import { Outlet } from 'react-router-dom';


const Main = () => {
    return (
        <div className='bg-gray-100 min-w-full '>
            <div className=''>
                <Outlet />
            </div>
            
        </div>
    );
};

export default Main;