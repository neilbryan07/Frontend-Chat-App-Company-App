import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'

import Select from 'react-select'

import Backdrop from '@mui/material/Backdrop';
import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';
import { Avatar } from '@mui/material';
import { Close } from '@mui/icons-material';


const UserProfile = React.memo(({ toggle, setToggle, data }) => {

    console.log(data)

    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={toggle}
        // onClick={ () => setToggle(false) }
        >

            <div className='flex flex-col items-center justify-center w-full h-screen mx-2 px-4 md:px-1 '>

                <div className='flex flex-col w-full lg:w-1/4  gap-4 p-4 bg-white rounded max-h-[650px] '>

                    <div className='flex flex-row items-center justify-between w-full'>

                        <h1 className='font-semibold text-black'>Account</h1>

                        <div onClick={() => setToggle(false)} className=' text-black rounded cursor-pointer'>
                            <Close />
                        </div>

                    </div>

                    <div className='flex flex-row gap-4 w-full m-2'>

                        {<Avatar sx={{ bgcolor: '#16a34a', width: 70, height: 70, fontSize: '2rem' }} src={data?.ass_id !== null ? `https://611systems.com/assets_clients/611/users/${data?.ass_id}/latest_pic.jpg` : ''}
                        >{data?.fname?.charAt(0).toUpperCase() || data?.name?.charAt(0).toUpperCase()}</Avatar>}



                        <div className='flex flex-col gap-1 w-full justify-center '>
                            <span className='text-black font-bold text-xl'>
                                {data?.name || `${data?.fname} ${data?.lname || ''}`}
                            </span>
                            <span className='text-black font-light'>
                                {data?.email}
                            </span>
                        </div>
                    </div>


                    <div className='flex flex-row-reverse w-full gap-3'>

                    </div>


                </div>


            </div>

        </Backdrop>
    )
});


export default UserProfile;