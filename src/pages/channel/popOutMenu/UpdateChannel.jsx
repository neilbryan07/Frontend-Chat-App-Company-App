import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'

import Select from 'react-select'

import Backdrop from '@mui/material/Backdrop';
import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';

import { testUser, customStyles } from '../../../contants';
import { APIServices } from '../../../hooks/fetchAPI';


const UpdateChannel = React.memo(({ team, toggle, setToggle, refreshData, selectedData, type, setTeamName, teamName }) => {

    const user = useSelector((state) => state.user.userData)

    console.log('update-', type, type === 1 ? "channl" : "team")
    console.log("team", team)

    const [userList, setUserList] = useState([]);

    const [gcName, setGcName] = useState(null);
    const [gcAssign, setGcAssign] = useState(null);
    const textFieldRef = useRef(null);

    useEffect(() => {
        setGcName(type === 1 ? selectedData.name : teamName)
        const handleKeyPress = (event) => {
            if (document.activeElement !== textFieldRef.current) {
                textFieldRef.current?.focus();
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, []);

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

        console.log("---", selectedData)
        let submitData = {
            "name": gcName,
            "channel_id": selectedData.id
        };

        try {
            const response = await APIServices.post({ url: `/update-channel`, payload: submitData });

            if (response?.status === 200) {
                refreshData();
                console.log("sumbit test", submitData)
            }
        } catch (error) {
            console.error('Error updating channel:', error);
        } finally {
            setToggle(false);
        }
    }, [gcAssign, gcName, user, refreshData, selectedData, setToggle]);

    const handleTeam = useCallback(async () => {

        let submitData = {
            "name": gcName,
            "team_id": team?.team_id
        };
        console.log('dataa', submitData)
        try {
            const response = await APIServices.post({ url: `/update-team`, payload: submitData });

            if (response?.status === 200) {
                refreshData();
                setTeamName(gcName);
                console.log("sumbit test", submitData)
            }
        } catch (error) {
            console.error('Error updating channel:', error);
        } finally {
            setToggle(false);
        }
    }, [gcAssign, gcName, user, refreshData, selectedData, setToggle]);

    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={toggle}
        //onClick={() => setToggle(false)}
        >

            <div className='flex flex-col items-center justify-center w-full h-screen'>

                <div className='flex flex-col w-1/3 gap-4 p-4 bg-white rounded'>

                    <div className='flex flex-row items-center justify-between w-full'>

                        <h1 className='font-semibold text-black'>Update {type === 1 ? 'Channel' : 'Team'}</h1>

                    </div>

                    <div className='flex flex-col gap-4'>

                        <TextField id="outlined-basic" value={gcName} inputRef={textFieldRef}
                            variant="outlined" size='small' onChange={e => setGcName(e?.target?.value)} />

                    </div>

                    <div className='flex flex-row-reverse w-full gap-3'>

                        <div onClick={() => setToggle(false)} className='px-4 py-2 text-black bg-gray-200 rounded cursor-pointer'>
                            <h1 className='font-normal'>Close</h1>
                        </div>

                        <div onClick={type === 1 ? handleSubmit : handleTeam} className='px-4 py-2 bg-[#16a34a] rounded text-white cursor-pointer'>
                            <h1 className='font-normal'>Update</h1>
                        </div>

                    </div>


                </div>




            </div>

        </Backdrop>
    )
});


export default UpdateChannel;