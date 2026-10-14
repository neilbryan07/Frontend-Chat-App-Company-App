import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'

import Select from 'react-select'

import Backdrop from '@mui/material/Backdrop';
import TextField from '@mui/material/TextField';

import { useSelector } from 'react-redux';

import { APIServices } from '../../../hooks/fetchAPI';

import { testUser, customStyles } from '../../../contants';

const customStylesSelect = {
    control: (styles) => ({
        ...styles,
        backgroundColor: 'white',
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
        ...styles,
        backgroundColor: isSelected ? 'lightblue' : isFocused ? 'lightgray' : 'white',
        color: 'black',
        cursor: isDisabled ? 'not-allowed' : 'default',
    }),
};


const UpdateGroupChatTools = React.memo(({ toggle, setToggle, refreshData, selectedData }) => {

    const userData = useSelector((state) => state.user.userData)

    const [userList, setUserList] = useState([]);

    const [gcName, setGcName] = useState(selectedData?.group_name);
    const [gcAssign, setGcAssign] = useState(null);

    const updatetextFieldRef = useRef(selectedData?.group_name);

    useEffect(() => {
        const fetchData = async () => {
            await handleAssign(); // Fetch user list first

            if (selectedData) {
                setGcName(selectedData.group_name);

                // Transform selected group members
                const transformedSelectedData = selectedData?.message_group_assign?.filter(data => parseInt(data?.added_by_id) !== parseInt(data?.user_id))?.map(user => ({
                    value: parseInt(user?.user_id),
                    label: `${user?.user?.fname} ${user?.user?.lname}`,
                })) ?? [];

                setGcAssign(transformedSelectedData);

                // Ensure userList is updated after fetching users
                // setUserList(prevUsers => {
                //     return prevUsers
                //         .filter(user => !transformedSelectedData.some(selected => selected.value === user.value));
                // });
            }
        };

        fetchData();
    }, [selectedData]);


    // useEffect(() => {
    //     handleAssign()
    //     const transformedUsers = testUser?.map(user => ({
    //         value: user.id,
    //         label: user.name,
    //     }));

    //     const transformedSelectedData = selectedData?.message_group_assign?.map(user => ({
    //         value: user.id,
    //         label: user.group_name,
    //     }));

    //     setUserList(transformedUsers);
    //     setGcAssign(transformedSelectedData);
    // }, []);

    const handleAssign = async () => {
        const res = await APIServices.get({ url: '/get-users' });

        const formattedUsers = res?.data?.filter(data => parseInt(data?.id) !== parseInt(selectedData?.group_owner?.id))?.map(user => ({
            value: user.id,
            label: user["first name"] ? `${user["first name"]} ${user["last name"] ?? ""}`.trim() : user.email
        })) || [];

        setUserList(formattedUsers);
    };


    const handleSelectChange = useCallback((selectedOptions) => {
        setGcAssign(selectedOptions);
    }, []);


    const handleSubmit = useCallback(async () => {

        // const transformedUsers = gcAssign?.map(data => ({
        //     user_id: data.value,
        //     added_by_id: userData?.id,
        // }));

        // const finalUsers = [...transformedUsers, {
        //     user_id: selectedData?.group_owner?.id,
        //     added_by_id: selectedData?.group_owner?.id,
        // }];

        let submitData = {
            "group_name": gcName,
            "id": selectedData?.id,
            // "assign": finalUsers,
        }

        const response = await APIServices.put({ url: `/update-message-group`, payload: submitData });

        if (response?.status === 200) {

            refreshData();
            setToggle(false);
        }

    }, [gcAssign, gcName, userData, APIServices]);

    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={toggle}
        // onClick={ () => setToggle(false) }
        >

            <div className='flex flex-col items-center justify-center w-full h-screen px-4 md:px-1'>

                <div className='flex flex-col w-full md:w-1/3 gap-4 p-4 bg-white rounded'>

                    <div className='flex flex-row items-center justify-between w-full'>

                        <h1 className='font-semibold text-black'>Update Group Chat</h1>

                    </div>

                    <div className='flex flex-col gap-4'>

                        <TextField
                            id="update-name-text-field"
                            inputRef={updatetextFieldRef}
                            label="Name"
                            variant="outlined"
                            size='small'
                            value={gcName}
                            onChange={e =>
                                setGcName(e?.target?.value)}
                        />

                    </div>

                    <div className='flex flex-row-reverse w-full gap-3'>


                        <div onClick={() => setToggle(false)} className='px-4 py-2 text-black bg-gray-200 rounded cursor-pointer'>
                            <h1 className='font-normal'>Close</h1>
                        </div>

                        <div onClick={handleSubmit} className='px-4 py-2 bg-[#16a34a] rounded text-white cursor-pointer'>
                            <h1 className='font-normal'>Save</h1>
                        </div>

                    </div>


                </div>




            </div>

        </Backdrop>
    )
});

export default UpdateGroupChatTools;
