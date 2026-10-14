import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'

import Select from 'react-select'

import Backdrop from '@mui/material/Backdrop';
import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';

import { testUser, customStyles } from '../../../contants';
import { APIServices } from '../../../hooks/fetchAPI';
import { useNavigate } from 'react-router-dom';


const AddUserChat = React.memo(({ toggle, setToggle, refreshData, listGroupData }) => {

    const user = useSelector((state) => state.user.userData)

    const [userList, setUserList] = useState([]);

    const [gcName, setGcName] = useState("P2P");
    const [gcAssign, setGcAssign] = useState(null);
    const textFieldRef = useRef(null);
    const navigate = useNavigate();




    useEffect(() => {
        handleAssign()
        textFieldRef.current?.focus();
        setGcAssign(textFieldRef.current?.value)

        // const handleKeyPress = (event) => {
        //     if (document.activeElement !== textFieldRef.current) {
        //         textFieldRef.current?.focus();
        //         setGcAssign(textFieldRef.current?.value)

        //     }
        // };

        // window.addEventListener("keydown", handleKeyPress);
        // return () => {
        //     window.removeEventListener("keydown", handleKeyPress);
        // };
    }, []);

    const handleAssign = async () => {

        let data = {
            "filter_user": user?.permission !== 0 ? 0 : 1,
        };

        const res = await APIServices.get({ url: '/get-users', payload: data });

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

        for (const list of listGroupData) {
            if (list?.group_name === gcAssign?.label) {
                setToggle(false)
                navigate(`/message/${list?.id}`);
                return
            }
        }

        const transformedUsers = [gcAssign]?.map(data => ({
            user_id: data.value,
            added_by_id: user?.id,
        }));

        const finalUsers = [...transformedUsers, {
            user_id: user?.id,
            added_by_id: user?.id,
        }];

        let submitData = {
            "group_name": "P2P",
            "created_by": user?.id,
            "assign": finalUsers,
            "is_gc": false,
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

    const usertextFieldRef = useRef(null);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (document.activeElement !== usertextFieldRef.current) {
                usertextFieldRef.current?.focus();
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, []);


    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={toggle}
        // onClick={ () => setToggle(false) }
        >

            <div className='flex flex-col items-center justify-center w-full h-screen px-4 md:px-1'>

                <div className='flex flex-col w-full md:w-1/3 gap-4 p-4 bg-white dark:bg-gray-800 rounded'>

                    <div className='flex flex-row items-center justify-between w-full'>

                        <h1 className='font-semibold text-black  dark:text-white'>Search User</h1>

                    </div>

                    <div className='flex flex-col gap-4'>

                        <Select

                            name="colors"
                            options={userList}
                            ref={usertextFieldRef}
                            className="basic-multi-select dark:bg-gray-800"
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

                        <div onClick={handleSubmit} className='px-4 py-2 bg-[#16a34a] rounded text-white  cursor-pointer'>
                            <h1 className='font-normal'>Start Chat</h1>
                        </div>

                    </div>


                </div>




            </div>

        </Backdrop>
    )
});


export default AddUserChat;