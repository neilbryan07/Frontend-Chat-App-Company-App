import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'

import Select from 'react-select'

import Backdrop from '@mui/material/Backdrop';
import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';

import { testUser, customStyles } from '../../../contants';
import { APIServices } from '../../../hooks/fetchAPI';


const AddChatGroup = React.memo(({ toggle, setToggle, refreshData }) => {

    const user = useSelector((state) => state.user.userData)

    const [userList, setUserList] = useState([]);

    const [gcName, setGcName] = useState(null);
    const [gcAssign, setGcAssign] = useState(null);
    const nameFieldRef = useRef(null);
    const membersFieldRef = useRef(null);
    const [isSelectFocused, setIsSelectFocused] = useState(false);



    useEffect(() => {
        nameFieldRef.current?.focus();
        handleAssign();

        const handleKeyPress = (event) => {
            event.preventDefault();
            if (document.activeElement !== nameFieldRef.current) {
                nameFieldRef.current?.focus();
                setGcName(nameFieldRef.current?.value)
            }

            if (event.key === 'Tab') {
                setIsSelectFocused(true)

                if (document.activeElement.value === nameFieldRef.current.value) {
                    setIsSelectFocused(true)
                    membersFieldRef.current?.focus();
                    setGcAssign(membersFieldRef.current.value)
                }
            }
        };

    }, []);





    const handleAssign = async () => {
        const res = await APIServices.get({ url: '/get-users' });

        const formattedUsers = res?.data?.filter(data => parseInt(data?.id) !== parseInt(user?.id))?.map(user => ({
            value: user.id,
            label: user["first name"] ? `${user["first name"]} ${user["last name"] ?? ""}`.trim() : user.email
        })) || [];

        setUserList(formattedUsers);
    };


    useEffect(() => {
        const transformedUsers = testUser?.map(user => ({
            value: user.id,
            label: user.name,
        }));
        setUserList(transformedUsers);
    }, []);

    const handleSelectChange = useCallback(async (selectedOptions) => {
        setGcAssign(selectedOptions);
    }, []);


    const handleSubmit = useCallback(async () => {

        const transformedUsers = gcAssign?.map(data => ({
            user_id: data.value,
            added_by_id: user?.id,
        }));

        const finalUsers = [...transformedUsers, {
            user_id: user?.id,
            added_by_id: user?.id,
        }];

        let submitData = {
            "group_name": gcName,
            "created_by": user?.id,
            "assign": finalUsers,
            "is_gc": true,
        }

        try {

            const response = await APIServices.post({ url: `/create-message-group`, payload: submitData });

            if (response?.status === 201) {

                refreshData();
                setToggle(false);
            }

        } catch (error) {
            console.error('Error creating message group:', error);
            refreshData();
        }

    }, [gcAssign, gcName, user, APIServices, refreshData]);

    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={toggle}
        // onClick={ () => setToggle(false) }
        >

            <div className='flex flex-col items-center justify-center w-full h-screen px-4 md:px-1'>

                <div className='flex flex-col w-full md:w-1/3 gap-4 p-4 bg-white dark:bg-gray-800  rounded'>

                    <div className='flex flex-row items-center justify-between w-full'>

                        <h1 className='font-semibold text-black dark:text-white'>Create Group Chat</h1>

                    </div>

                    <div className='flex flex-col gap-4'>

                        <TextField className=' dark:text-white  dark:bg-white' id="outlined-basic" value={gcName} inputRef={nameFieldRef}
                            label="Name" variant="outlined" size='small' onChange={e => setGcName(e?.target?.value)} />

                        <Select
                            isMulti
                            name="colors"
                            options={userList}
                            ref={membersFieldRef}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            styles={customStyles}
                            value={gcAssign}
                            onChange={handleSelectChange}

                        />


                    </div>

                    <div className='flex flex-row-reverse w-full gap-3'>


                        <div onClick={() => setToggle(false)} className='px-4 py-2 text-black bg-gray-200 rounded cursor-pointer'>
                            <h1 className='font-normal'>Close</h1>
                        </div>

                        <div onClick={handleSubmit} className='px-4 py-2 bg-[#16a34a] rounded text-white cursor-pointer'>
                            <h1 className='font-normal'>Create</h1>
                        </div>

                    </div>


                </div>




            </div>

        </Backdrop>
    )
});


export default AddChatGroup;