import React, { useState, useEffect, useCallback } from 'react'

import Select from 'react-select'

import Avatar from '@mui/material/Avatar';
import Backdrop from '@mui/material/Backdrop';
import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';

import CloseIcon from '@mui/icons-material/Close';

import { testUser, customStyles , p2pFilter } from '../../../contants';
import { APIServices } from '../../../hooks/fetchAPI';


const ForwardMessage = React.memo(({ forwardedMessage, setForwardedMessage , handleFetchingGroupChats }) => {

    const user = useSelector((state) => state.user.userData)

    const [userList, setUserList] = useState([]);

    const [gcName, setGcName] = useState(null);
    const [gcAssign, setGcAssign] = useState(null);

    const [ dataForward , setDataForward ] = useState([]);


    const [listGroupData, setlistGroupData] = useState([]);


    useEffect(() => {
        const transformedUsers = testUser?.map(user => ({
            value: user.id,
            label: user.name,
        }));
        setUserList(transformedUsers);
        handleFetchingGroupChat();
    }, [gcName]);


    const handleFetchingGroupChat = useCallback(async () => {

        let data = {
            "user_id": user?.id,
            "searchValue": gcName
        };

        const response = await APIServices.get({ url: `/fetch-message-group`, payload: data });

        if (response?.status === 200) {
            setlistGroupData(response?.data?.data)
        } else {
            setlistGroupData(null)
        }

    }, []);

    const handleForwardMessage = async (data) => {

        let submitData = {
            "user_id": user?.id,
            "text_message": forwardedMessage?.text_message,
            "group_id": data?.id,
            "forwarded_message": forwardedMessage?.forwarded_message ? forwardedMessage?.forwarded_message :  forwardedMessage?.id,
        }

        setDataForward(prevDataForward => [...prevDataForward, data.id]);
     
        const response = await APIServices.post({ url: `/create-message-text`, payload: submitData });
        if (response?.status === 201) {
            handleFetchingGroupChats();
        }
    };

    
    const handleName = (data) => {
    
        if ( !data ) return "Chat";
    
        if ( data?.is_gc ) return data?.group_name 
        else return p2pFilter( data , user ) 
    
    }

    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={forwardedMessage ? true : false}
        // onClick={ () => setToggle(false) }
        >

            <div className='flex flex-col items-center justify-center w-full h-screen px-4 md:px-1'>

                <div className='flex flex-col w-full md:w-1/3 gap-4 p-4 bg-white rounded'>

                    <div className='flex flex-row items-center justify-between w-full'>

                        <h1 className='font-semibold text-black'>Forward message to: </h1>


                        <div className='text-black cursor-pointer' onClick={() => setForwardedMessage(null)}>
                            <CloseIcon />
                        </div>

                    </div>

                    <div className='flex flex-col gap-4'>

                        <TextField id="outlined-basic" value={gcName} label="Search Group.." variant="outlined" size='small' onChange={e => setGcName(e?.target?.value)} />

                        {/* <Select
                            isMulti
                            name="colors"
                            options={userList}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            styles={customStyles}
                            value={gcAssign}
                            onChange={handleSelectChange}
                        /> */}
                        <div className='my-5 max-h-[400px]'>
                            <div className='h-full overflow-auto'>
                                {listGroupData?.map(data => (

                                    <div className='flex flex-row items-center w-full justify-between gap-3 px-4 py-2'>

                                        <div className='flex flex-row items-center w-full gap-3'>
                                            <Avatar sx={{ bgcolor: '#16a34a' }}>T</Avatar>

                                            <div className='flex flex-col'>
                                                <h1 className='font-semibold text-md text-black'>{handleName(data)}</h1>
                                            </div>
                                        </div>
                        
                                        { !dataForward.includes(data?.id) ?

                                            <div onClick={() => handleForwardMessage(data)} className={`px-4 py-[2px] bg-teal-500 rounded text-white cursor-pointer`}>
                                                <h1 className='font-normal'>Send</h1>
                                            </div> :

                                            <div className={`px-4 py-[2px] bg-gray-500 rounded text-gray-200`}>
                                                <h1 className='font-normal'>Done</h1>
                                            </div>
                                        }

                                    </div>

                                ))}
                            </div>
                        </div>
                    </div>

                    {/* <div className='flex flex-row-reverse w-full gap-3'>


                        <div className='px-4 py-2 text-black bg-gray-200 rounded cursor-pointer'>
                            <h1 className='font-normal'>Close</h1>
                        </div>

                        <div onClick={handleSubmit} className='px-4 py-2 bg-[#16a34a] rounded text-white cursor-pointer'>
                            <h1 className='font-normal'>Forward</h1>
                        </div>

                    </div> */}


                </div>




            </div>

        </Backdrop>
    )
});

export default ForwardMessage;