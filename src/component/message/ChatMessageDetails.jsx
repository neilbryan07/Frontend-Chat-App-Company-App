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

import { formatDate, getFullName, getName, getNameById } from '../../contants';

import { TbPinnedFilled, TbPencil } from "react-icons/tb";

import { PiFilePdf } from 'react-icons/pi';

import { BiDoorOpen } from "react-icons/bi";
import { ThumbsUpDownOutlined, ThumbUp, ThumbUpOutlined } from '@mui/icons-material';

import { useSelector } from 'react-redux';

import { APIServices } from '../../hooks/fetchAPI';
import { Chip } from '@mui/material';
import UserProfile from '../actionSelection/UserProfile';

const Menu = lazy(() => import('@mui/material/Menu'));
const ViewModelImage = lazy(() => import('../FileUpload/ViewModelImage'));

export const ChatMessageDetails = React.memo(({ content, reply, handlePinMessage, handleDeleteMessasage, handleForwardMessage, checkIfLatestData, handleReact }) => {

  const user = useSelector((state) => state.user.userData)

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const containerRef = useRef(null);

  const [modalImage, setModalImage] = useState(null);

  const [seenUser, setSeenUser] = useState(JSON.parse(content?.seen_user));
  const [reactFetch, setReactFetch] = useState([]);

  const [imageFiles, setImageFiles] = useState('');

  const [isClick, setClick] = useState(false)
  const [moreOption, setMoreOption] = useState(false)
  const [isLiked, setLike] = useState(content?.is_react === 1 ? true : false)

  useEffect(() => {
    setImageFiles(content?.group_file?.filter(file => file.file_type.includes("image")))
    setReactFetch(content?.is_react_data ? JSON.parse(content.is_react_data) : [])
    setSeenUser(JSON.parse(content?.seen_user));
  }, [content]);

  // const [senderName, setSenderName] = useState("");

  // useEffect(() => {
  //   const fetchSenderName = async () => {
  //     if (content?.user_id) {
  //       const name = await getFullName(content?.user_id);
  //       setSenderName(name);
  //     }
  //   };
  //   fetchSenderName();
  // }, [content?.user_id, content]);

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
    setMoreOption(false)
  }, [handleForwardMessage, content]);


  const handlePinClick = useCallback(() => {
    handlePinMessage(content);
    setMoreOption(false)
  }, [handlePinMessage, content]);


  const handleDeleteClick = useCallback(() => {
    handleDeleteMessasage(content);
    setMoreOption(false)
  }, [handleDeleteMessasage, content]);

  const parseMessage = (text) => {
    if (!text) return "";

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) =>
      part.match(urlRegex) ? (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline break-words"
        >
          {part}
        </a>
      ) : (
        part
      )
    );
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMoreOption(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isClick]);


  const [toggleMember, setToggleMember] = useState(false);

  return (
    <div className='w-full flex flex-col'>

      {toggleMember && (
        <Suspense>
          <UserProfile
            data={content?.user}
            toggle={toggleMember}
            setToggle={setToggleMember}
          />
        </Suspense>
      )}

      <div className='flex flex-row items-center justify-start  w-full gap-2' ref={containerRef}
        onMouseEnter={() => setClick(true)}
        onMouseLeave={() => moreOption && isClick ? setClick(true) : setClick(false)}
      >

        {!content?.is_leave && (
          <Avatar
            title={`${content?.user?.fname ?? ''} ${content?.user?.lname ?? ''}`.trim()}
            onClick={() => { setToggleMember(true) }}
            sx={{
              bgcolor: '#16a34a',
              width: 35,
              height: 35,
              fontSize: '0.75rem',
            }}
            src={content?.user?.ass_id !== null ? `https://611systems.com/assets_clients/611/users/${content?.user?.ass_id}/latest_pic.jpg` : ''}
          >
            {content?.user?.fname?.charAt(0).toUpperCase()}
          </Avatar>
        )}


        {content?.is_leave ?
          <h1 className='text-sm self-start whitespace-pre-wrap flex flex-row items-center break-words font-light text-gray-500'>
            <BiDoorOpen /> {content?.text_message}
          </h1> : null
        }


        {modalImage &&
          <Suspense>
            <ViewModelImage
              modalImage={modalImage}
              setModalImage={setModalImage}
              imageFiles={imageFiles}
            />
          </Suspense>
        }

        {content?.is_deleted && !content?.is_leave ?
          <div className='flex flex-col max-w-[500px] gap-2'>

            <div className='flex flex-row justify-self-start'>
              <span className='text-xs text-gray-500 '>{content?.user?.fname} {content?.user?.lname}</span>
            </div>

            <Tooltip title={formatDate(content?.created_at)} placement="bottom">
              <div className='self-start px-2 bg-gray-200 dark:bg-gray-600 rounded  py-2 justify-items-end justify-self-end max-w-[500px] w-fit overflow-hidden'>
                <h1 className='text-sm self-end whitespace-pre-wrap break-words font-semibold'>
                  This message is no longer available
                </h1>
              </div>
            </Tooltip>
          </div> : null
        }

        {!content?.is_deleted && !content?.is_leave ?
          <div className='flex flex-col relative' ref={dropdownRef}>
            <Tooltip title={formatDate(content?.created_at)} placement="left-start">

              <div className='flex flex-row justify-self-start'>
                {content?.reply_data && <span className='text-[10px] font-light text-gray-400  dark:text-gray-200 pr-1'><FaReply /></span>}
                {content?.forwarded_message && <span className='text-xs font-light text-gray-400   dark:text-gray-200 pr-1'><Forward5Icon fontSize="small" /></span>}
                <span className='text-xs text-gray-500 dark:text-gray-200'>{content?.user?.fname} {content?.user?.lname}</span>


                {content?.reply_data && <h1 className='text-xs text-gray-400   dark:text-gray-200 pl-1'> replied to {content?.reply_data?.user?.fname} {content?.reply_data?.user?.lname}</h1>}
                {content?.forwarded_message && <h1 className='text-xs text-gray-400  dark:text-gray-200  pl-1'>forwarded a message</h1>}
                {content?.user?.messenger_admin !== 0 && <div className='text-xs text-gray-500  dark:text-gray-200 pl-1'><span>{content?.user?.messenger_admin === 2 ? ' • Head' : content?.user?.messenger_admin === 1 ? ' • Admin' : ''}</span> </div>}


                {parseInt(content?.pinned_message) === 1 && (
                  <>
                    <span className="text-xs text-gray-500  dark:text-gray-200 pl-1"> •  </span>
                    <span className="text-xs text-red-500 pl-1 flex flex-row gap"><TbPinnedFilled />Pinned</span>
                  </>
                )}
              </div>

              {content?.forwarded_message &&
                <React.Fragment>
                  <div className='px-2 bg-gray-200 rounded cursor-pointer mb-2'>
                    <h1 className='text-md'>{content?.reply_data?.text_message}</h1>
                  </div>
                </React.Fragment>
              }

              {content?.reply_data && (
                <div className="flex flex-col py-1 ">
                  {/* Reply container */}
                  <div className="p-2 bg-green-100 rounded cursor-pointer flex flex-row-reverse gap-2 max-w-[500px] w-fit break-words">
                    <h1 className="text-md text-gray-500">{content?.reply_data?.text_message !== 'null' ? content?.reply_data?.text_message : 'file attached'}</h1>
                  </div>
                </div>
              )}



              {/* Main message container */}
              <div className='flex flex-row-reverse justify-end items-center gap-2 relative'>


                {content?.text_message !== 'null' && <div className="px-2 bg-gray-200 dark:bg-gray-700 rounded cursor-pointer justify-self-start items-start py-2 flex flex-row gap-2 max-w-[500px]  overflow-hidden" >
                  <h1 className='text-md  whitespace-pre-wrap break-words'>
                    {parseMessage(content?.text_message)}
                  </h1>
                </div>}
              </div>


            </Tooltip>

            {content?.is_edited ? <span className='text-blue-700 absolute left-0 bottom-9 text-[12px]'><TbPencil /></span> : null}

            {parseInt(reactFetch?.length) >= 1 && <span
              className="text-blue-700  text-[3px] absolute left-0 top-[90%] p-1 flex flex-row gap-1 items-center"

            >
              {/* <ThumbUp sx={{ fontSize: 12 }} /> */}

              {parseInt(reactFetch?.length) >= 2 && <span className='text-[13px]'>{reactFetch?.length}</span>}
              <ThumbUp sx={{ fontSize: 12 }} />
            </span>}
          </div> : null
        }

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

        {isClick && !content?.is_leave && !content?.is_deleted ?
          <div className='flex flex-row-reverse gap-2 text-gray-600 dark:text-gray-200 relative top-2'>
            <div title='More' onClick={() => setMoreOption(!moreOption)}> <MoreVertIcon fontSize="small" /> </div>
            <div title='Reply' onClick={handleReply}> <ReplyIcon fontSize="small" /> </div>
            <div title='Like' onClick={() => handleReact(content?.id, isLiked, setLike, content, setReactFetch)}> <ThumbUpOutlined fontSize="small" /> </div>

          </div>
          : null}

        <div className='flex flex-row justify-end items-center gap-2 relative' ref={dropdownRef}>

          {moreOption && (
            <div
              className="absolute w-fit bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 animate-fadeIn z-50 flex flex-col-reverse"
              style={{
                right: '0',
                top: 'calc(80% + 4px)',
              }}

            >
              <div
                onClick={handleDeleteClick}
                className="flex items-center cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-500 transition"
              >
                <DeleteIcon fontSize="small" className="mr-2 text-gray-600 dark:text-gray-200" /> Delete
              </div>

              <div
                onClick={handleForwardClick}
                className="flex items-center cursor-pointer px-4 py-2 hover:bg-gray-100  dark:hover:bg-gray-500 transition"
              >
                <Forward5Icon fontSize="small" className="mr-2 text-gray-600 dark:text-gray-200" /> Forward
              </div>

              <div
                onClick={handlePinClick}
                className="flex items-center cursor-pointer px-4 py-2 hover:bg-gray-100  dark:hover:bg-gray-500  transition"
              >
                <PushPinIcon fontSize="small" className="mr-2 text-gray-600 dark:text-gray-200" /> {parseInt(content?.pinned_message) === 1 ? "Unpin" : "Pin"}
              </div>


            </div>
          )}

        </div>
      </div>


      <div className='flex flex-col justify-start ml-10 w-6/12 relative'>

        {/* { content?.group_file?.length > 0 && (
        <div className="grid py-2 rounded">
          <div className="flex gap-2 flex-wrap">
            {content?.group_file?.map((file, index) => (
              <img
                key={index}
                src={file.file_path}
                alt={file.file_name}
                className="w-30 h-20 object-cover rounded-lg cursor-pointer shadow-md"
                onClick={() => setModalImage(file)}
              />
            ))}
          </div>
        </div>
      )} */}

        {content?.group_file?.length > 0 && (
          <div className="grid py-2 rounded items-start place-items-start ">

            <div className="flex gap-2 flex-wrap">
              {content?.group_file?.map((file, index) => {

                if (file?.file_type?.startsWith('image/')) {
                  return (
                    <img
                      key={index}
                      src={file.file_path}
                      alt={file.file_name}
                      className="w-30 h-20 object-cover rounded-lg cursor-pointer shadow-md"
                      onClick={() => setModalImage(file.download_url ? file.download_url : file.file_path)}
                    />
                  )
                }

                if (file?.file_type?.startsWith('application/pdf')) {
                  return (
                    <a
                      href={file.file_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-row items-center gap-2 font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 truncate max-w-[200px] border border-red-500 dark:border-red-400 p-2 rounded transition-colors duration-200" title={file.file_name}
                    >
                      <span className='text-xl text-red-500'><PiFilePdf /></span>
                      <span className='text-gray-900 dark:text-gray-200'>
                        {file.file_name.length > 25 ? file.file_name.substring(0, 15) + "..." : file.file_name}
                      </span>
                    </a>
                  )
                }
              })}
            </div>
          </div>
        )}


        {seenUser?.length > 1 && checkIfLatestData?.id === content?.id ?
          (
            <div className='flex flex-row self-start max-w-[300px] mt-3 flex-wrap'>

              <span className='text-[10px] self-start whitespace-nowrap'>Seen by </span>
              {seenUser?.map((file, index) => (
                parseInt(file?.id) !== parseInt(user?.id) && <span key={index} className='ml-2 text-[10px] self-end whitespace-nowrap'>{file?.name}</span>
              ))}

            </div>
          ) : null
        }

      </div>
    </div >
  )
});
