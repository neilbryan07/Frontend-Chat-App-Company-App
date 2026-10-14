import React, { useState, useEffect, useCallback } from "react";

import { useParams } from 'react-router-dom';

import { ChatList } from "../message/Tools/ChatList";
import { MessageTabs } from "../message/Tools/MessageTabs";


import { ChannelList } from "./Tools/ChannelList";


import { useSelector, useDispatch } from "react-redux";

import { APIServices } from "../../hooks/fetchAPI";

import { ActionSelection } from "../../component/actionSelection/ActionSelection";
import { storeToggleDrawer } from "../../redux/GroupChat/ToggleDrawerSlice";

import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import { ChannelTabs } from "./Tools/ChannelTab";
import { TeamTab } from "./Tools/TeamTab";


const ChannelPage = () => {
    const { id, channel_id } = useParams();
    const dispatch = useDispatch();
    const { message, action } = useSelector((state) => state.message);
    const groupSelected = useSelector((state) => state.groupSelected.groupSelectedData);
    const [listGroupData, setlistGroupData] = useState([]);
    const [searchInput, setSearchInput] = useState(null);
    const [team_id, setTeam_id] = useState([]);
    const [toggleTeam, setToggleTeam] = useState(false);
    const listMessageConvo = action?.messageData?.data;
    const toggleDrawers = useSelector((state) => state.drawerSelected.toggleDrawer)
    const user = useSelector((state) => state.user.userData)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 650);


    console.log(toggleTeam, '---')
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 914);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    useEffect(() => {
        let intervalId;
        handleFetchingGroupChat();
    }, [searchInput]);


    const handleFetchingGroupChat = async () => {

        try {

            const response = await APIServices.post({
                url: `/get-user-teams`,
                payload: {
                    "user_id": user?.id,
                    "search": searchInput
                }
            });

            setlistGroupData([]);
            if (response?.status === 200) {
                setlistGroupData(response?.data)
            } else {
                setlistGroupData([]);
                console.warn("No team");
            }


        } catch (error) {
            console.error('Error creating message group:', error);
            setlistGroupData([]);
        }

    };

    return (
        <div className="flex flex-col md:flex-row items-center justify-center w-full h-screen gap-3 p-4 sm:p-4 bg-gray-200 dark:bg-gray-600">

            {toggleDrawers && (
                <Drawer open={toggleDrawers} onClose={() => dispatch(storeToggleDrawer(false))}>
                    <Box sx={{ width: 60, height: '100%' }} role="presentation">
                        <ActionSelection value="message" />
                    </Box>
                </Drawer>
            )}

            {/* Sidebar Action Selection (Visible only on Desktop) */}
            <div className="hidden lg:block w-[60px] h-full">
                <ActionSelection className="w-full" value="message" />
            </div>

            {isMobile && <div className={`w-full h-full bg-white dark:bg-gray-800 shadow-lg md:hidden ${isMobile ? 'fixed top-0 left-0' : 'rounded-2xl'}`}>
                {toggleTeam ? (
                    <TeamTab
                        team={team_id}
                        setManageTeam={setTeam_id}
                        setToggleTeam={setToggleTeam}
                        handleFetchingGroupChat={handleFetchingGroupChat}
                        toggleTeam={toggleTeam}
                    />
                ) : channel_id ? (
                    <ChannelTabs handleFetchingGroupChat={handleFetchingGroupChat} listGroupData={listGroupData} />
                ) : (
                    <ChannelList
                        handleFetchingGroupChat={handleFetchingGroupChat}
                        listGroupData={listGroupData}
                        setlistGroupData={setlistGroupData}
                        setTeam_id={setTeam_id}
                        setToggleTeam={setToggleTeam}
                        setSearchInput={setSearchInput}
                        toggleTeam={toggleTeam}

                    />
                )}
            </div>}

            {/* Desktop Layout */}
            <div className="hidden md:flex md:w-6/12 lg:w-4/12 h-full bg-white  dark:bg-gray-800  rounded-2xl shadow-lg">
                <ChannelList
                    handleFetchingGroupChat={handleFetchingGroupChat}
                    listGroupData={listGroupData}
                    setlistGroupData={setlistGroupData}
                    setTeam_id={setTeam_id}
                    setToggleTeam={setToggleTeam}
                    setSearchInput={setSearchInput}
                    toggleTeam={toggleTeam}

                />
            </div>


            <div className="hidden md:flex md:w-9/12 lg:w-8/12 h-full bg-white  dark:bg-gray-800  rounded-2xl shadow-lg">
                {toggleTeam ? (
                    <TeamTab
                        team={team_id}
                        setManageTeam={setTeam_id}
                        setToggleTeam={setToggleTeam}
                        handleFetchingGroupChat={handleFetchingGroupChat}
                        toggleTeam={toggleTeam}
                    />
                ) : channel_id ? (
                    <ChannelTabs handleFetchingGroupChat={handleFetchingGroupChat} listGroupData={listGroupData} />
                ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full">
                        <h1 className="text-lg font-semibold text-gray-500 dark:text-gray-200">
                            Select a channel to start messaging
                        </h1>
                    </div>
                )}
            </div>

        </div>
    );
};

export default ChannelPage;