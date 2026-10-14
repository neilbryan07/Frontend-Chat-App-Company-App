import React, { useState, useEffect, useCallback } from 'react'
import Select from 'react-select'

import { useNavigate } from 'react-router-dom';

import Backdrop from '@mui/material/Backdrop';
import TextField from '@mui/material/TextField';

import { testUser, customStyles } from '../../../contants';
import { APIServices } from '../../../hooks/fetchAPI';

import { useSelector } from 'react-redux';


const DeleteGroupChatTools = ({ toggle, setToggle, refreshData, selectedData }) => {

    const [userList, setUserList] = useState([]);

    const user = useSelector((state) => state.user.userData)
    const navigate = useNavigate();

    useEffect(() => {
        const transformedUsers = testUser?.map(user => ({
            value: user.id,
            label: user.name,
        }));
        setUserList(transformedUsers);
    }, []);

    const handleDeleteGroupChat = async () => {

        let submitData = {
            "id": selectedData.id,
        }

        const response = await APIServices.deletes({ url: `/delete-message-group`, payload: submitData });

        if (response?.status === 200) {
            navigate(`/message`);
            refreshData();
            setToggle(false);
        }
    };

    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={toggle}
        // onClick={ () => setToggle(false) }
        >

            <div className='flex flex-col items-center justify-center w-full h-screen px-4 md:px-1'>

                <div className='flex flex-col w-full md:w-1/3 gap-4 p-4 bg-white rounded'>

                    <div className='flex flex-row items-center justify-between w-full'>

                        <h1 className='font-semibold text-black'>Delete { selectedData?.group_name} Group Chat ?</h1>

                    </div>


                    <div className='flex flex-row-reverse w-full gap-3'>


                        <div onClick={() => setToggle(false)} className='px-4 py-2 text-black bg-gray-200 rounded cursor-pointer'>
                            <h1 className='font-normal'>Close</h1>
                        </div>

                        <div onClick={handleDeleteGroupChat} className='px-4 py-2 text-white bg-red-500 rounded cursor-pointer'>
                            <h1 className='font-normal'>Delete</h1>
                        </div>

                    </div>


                </div>




            </div>

        </Backdrop>
    )
};

export default DeleteGroupChatTools;