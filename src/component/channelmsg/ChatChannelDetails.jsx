import React, { useState, useRef, useEffect, useCallback, lazy, Suspense } from 'react';

import Avatar from '@mui/material/Avatar';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

import PushPinIcon from '@mui/icons-material/PushPin';
import EditIcon from '@mui/icons-material/Edit';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';
import Forward5Icon from '@mui/icons-material/Forward5';

import { FaReply } from "react-icons/fa";

import Tooltip from '@mui/material/Tooltip';

import { formatDate, getNameById } from '../../contants';

const Menu = lazy(() => import('@mui/material/Menu'));

export const ChatChannelDetails = React.memo(({ content, reply, handlePinMessage, handleDeleteMessasage, handleForwardMessage }) => {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const containerRef = useRef(null);


  useEffect(() => {
    const observer = new ResizeObserver(() => {
      // Prevent infinite loop
      requestAnimationFrame(() => {

      });
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect(); // Cleanup on unmount
    };
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleReply = useCallback(() => {
    reply(content);
    setAnchorEl(null);
  }, [reply, content]);

  const handleForwardClick = useCallback(() => {
    handleForwardMessage(content);
    setAnchorEl(null);
  }, [handleForwardMessage, content]);


  const handlePinClick = useCallback(() => {
    handlePinMessage(content);
    setAnchorEl(null);
  }, [handlePinMessage, content]);


  const handleDeleteClick = useCallback(() => {
    handleDeleteMessasage(content);
    setAnchorEl(null);
  }, [handleDeleteMessasage, content]);

  return (

    <div className='flex flex-row items-center justify-start  w-full gap-2' ref={containerRef}>
      <Avatar sx={{ bgcolor: '#16a34a', width: 35, height: 35, fontSize: '0.75rem' }}>{getNameById(content?.user_id)?.charAt(0).toUpperCase()}</Avatar>

      <div className='flex flex-col' onClick={handleClick}>
        <Tooltip title={formatDate(content?.created_at)} placement="right">

          <div className='flex flex-row justify-self-start'>
            {content?.reply_data && <span className='text-[10px] font-light text-gray-400 pr-1'><FaReply /></span>} {/* reply icon */}
            {content?.forwarded_message && <span className='text-xs font-light text-gray-400 pr-1'><Forward5Icon fontSize="small" /></span>} {/* forward icon */}

            <span className='text-xs text-gray-500'>{getNameById(content?.user_id)} </span>

            {content?.reply_data && <h1 className='text-xs text-gray-400 pl-1'> replied to {getNameById(content?.reply_data?.user_id)}</h1>}
            {content?.forwarded_message && <h1 className='text-xs text-gray-400 pl-1'>forwarded to {content?.message_group?.group_name}</h1>}

            {parseInt(content?.pinned_message) === 1 && (
              <>
                <span className="text-sm text-gray-500 pl-1">· </span>
                <span className="text-xs text-red-500 pl-1">Pinned</span>
              </>
            )}
          </div>

          {content?.forwarded_message &&
            <React.Fragment>
              <div className='px-2 bg-gray-200 rounded cursor-pointer mb-2'>
                <h1 className='text-lg'>{content?.reply_data?.text_message}</h1>
              </div>
            </React.Fragment>
          }

          {content?.reply_data && (
            <div className="flex flex-col py-1 ">
              {/* Reply container */}
              <div className="p-2 bg-green-100 rounded cursor-pointer flex flex-row-reverse gap-2 max-w-[500px] w-fit break-words">
                <h1 className="text-lg text-gray-500">{content?.reply_data?.text_message}</h1>
              </div>
            </div>
          )}

          {/* Main message container */}
          <div className="px-2 bg-gray-200 rounded cursor-pointer justify-self-start py-2 flex flex-row-reverse gap-2 max-w-[500px]  overflow-hidden" >
            <h1 className='text-lg t whitespace-pre-wrap break-words'>
              {content?.message}
            </h1>
          </div>



        </Tooltip>

        <div className='flex flex-col'>
          {/* {parseInt(content?.pinned_message) === 1 && <span className='text-[10px] text-red-500'>Pinned</span>} */}
          <span className='text-[10px]'>{formatDate(content?.created_at)}</span>
        </div>


      </div>



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
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >

            <MenuItem onClick={handleClose} />

            <MenuItem onClick={handleReply}>

              <ListItemIcon>
                <ReplyIcon fontSize="small" />
              </ListItemIcon>

              <ListItemText>Reply</ListItemText>

            </MenuItem>


            <MenuItem onClick={handleForwardClick}>

              <ListItemIcon>
                <Forward5Icon fontSize="small" />
              </ListItemIcon>

              <ListItemText>Forward</ListItemText>

            </MenuItem>


            <MenuItem onClick={handlePinClick}>

              <ListItemIcon>
                <PushPinIcon fontSize="small" />
              </ListItemIcon>

              <ListItemText>{parseInt(content?.pinned_message) === 1 ? "Unpin" : "Pin"}</ListItemText>

            </MenuItem>

            <MenuItem onClick={handleDeleteClick}>

              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>

              <ListItemText>Remove</ListItemText>

            </MenuItem>

          </Menu>
        </Suspense>
      }


    </div>
  )
});
