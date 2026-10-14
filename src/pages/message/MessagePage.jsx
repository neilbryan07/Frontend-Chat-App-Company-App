import React, { useState, useEffect, useCallback } from "react";

import { useParams } from 'react-router-dom';

import { ChatList } from "./Tools/ChatList";
import { MessageTabs } from "./Tools/MessageTabs";

import { useSelector, useDispatch } from "react-redux";

import { APIServices } from "../../hooks/fetchAPI";

import { ActionSelection } from "../../component/actionSelection/ActionSelection";

import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';

import { storeToggleDrawer } from "../../redux/GroupChat/ToggleDrawerSlice";

import echo from "../../hooks/echo";
import { MessageManageTab } from "./Tools/MessageManageTab";

const MessagePage = () => {

  const dispatch = useDispatch();
  const { id } = useParams();
  const toggleDrawers = useSelector((state) => state.drawerSelected.toggleDrawer)
  const user = useSelector((state) => state.user.userData)
  const [listGroupData, setlistGroupData] = useState([]);
  const [searchInput, setSearchInput] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767); // Adjust breakpoint as needed
  const [groupData, setGroupData] = useState([]);
  const [toggleTeam, setToggleTeam] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767); // Adjust breakpoint as needed
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize); // Clean up
  }, []);

  useEffect(() => {
    let timeoutId;

    timeoutId = setTimeout(() => {
      handleFetchingGroupChat();
    }, 500); // 1000ms delay before fetching

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchInput]);

  useEffect(() => {

    let intervalId;
    // handleFetchingGroupChat();
    // intervalId = setInterval(() => {
    //     handleFetchingGroupChat();
    // }, 1000);

    // return () => {
    //     clearInterval(intervalId);
    //     console.log('Timeout cleared!');
    // };

  }, [searchInput]);

  useEffect(() => {

    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          // console.log('Notification permission granted.');
        } else if (permission === 'denied') {
          // console.log('Notification permission denied.');
        } else {
          // console.log('Notification permission dismissed.');
        }
      });
    } else {
      // console.log('This browser does not support notifications.');
    }
  }, []);


  //   useEffect(() => {

  //     const channel = echo.channel(`group-chat${user?.id}`)
  //       .listen('GroupChat', handlePusherEvent)
  //       .error((error) => {
  //           console.error('Error on channel:', error);
  //     });

  //     return () => {
  //         channel.stopListening('GroupChat');
  //         echo.leaveChannel(`group-chat${user?.id}`);
  //     };

  // }, [id]);

  // const handlePusherEvent = (pusherEvent) => {
  //   console.log(pusherEvent)
  // };


  const handleFetchingGroupChat = async () => {

    let data = {
      "user_id": user?.id,
      "searchValue": searchInput
    };

    try {

      const response = await APIServices.get({ url: `/fetch-message-group`, payload: data });
      setlistGroupData([]);
      if (response?.status === 200) {

        setlistGroupData(response?.data?.data);
      } else {
        setlistGroupData([]);
        console.warn("No group data returned from API.");
      }

    } catch (error) {
      console.error('Error creating message group:', error);
      setlistGroupData([]);
    }

  }



  return (
    <div className="flex flex-col md:flex-row items-center justify-center w-full h-screen gap-3 p-4 sm:p-4 bg-gray-200  dark:bg-gray-600 ">

      {/* Drawer for Mobile Action Selection */}
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

      {/* Mobile Layout */}
      {isMobile &&
        <div className={`w-full h-full bg-white  dark:bg-gray-800   shadow-lg md:hidden ${isMobile ? 'fixed top-0 left-0' : 'rounded-2xl'}`}>
          {!id ? (
            <ChatList
              handleFetchingGroupChat={handleFetchingGroupChat}
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              listGroupData={listGroupData}
              setlistGroupData={setlistGroupData}
              setGroupData={setGroupData}
              setToggleTeam={setToggleTeam}
            />
          ) : <>

            {
              !toggleTeam && id ?
                (
                  <MessageTabs handleFetchingGroupChat={handleFetchingGroupChat} setToggleTeam={setToggleTeam}
                  />
                ) :
                (
                  <MessageManageTab
                    team={groupData}
                    setManageTeam={setGroupData}
                    setToggleTeam={setToggleTeam}
                    handleFetchingGroupChat={handleFetchingGroupChat}
                  />
                )
            }

          </>}
        </div>
      }

      {/* Desktop Layout */}
      <div className="hidden md:flex md:w-6/12 lg:w-4/12 h-full bg-white  dark:bg-gray-800  rounded-2xl shadow-lg">
        <ChatList
          handleFetchingGroupChat={handleFetchingGroupChat}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          listGroupData={listGroupData}
          setlistGroupData={setlistGroupData}
          setGroupData={setGroupData}
          setToggleTeam={setToggleTeam}
        />
      </div>

      <div className="hidden md:flex md:w-9/12 lg:w-8/12 h-full bg-white  dark:bg-gray-800  rounded-2xl shadow-lg">
        {toggleTeam && id ?
          <MessageManageTab
            team={groupData}
            setManageTeam={setGroupData}
            setToggleTeam={setToggleTeam}
            handleFetchingGroupChat={handleFetchingGroupChat}

          /> :
          <> {!toggleTeam && id ? (
            <>
              <MessageTabs handleFetchingGroupChat={handleFetchingGroupChat}
                setToggleTeam={setToggleTeam}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <h1 className="text-lg font-semibold text-gray-500  dark:text-gray-300">
                Select a chat to start messaging
              </h1>
            </div>
          )}
          </>}
      </div>

    </div>


    // <div className="flex flex-row items-center justify-center w-full h-screen gap-3 p-2 sm:p-4 bg-gray-200 overscroll-none">

    //   {toggleDrawers &&
    //     <Drawer open={toggleDrawers} onClose={() => dispatch(storeToggleDrawer(false))} >
    //       <Box sx={{ width: 60, height: '100%' }} role="presentation">
    //         <ActionSelection value={"message"} />
    //       </Box>
    //     </Drawer>
    //   }

    //   {(<ActionSelection value={"message"} />)}

    //   <div className="w-4/12 h-full bg-white rounded-2xl shadow-lg ">

    //     {(<ChatList
    //       handleFetchingGroupChat={handleFetchingGroupChat}
    //       searchInput={searchInput}
    //       setSearchInput={setSearchInput}
    //       listGroupData={listGroupData}
    //       setlistGroupData={setlistGroupData}
    //     />)}

    //   </div>

    //   <div className="w-8/12 max-w-6xl h-full bg-white rounded-2xl shadow-lg ">

    //     {id && (<MessageTabs handleFetchingGroupChat={handleFetchingGroupChat} />)}

    //     {!id &&

    //       (<React.Fragment>

    //         <div className="flex flex-col items-center justify-center w-full h-full">
    //           <h1 className="text-lg font-semibold text-gray-500">Select a chat to start messaging</h1>
    //         </div>

    //       </React.Fragment>)

    //     }
    //   </div>


    // </div>
  );
};

export default MessagePage;