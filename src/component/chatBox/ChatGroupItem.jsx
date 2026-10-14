import React, { useState, useCallback, useMemo, lazy, Suspense, useEffect } from 'react';

import { useParams, useNavigate } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

import PushPinIcon from '@mui/icons-material/PushPin';
import EditIcon from '@mui/icons-material/Edit';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DeleteIcon from '@mui/icons-material/Delete';

import { useSelector, useDispatch } from "react-redux";
import { storeGroupDetails } from "../../redux/GroupChat/GroupChatSlice";
import { storeGroupSelectedDetails } from '../../redux/GroupChat/SelectedGroupChatSlice';
import { fetchMessageData } from '../../redux/Message/MessageThunk';
import { APIServices } from '../../hooks/fetchAPI';

import { storeToggleMessage } from '../../redux/GroupChat/ToggleMessageSlice';

import { getName, getNameById, getNameById2, p2pFilter, p2pFilterIcon } from '../../contants';
import { Settings } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
const Menu = lazy(() => import('@mui/material/Menu'));
const Backdrop = lazy(() => import('@mui/material/Backdrop'));

export const ChatGroupItem = ({ data, setToggle, setDeleteToggle, setSelectedData, handleFetchingGroupChats, setGroupData, setToggleTeam }) => {



  const { id } = useParams();
  const navigate = useNavigate();

  const message = useSelector((state) => state.message.messageData)
  const user = useSelector((state) => state.user.userData)

  const [checkmessage, setCheckmessage] = useState(data?.message_group_text?.seen_user ? JSON.parse(data?.message_group_text?.seen_user)?.some(seen_user => seen_user?.id === user?.id) : null);

  const dispatch = useDispatch();
  const messengerAdminLevel = user?.permission;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const [leaveModal, setLeaveModal] = useState(false);

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleUpdate = () => {
    setAnchorEl(null);
    setToggle(true);
    setSelectedData(data)
  };

  const handleDelete = () => {
    setAnchorEl(null);
    setDeleteToggle(true);
    setSelectedData(data)
  };

  const handleManageTeam = () => {
    setAnchorEl(null);
    setToggleTeam(true);
    setGroupData(data);
    navigate(`/message/${data?.id}`);
  };


  const handleLeave = async () => {

    let submitData = {
      "group_id": data?.id,
      "user_id": user?.id
    }

    const response = await APIServices.deletes({ url: `/leave-message-group`, payload: submitData });

    if (response?.status === 200) {

      if (parseInt(id) === parseInt(data?.id)) {
        navigate(`/message`);
      }

      handleFetchingGroupChats();
      setAnchorEl(null);
      setSelectedData(data)
      setLeaveModal(false);
    }

  };

  const handlePinnedGroup = async () => {

    let submitData = {
      "id": data?.id,
      "user_id": user?.id,
      "pinned_id": data?.pinned_group?.id ? data?.pinned_group?.id : null
    }

    setAnchorEl(null);

    if (data?.pinned_group?.id) {
      const responseDelete = await APIServices.deletes({ url: `/pinned-remove-message-group`, payload: submitData });
      handleFetchingGroupChats();
      return;
    }

    const response = await APIServices.post({ url: `/pinned-message-group`, payload: submitData });

    handleFetchingGroupChats();

    return;

  };

  const handleConversation = async () => {
    setToggleTeam(false);
    dispatch(storeToggleMessage(true))
    setCheckmessage(true)
    navigate(`/message/${data?.id}`);

  };

  const MAX_LENGTH = 55;

  const truncateText = (text) => {
    if (!text) return "";
    if (text.length <= MAX_LENGTH) {
      return text;
    }
    return text.substring(0, MAX_LENGTH) + "...";
  };

  const compareDate = (current, seen) => {
    if (!current || !seen) return false; //Handle the undefined value

    const currentDate = current instanceof Date ? current : new Date(current);
    const seenDate = seen instanceof Date ? seen : new Date(seen);

    if (isNaN(currentDate) || isNaN(seenDate)) return false; // Handle invalid dates

    return currentDate.getTime() >= seenDate.getTime();
  };

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Handle null or undefined

    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {// Check for invalid date
        console.error("Invalid date format:", dateString);
        return "";
      }

      const today = new Date();
      const diffInDays = (date - today) / (1000 * 60 * 60 * 24); // Calculate difference in days

      if (Math.abs(diffInDays) < 1) { // Today
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (Math.abs(diffInDays) < 7) {
        return date.toLocaleDateString([], { weekday: 'short' });
      } else { // Otherwise
        return date.toLocaleDateString([], { day: '2-digit', month: 'short' });
      }
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };


  const handleLeaveViewModal = () => {
    setAnchorEl(null);
    setLeaveModal(true)
  }

  const assIdMatch = data?.message_group_assign?.find(
    member => `${member?.user?.fname} ${member?.user?.lname}` === data?.group_name
  )?.user?.ass_id;



  return (

    <div className={`flex flex-row items-center justify-between w-full gap-3 p-2 rounded ${parseInt(data?.id) === parseInt(id) ? 'bg-green-100 dark:bg-green-800' : null}`}>

      {leaveModal &&
        <Suspense>
          <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={leaveModal}
          >

            <div className='flex flex-col items-center justify-center w-6/12 h-screen mx-2 px-4 md:px-1'>

              <div className='flex flex-col w-full lg:w-1/3  gap-4 p-4 bg-white dark:bg-gray-800 rounded max-h-[550px] '>

                <div className='flex flex-row items-center justify-between w-full'>

                  <h1 className='font-semibold text-red-500'>Leave {data?.group_name} ?</h1>

                  <div className='text-black cursor-pointer' onClick={() => setLeaveModal(false)}>
                    <CloseIcon />
                  </div>

                </div>


                <div className='flex flex-row-reverse w-full gap-3'>


                  <div onClick={() => setToggle(false)} className='px-4 py-2 text-black bg-gray-200  dark:bg-gray-800 rounded cursor-pointer'>
                    <h1 className='font-normal'>Close</h1>
                  </div>

                  <div onClick={handleLeave} className='px-4 py-2 bg-red-500 rounded text-white  dark:text-black cursor-pointer'>
                    <h1 className='font-normal'>Proceed</h1>
                  </div>

                </div>


              </div>

            </div>

          </Backdrop>
        </Suspense>
      }

      <div className={`flex flex-row items-center w-full gap-3 cursor-pointer ${parseInt(data?.id) !== parseInt(id) ? 'hover:bg-gray-50 dark:hover:bg-gray-600' : null} `} onClick={handleConversation}>
        <Avatar sx={{ bgcolor: '#16a34a' }} src={assIdMatch ? `https://611systems.com/assets_clients/611/users/${assIdMatch}/latest_pic.jpg` : ""}>{data?.is_gc ? data?.group_name?.charAt(0).toUpperCase() : p2pFilterIcon(data, user)}</Avatar>

        <div className='flex flex-col'>
          <h1 className={` ${checkmessage || data?.message_group_text?.user_id === '999998989789' ? 'font-normal' : 'font-bold'}  text-md`}>{data?.is_gc ? data?.group_name : p2pFilter(data, user)}</h1>
          <p className={`text-xs ${checkmessage || data?.message_group_text?.user_id === '999998989789' ? 'font-normal' : 'font-bold'} ${compareDate(data?.message_group_text?.created_at, data?.updated_at) ? '' : 'font-bold'}`}>

            {data?.message_group_text ?
              data?.message_group_text?.is_deleted ?
                "This message is no longer available" :
                `${data?.message_group_text?.user ? data?.is_gc ? `${data?.message_group_text?.user?.fname} :` : "" : ""}  ${data?.message_group_text?.text_message !== 'null' ? truncateText(data?.message_group_text?.text_message) : `${data?.is_gc ? '' : data?.message_group_text?.user?.fname} sent a file`} • ${formatDate(data?.message_group_text?.created_at)}`
              : null
            }

          </p>
        </div>
      </div>

      {/* {messengerAdminLevel >= 1 && */}
      <div onClick={handleClick} className='text-sm cursor-pointer hover:bg-gray-100 hover:rounded-full' >
        <MoreVertIcon />
      </div>
      {/* } */}

      {anchorEl &&
        <Suspense>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={handleClose} />

            <MenuItem onClick={handlePinnedGroup}>

              <ListItemIcon>
                <PushPinIcon fontSize="small" />
              </ListItemIcon>

              <ListItemText >{data?.pinned_group ? "Unpin" : "Pin"} Group</ListItemText>

            </MenuItem>

            {messengerAdminLevel >= 1 && data?.is_gc ? <MenuItem onClick={handleManageTeam}>

              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>

              <ListItemText>Manage Group</ListItemText>

            </MenuItem> : null}

            {messengerAdminLevel >= 1 && data?.is_gc ?
              <MenuItem onClick={handleLeaveViewModal}>

                <ListItemIcon>
                  <ExitToAppIcon fontSize="small" />
                </ListItemIcon>

                <ListItemText>Leave Group</ListItemText>

              </MenuItem> : null}

          </Menu>
        </Suspense>
      }


    </div>
  )
};
