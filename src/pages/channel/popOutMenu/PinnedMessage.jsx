import React, { useState, useEffect, useCallback, useMemo } from 'react';

import Select from 'react-select'

import Avatar from '@mui/material/Avatar';
import Backdrop from '@mui/material/Backdrop';
import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';

import { testUser, customStyles, formatDate, getNameById } from '../../../contants';
import { APIServices } from '../../../hooks/fetchAPI';


import CloseIcon from '@mui/icons-material/Close';


const PinnedMessage = React.memo(({ toggle, setToggle, pinnedData, }) => {

    const user = useSelector((state) => state.user.userData)

    const [userList, setUserList] = useState([]);

    const [gcName, setGcName] = useState(null);
    const [gcAssign, setGcAssign] = useState(null);


    useEffect(() => {
        const transformedUsers = testUser?.map(user => ({
            value: user.id,
            label: user.name,
        }));
        setUserList(transformedUsers);
    }, []);

    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={toggle}
        // onClick={ () => setToggle(false) }
        >

            <div className='flex flex-col items-center justify-center w-full h-screen '>

                <div className='flex flex-col w-1/3   w-fit w-fit gap-4 p-4 bg-white rounded max-h-[550px] '>

                    <div className='flex flex-row items-center justify-between w-full'>

                        <h1 className='font-semibold text-black'>Pinned Messages</h1>

                        <div className='text-black cursor-pointer' onClick={() => setToggle(false)}>
                            <CloseIcon />
                        </div>

                    </div>

                    <div className='flex flex-col gap-4 overflow-auto h-full px-4 '>

                        {pinnedData?.map((pinned, key) => (

                            <div className='flex flex-row justify-between w-full gap-2 border-b-[1px] pb-3 '>

                                <div className='flex flex-row items-center justify-start gap-2'>
                                    <Avatar sx={{ bgcolor: '#16a34a', width: 35, height: 35, fontSize: '0.75rem' }}>{getNameById(pinned?.user_id)?.charAt(0).toUpperCase()}</Avatar>

                                    <div className='flex flex-col'>

                                        <div className='py-1'>
                                            <h1 className='text-xs text-black'>{getNameById(pinned?.user_id)}</h1>
                                        </div>

                                        <div className='p-2 bg-gray-200 rounded cursor-pointer py max-w-[400px] w-fit'>
                                            <h1 className='text-md text-black '>{pinned?.text_message}</h1>
                                        </div>


                                    </div>

                                </div>

                                <span className='text-[10px] text-black'>{formatDate(pinned?.created_at)}</span>

                            </div>
                        ))}


                    </div>

                </div>

            </div>

        </Backdrop>
    )
});

export default PinnedMessage;
