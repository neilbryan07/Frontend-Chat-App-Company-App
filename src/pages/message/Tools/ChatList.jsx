import React, { useState, useRef, useEffect, useCallback, useMemo, lazy, Suspense } from 'react'

import { useParams, useNavigate } from 'react-router-dom';

import { IoMdSend } from "react-icons/io";
import { IoCreateOutline, IoPersonAddOutline } from "react-icons/io5";
import { AiOutlineUserAdd } from "react-icons/ai";


import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuIcon from '@mui/icons-material/Menu';

import { ChatGroupItem } from '../../../component/chatBox/ChatGroupItem';
import { showNotification } from '../../../contants';

import { useSelector, useDispatch } from "react-redux";

import { APIServices } from '../../../hooks/fetchAPI';

import { fetchMessageGroup } from '../../../redux/GroupChat/GroupChatThunk';
import { storeToggleDrawer } from '../../../redux/GroupChat/ToggleDrawerSlice';

import echo from "../../../hooks/echo";

const AddChatGroup = lazy(() => import('../popOutMenu/AddChatGroup'));
const AddUserChat = lazy(() => import('../popOutMenu/AddUserChat'));
const DeleteGroupChatTools = lazy(() => import('./DeleteGroupChatTools'));

export const ChatList = ({ handleFetchingGroupChat, searchInput, setSearchInput, listGroupData, setlistGroupData, setGroupData, setToggleTeam }) => {

    const { id } = useParams();
    const idRef = useRef(id);
    const dispatch = useDispatch();

    const searchtextFieldRef = useRef(null);

    const user = useSelector((state) => state.user.userData)
    const messengerAdminLevel = user?.permission;
    const { action } = useSelector((state) => state.groupChat);

    const listData = listGroupData

    const listGroupChat = action?.groupChatData?.data;

    const [toggleGC, setToggleGC] = useState(false);
    const [toggleUser, setToggleUser] = useState(false);
    const [toggleTools, setToggleTools] = useState(false);
    const [toggleDeleteTools, setToggleDeleteTools] = useState(false);
    const [selectedData, setSelectedData] = useState([]);

    const [gcActive, setGCActive] = useState(false);

    // const [searchInput, setSearchInput] = useState(null);

    // const [listGroupData, setlistGroupData] = useState([]);

    // const handleFetchingGroupChat = useCallback(async () => {

    //     setlistGroupData([]);

    //     let data = {
    //         "user_id": user?.id,
    //         "searchValue": searchInput
    //     };

    //     try {

    //         const response = await APIServices.get({ url: `/fetch-message-group`, payload: data });

    //         setlistGroupData(response?.data?.data)

    //     } catch (error) {
    //         console.error('Error creating message group:', error);
    //         setlistGroupData([]);
    //     }

    // }, [listGroupData, searchInput, user, APIServices]);

    const handleChange = (event) => {
        setSearchInput(event.target.value);
    };


    const handlePusherEvent = (pusherEvent, eventId) => {



        if (parseInt(idRef.current) !== parseInt(pusherEvent?.group_id)) {

            showNotification(pusherEvent);
            handleFetchingGroupChat();

        }

    }

    useEffect(() => {

        const existingChannels = echo.connector.channels;
        const channels = {};
        idRef.current = id;

        listGroupData.forEach((item) => {
            const channelId = item.id;
            const channelName = `public-chat${channelId}`;

            if (!existingChannels[channelName]) {
                channels[channelName] = echo.channel(channelName)
                    .listen('MessageSent', (event) => {
                        handlePusherEvent(event, idRef.current)

                    })
                    .error((error) => {
                        console.error(`Error on channel ${channelName}:`, error);
                    });
            } else {
                channels[channelName] = existingChannels[channelName];
            }
        });

    }, [id, listGroupData, echo, handlePusherEvent]);

    return (

        <div className='flex flex-col w-full h-full max-h-screen gap-5 p-4'>

            {toggleGC &&
                (<Suspense>
                    <AddChatGroup
                        toggle={toggleGC}
                        setToggle={setToggleGC}
                        refreshData={handleFetchingGroupChat}
                    />
                </Suspense>
                )
            }


            {toggleUser &&
                (<Suspense>
                    <AddUserChat
                        toggle={toggleUser}
                        setToggle={setToggleUser}
                        refreshData={handleFetchingGroupChat}
                        listGroupData={listData}
                    />
                </Suspense>
                )
            }

            {toggleDeleteTools &&
                (<Suspense>
                    <DeleteGroupChatTools
                        toggle={toggleDeleteTools}
                        setToggle={setToggleDeleteTools}
                        refreshData={handleFetchingGroupChat}
                        selectedData={selectedData}
                    />
                </Suspense>)
            }

            <div className='flex flex-row items-center justify-between'>

                <div className='flex flex-row gap-2 items-center'>

                    <div className='cursor-pointer hover:bg-gray-100 hover:rounded-full  dark:text-gray-300' onClick={() => dispatch(storeToggleDrawer(true))}>
                        <MenuIcon />
                    </div>

                    <h1 className='text-xl font-black text-black  dark:text-gray-300'>Chats</h1>

                </div>



                <div className='flex flex-row gap-2 items-center justify-center'>

                    <span onClick={() => setToggleUser(true)} className='text-2xl font-black text-gray-600  dark:text-gray-300 cursor-pointer hover:bg-gray-100 hover:rounded-full'>
                        <AiOutlineUserAdd />
                    </span>

                    {messengerAdminLevel >= 1 &&
                        <span onClick={() => setToggleGC(true)} className='text-2xl font-black text-gray-600  dark:text-gray-300 cursor-pointer hover:bg-gray-100 hover:rounded-full'>
                            <IoCreateOutline />
                        </span>
                    }

                </div>

            </div>

            <div className='flex flex-col w-full gap-2'>

                <FormControl variant="outlined" size="small" fullWidth>
                    <InputLabel htmlFor="outlined-adornment-password" className='dark:text-white'>Search Chat ....</InputLabel>
                    <OutlinedInput
                        className="border  dark:border-white text-black dark:text-white bg-white dark:bg-gray-800"
                        id="outlined-adornment-password"
                        type={'text'}
                        size="small"
                        inputRef={searchtextFieldRef}
                        value={searchInput}
                        onChange={handleChange}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    className='dark:text-white'
                                    aria-label={'display the password'}
                                    edge="end"
                                >
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Search Chat ...."

                    />
                </FormControl>

            </div>

            <div className='flex flex-col w-full overflow-auto gap-3'>

                <div className='flex flex-col w-full '>


                    <h1 className='text-sm font-light text-black  dark:text-gray-300'>Team</h1>

                    {listGroupData?.filter(chatData => chatData?.team_id)?.map((chatData, index) => (

                        <ChatGroupItem
                            key={index}
                            data={chatData}
                            setToggle={setToggleTools}
                            setDeleteToggle={setToggleDeleteTools}
                            setSelectedData={setSelectedData}
                            handleFetchingGroupChats={handleFetchingGroupChat}
                            setGroupData={setGroupData}
                            setToggleTeam={setToggleTeam}
                        />
                    ))}

                </div>


                <div className='flex flex-col w-full'>


                    <h1 className='text-sm font-light text-black  dark:text-gray-300'>Pinned</h1>

                    {listGroupData?.filter(chatData => chatData.pinned_group?.is_pinned && chatData?.team_id === null)?.map((chatData, index) => (

                        <ChatGroupItem
                            key={index}
                            data={chatData}
                            setToggle={setToggleTools}
                            setDeleteToggle={setToggleDeleteTools}
                            setSelectedData={setSelectedData}
                            handleFetchingGroupChats={handleFetchingGroupChat}
                            setGroupData={setGroupData}
                            setToggleTeam={setToggleTeam}
                        />
                    ))}

                </div>


                <div className='flex flex-col w-full'>

                    <h1 className='text-sm font-light text-black  dark:text-gray-300'>Recent</h1>

                    {listGroupData?.filter(chatData => !chatData.pinned_group?.is_pinned && chatData?.team_id === null)?.map((groupchatData, index) => (

                        <ChatGroupItem
                            key={index}
                            data={groupchatData}
                            setToggle={setToggleTools}
                            setDeleteToggle={setToggleDeleteTools}
                            setSelectedData={setSelectedData}
                            handleFetchingGroupChats={handleFetchingGroupChat}
                            setGroupData={setGroupData}
                            setToggleTeam={setToggleTeam}
                        />

                    ))}

                </div>


            </div>


        </div>
    )
};
