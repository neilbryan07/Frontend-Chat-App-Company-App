import React, { useState, useEffect, useCallback } from 'react'
import Select from 'react-select'

import Backdrop from '@mui/material/Backdrop';
import TextField from '@mui/material/TextField';

import { testUser, customStyles } from '../../../contants';
import { APIServices } from '../../../hooks/fetchAPI';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const DeleteTools = React.memo(({ team, toggle, setToggle, refreshData, selectedData, type }) => {

    const [userList, setUserList] = useState([]);
    const navigate = useNavigate();

    const user = useSelector((state) => state.user.userData)

    useEffect(() => {
        const transformedUsers = testUser?.map(user => ({
            value: user.id,
            label: user.name,
        }));
        setUserList(transformedUsers);
    }, []);

    const handleRemoveUser = useCallback(async () => {

        let submitData = {
            "team_id": team?.team_id,
            "user_id": selectedData?.user_id
        }

        const response = await APIServices.post({ url: `/remove-user-from-team`, payload: submitData });

        if (response?.status === 200) {
            refreshData();
            setToggle(false);
        }
    }, [refreshData, selectedData, APIServices]);

    const handleDeleteGroupChat = useCallback(async () => {

        let submitData = {
            "channel_id": selectedData?.id,
        }

        const response = await APIServices.post({ url: `/delete-channel`, payload: submitData });

        if (response?.status === 200) {
            refreshData();
            setToggle(false);
        }
    }, [refreshData, selectedData, APIServices]);

    const handleDeleteTeam = useCallback(async () => {

        let submitData = {
            "team_id": team?.team_id,
        }

        const response = await APIServices.post({ url: `/delete-team`, payload: submitData });

        if (response?.status === 200) {
            refreshData();
            setToggle(false);
        }
    }, [refreshData, selectedData, APIServices]);

    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={toggle}
        // onClick={ () => setToggle(false) }
        >

            <div className='flex flex-col items-center justify-center w-full h-screen'>

                <div className='flex flex-col w-1/3 gap-4 p-4 bg-white rounded'>

                    <div className='flex flex-row items-center justify-between w-full'>

                        <h1 className="font-semibold text-black">
                            {type === 3
                                ? "Remove User"
                                : `Delete ${type > 0 ? "Channel" : "Team"}${selectedData?.name ? ` ${selectedData.name}` : ""}?`}
                        </h1>

                    </div>


                    <div className='flex flex-row-reverse w-full gap-3'>


                        <div onClick={() => setToggle(false)} className='px-4 py-2 text-black bg-gray-200 rounded cursor-pointer'>
                            <h1 className='font-normal'>Close</h1>
                        </div>

                        <div onClick={type === 3 ? handleRemoveUser : type > 0 ? handleDeleteGroupChat : handleDeleteTeam} className='px-4 py-2 text-white bg-red-500 rounded cursor-pointer'>
                            <h1 className='font-normal'>Delete</h1>
                        </div>

                    </div>


                </div>




            </div>

        </Backdrop>
    )
});

export default DeleteTools;