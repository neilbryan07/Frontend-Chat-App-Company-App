import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'

import Select from 'react-select'

import Backdrop from '@mui/material/Backdrop';
import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';

import { testUser, customStyles } from '../../../contants';
import { APIServices } from '../../../hooks/fetchAPI';
import { Avatar } from '@mui/material';

const ManageGroupMember = React.memo(({ team, fetchMember, toggle, setToggle, refreshData, selectedData }) => {

    const user = useSelector((state) => state.user.userData)

    const [userList, setUserList] = useState([]);

    const [gcName, setGcName] = useState(null);
    const [gcAssign, setGcAssign] = useState(null);
    const textFieldRef = useRef(null);


    // useEffect(() => {
    //     const handleKeyPress = (event) => {
    //         if (document.activeElement !== textFieldRef.current) {
    //             textFieldRef.current?.focus();
    //         }
    //     };

    //     window.addEventListener("keydown", handleKeyPress);
    //     return () => {
    //         window.removeEventListener("keydown", handleKeyPress);
    //     };
    // }, []);

    useEffect(() => {
        handleAssign();
    }, [toggle]);

    const handleSelectChange = useCallback(async (selectedOptions) => {
        setGcAssign(selectedOptions);
    }, []);

    const handleAssign = async () => {

        const res = await APIServices.get({ url: '/get-users' });

        const assignedMemberIds = fetchMember?.map(member => member.user_id) || [];

        const formattedUsers = res?.data
            ?.filter(user => !assignedMemberIds.includes(String(user.id)))
            ?.map(user => ({
                value: user.id,
                label: user["first name"]
                    ? `${user["first name"]} ${user["last name"] ?? ""}`.trim()
                    : user.email
            })) || [];

        setUserList(formattedUsers);

    };


    const handleSubmit = useCallback(async () => {

        // const transformedUsers = gcAssign?.map(data => data.value);

        const transformedUsers = gcAssign?.map(data => ({
            user_id: data.value,
            added_by_id: parseInt(team?.created_by),
        }));


        let submitData = {
            "assign": transformedUsers,
            "id": team?.id
        }

        try {

            const response = await APIServices.put({ url: `/manage-message-group`, payload: submitData });

            if (response?.status === 200) {
                setToggle(false)
                refreshData();

            }

        } catch (error) {
            console.error('Error creating message group:', error);
            refreshData();
        }

    }, [gcAssign, gcName, user, APIServices]);

    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={toggle}
        // onClick={ () => setToggle(false) }
        >

            <div className='flex flex-col items-center justify-center w-full h-screen mx-2 px-4 md:px-1 '>

                <div className='flex flex-col w-full lg:w-1/3  gap-4 p-4 bg-white rounded max-h-[650px] '>

                    <div className='flex flex-row items-center justify-between w-full'>

                        <h1 className='font-semibold text-black'>Manage Member</h1>

                    </div>

                    <div className='flex flex-col gap-4 w-full'>
                        <div className='flex flex-row gap-2 w-full'>
                            <>
                                <Select
                                    isMulti
                                    name="colors"
                                    options={userList}
                                    className="basic-multi-select w-full"
                                    classNamePrefix="select"
                                    styles={customStyles}
                                    value={gcAssign}
                                    onChange={handleSelectChange}
                                />


                            </>
                        </div>

                        {/* <div>
                            <h1 className="text-black">Members:</h1>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            {team?.members?.map((member) => (
                                <div key={member?.member_id} className="flex flex-row gap-2 items-center">
                                    <Avatar sx={{ bgcolor: '#16a34a', width: 35, height: 35, fontSize: '0.75rem' }}>
                                        {member?.user?.first_name?.charAt(0).toUpperCase() || "U"}
                                    </Avatar>
                                    <h1 className="font-normal text-black">
                                        {`${member?.user?.first_name || member?.user?.email} ${member?.user?.last_name || ""} `}
                                    </h1>
                                </div>
                            ))}
                        </div> */}

                    </div>


                    <div className='flex flex-row-reverse w-full gap-3'>


                        <div onClick={() => setToggle(false)} className='px-4 py-2 text-black bg-gray-200 rounded cursor-pointer'>
                            <h1 className='font-normal'>Close</h1>
                        </div>

                        <div onClick={handleSubmit} className='px-4 py-2 bg-[#16a34a] rounded text-white cursor-pointer'>
                            <h1 className='font-normal'>Add User</h1>
                        </div>


                    </div>


                </div>




            </div>

        </Backdrop>
    )
});


export default ManageGroupMember;