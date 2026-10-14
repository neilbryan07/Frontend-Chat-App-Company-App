import React, { useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import PushPinIcon from '@mui/icons-material/PushPin';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector, useDispatch } from "react-redux";
import { APIServices } from '../../hooks/fetchAPI';
import { storeToggleMessage } from '../../redux/GroupChat/ToggleMessageSlice';
import { ArrowCircleRight, CreateNewFolder, ManageAccounts, Settings, SubdirectoryArrowRight } from '@mui/icons-material';
import { Divider } from '@mui/material';
import { IoCaretDownOutline, IoCaretForwardOutline, IoCaretUpCircleOutline, IoCaretUpOutline } from 'react-icons/io5';

const Menu = lazy(() => import('@mui/material/Menu'));

export const TeamItem = React.memo(({ data, setToggle, setDeleteToggle, setManageMember, setSelectedData, setTeam_id, setToggleTeam, toggleTeam, handleFetchingGroupChat, pin, selectedChannelID, setSelectedChannelID }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const message = useSelector((state) => state.message.messageData)
  const user = useSelector((state) => state.user.userData)

  const dispatch = useDispatch();

  const messengerAdminLevel = user?.permission;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [channel_id, setChannel_id] = useState(null);

  const handleChannelClick = (channelId) => {
    setChannel_id(parseFloat(channelId));
    handleChannel(channelId);
    setSelectedChannelID(parseFloat(channelId));

    setTimeout(() => setToggleTeam(false), 100);

  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);

  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUpdate = () => {
    setAnchorEl(null);
    setToggle(true);
    setSelectedData(data)
  };

  const handleManageTeam = () => {
    setAnchorEl(null);
    setToggleTeam(true);
    setTeam_id(data);
  };

  const handleManageMember = () => {
    setAnchorEl(null);
    setManageMember(true);
    setSelectedData(data)
  };


  const handleDelete = () => {
    setAnchorEl(null);
    setDeleteToggle(true);
    setSelectedData(data)

  };

  const handleAddChannel = async () => {
    setAnchorEl(null);
    setToggle(true);
    setSelectedData(data)
  };

  const handleLeave = async () => {

    let submitData = {
      "group_id": data?.id,
      "user_id": user?.id
    }

    const response = await APIServices.deletes({ url: `/leave-message-group`, payload: submitData });

    if (response?.status === 200) {


      setAnchorEl(null);
      setSelectedData(data)

    }

  };

  const handlePinnedGroup = async () => {

    setAnchorEl(null);

    let response;

    if (!pin) {
      response = await APIServices.post({
        url: `/pin-team`,
        payload: { "team_id": data.team_id }
      });
    } else {
      response = await APIServices.post({
        url: `/unpin-team`,
        payload: { "team_id": data.team_id }
      });
    }


    handleFetchingGroupChat();
    return;
  }

  // const handleConversation = useCallback(async () => {

  //   dispatch(storeToggleMessage(true))
  //   navigate(`/message/${data?.id}`);

  // }, []);


  const [expandedTeam, setExpandedTeam] = useState(null);

  const handleTeamClick = (teamName) => {
    setExpandedTeam(expandedTeam === teamName ? null : teamName);
    setTeam_id(data);
  };

  const handleChannel = async (channel_id) => {
    dispatch(storeToggleMessage(true))
    setToggleTeam(false);
    navigate(`/channel/${channel_id}`);
  };


  return (
    <div className='flex flex-col'>
      <div className='flex flex-row items-center justify-between w-full gap-3 p-2 rounded'>

        <div
          className="flex flex-row items-center w-full gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 "
          onClick={() => {
            handleTeamClick(data?.team_name);
          }}
        >
          {expandedTeam ? <IoCaretDownOutline /> : <IoCaretForwardOutline />}
          <Avatar sx={{ bgcolor: '#16a34a' }}>
            {data?.team_name?.charAt(0).toUpperCase()}
          </Avatar>

          <div className="flex flex-col">
            <h1 className="font-semibold text-lg">{data?.team_name}</h1>
          </div>
        </div>

        <div onClick={handleClick} className='text-sm' >
          <MoreVertIcon />
        </div>

        {/* Render Channels if the team is expanded */}

      </div>

      {
        anchorEl &&
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
            <MenuItem onClick={handlePinnedGroup}>

              <ListItemIcon>
                <PushPinIcon fontSize="small" />
              </ListItemIcon>

              <ListItemText>{pin ? "Unpin" : "Pin"} Team</ListItemText>

            </MenuItem>

            {messengerAdminLevel >= 1 && <MenuItem onClick={handleManageTeam}>

              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              <ListItemText>Manage Team</ListItemText>
            </MenuItem>
            }

            {/* {messengerAdminLevel >= 1 && <MenuItem onClick={handleUpdate}>

              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>

              <ListItemText>Update Team</ListItemText>

            </MenuItem>} */}

            {messengerAdminLevel >= 1 && <MenuItem onClick={handleAddChannel}>

              <ListItemIcon>
                <CreateNewFolder fontSize="small" />
              </ListItemIcon>
              <ListItemText>Add New Channel</ListItemText>
            </MenuItem>
            }

            {messengerAdminLevel >= 1 && <MenuItem onClick={handleManageMember}>

              <ListItemIcon>
                <ManageAccounts fontSize="small" />
              </ListItemIcon>

              <ListItemText>Add Member</ListItemText>

            </MenuItem>}


            {/* <MenuItem onClick={handleLeave}>

              <ListItemIcon>
                <ExitToAppIcon fontSize="small" />
              </ListItemIcon>

              <ListItemText>Leave Group</ListItemText>

            </MenuItem> */}

            {messengerAdminLevel >= 1 &&
              <>
                <Divider />
                <MenuItem onClick={handleDelete}>

                  <ListItemIcon>
                    <DeleteIcon fontSize="small" />
                  </ListItemIcon>

                  <ListItemText>Delete Team</ListItemText>

                </MenuItem>
              </>
            }

          </Menu>
        </Suspense>
      }

      {
        expandedTeam === data?.team_name && (
          <div className="flex flex-col items-start justify-between w-full rounded" onClick={() => setToggleTeam(false)}>
            {data?.channels?.map((channel, index) => (
              <div
                key={index}
                className={`flex flex-row items-start pointer-events-auto gap-2 w-full py-2 pl-20 
            ${selectedChannelID === channel.channel_id ? 'bg-green-100 dark:bg-green-800' : 'hover:bg-gray-50 dark:hover:bg-gray-600'}`}
                onClick={() => handleChannelClick(channel.channel_id)}
              >
                <h1>{channel.name}</h1>
              </div>
            ))}
          </div>
        )
      }


    </div >
  )
});
