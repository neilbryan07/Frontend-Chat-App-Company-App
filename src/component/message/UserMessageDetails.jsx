import React, { useState, useRef, useEffect, useCallback, lazy, Suspense } from 'react';

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

import Tooltip from '@mui/material/Tooltip';

import { FaReply, } from "react-icons/fa";

import { formatDate, getFullName, getName, getNameById } from '../../contants';
import { useSelector } from 'react-redux';

import { TbPinnedFilled, TbPencil } from "react-icons/tb";

import { PiFilePdf } from 'react-icons/pi';
import { EmojiEmotions, EmojiEmotionsOutlined, ThumbsUpDown, ThumbUp, ThumbUpOffAltOutlined } from '@mui/icons-material';
import Badge from '@mui/material/Badge';


import { APIServices } from '../../hooks/fetchAPI';

const Menu = lazy(() => import('@mui/material/Menu'));
const ViewModelImage = lazy(() => import('../FileUpload/ViewModelImage'));

export const UserMessageDetails = React.memo(({ content, handlePinMessage, handleDeleteMessasage, handleForwardMessage, handleFetchEditText, reply, checkIfLatestData, handleReact }) => {

    const user = useSelector((state) => state.user.userData)

    const [seenUser, setSeenUser] = useState([]);
    const [reactFetch, setReactFetch] = useState([]);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const containerRef = useRef(null);
    const [isClick, setClick] = useState(false)
    const [isLiked, setLike] = useState(parseInt(content?.is_react) > 0 ? true : false)

    const [moreOption, setMoreOption] = useState(false)


    const [modalImage, setModalImage] = useState(null);

    const [imageFiles, setImageFiles] = useState('');

    useEffect(() => {
        setImageFiles(content?.group_file?.filter(file => file.file_type.includes("image")))
        setSeenUser(JSON.parse(content?.seen_user));
        setReactFetch(content?.is_react_data ? JSON.parse(content.is_react_data) : [])
    }, [content]);

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


    const handleClick = useCallback((event) => {
        setAnchorEl(event.currentTarget);
        setClick(true)
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleReply = useCallback(() => {
        reply(content);
        setAnchorEl(null);
    }, [reply, content]);

    const handleEditTexts = useCallback(() => {
        handleFetchEditText(content);
        setMoreOption(false);
    }, [handleFetchEditText, content, moreOption]);


    const handlePinClick = useCallback(() => {
        handlePinMessage(content);
        setMoreOption(false);
    }, [handlePinMessage, content, moreOption]);

    const handleDeleteClick = useCallback(() => {
        handleDeleteMessasage(content);
        setMoreOption(false);
    }, [handleDeleteMessasage, content, moreOption]);

    const handleForwardClick = useCallback(() => {
        handleForwardMessage(content);
        setMoreOption(false);
    }, [handleForwardMessage, content, moreOption]);

    const textFieldRef = useRef(null);

    // useEffect(() => {
    //     const handleKeyPress = (event) => {
    //         if (document.activeElement !== textFieldRef.current) {
    //             textFieldRef.current?.focus();
    //         }
    //     };

    //     window.addEventListener("keydown", handleKeyPress);
    //     return () => {
    //         window.removeEventListener("keydown", handleKeyPress);
    //     };
    // }, []);

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
    }, []);

    return (
        <div className='flex flex-row-reverse w-full ' ref={containerRef}
            onMouseEnter={() => setClick(true)}
            onMouseLeave={() => moreOption && isClick ? setClick(true) : setClick(false)}
        >


            {content?.is_deleted ?
                <div className='flex flex-col max-w-[500px]'>
                    <Tooltip title={formatDate(content?.created_at)} placement="bottom">
                        <div className='self-end px-2 bg-gray-200 rounded  py-2 justify-items-end justify-self-end max-w-[500px] w-fit overflow-hidden'>
                            <h1 className='text-sm self-end whitespace-pre-wrap break-words font-semibold'>
                                This message is no longer available
                            </h1>
                        </div>
                    </Tooltip>
                </div> :

                <div className='flex flex-col max-w-[500px] relative' >

                    {modalImage &&
                        <Suspense>
                            <ViewModelImage
                                modalImage={modalImage}
                                setModalImage={setModalImage}
                                imageFiles={imageFiles}
                            />
                        </Suspense>
                    }


                    <div className='flex flex-col relative '
                    >


                        <Tooltip title={`${formatDate(content?.created_at)}`} placement="bottom-end">
                            <div className='flex flex-row justify-self-end'>
                                {content?.reply_data &&
                                    <React.Fragment>
                                        <div className='flex flex-row gap-2 items-center justify-evenly self-end '>
                                            <span className='text-xs font-light text-gray-400 dark:text-gray-200'><FaReply /></span>
                                            <h1 className='text-xs text-gray-500  dark:text-gray-200'>You replied to {content?.reply_data?.user?.fname} {content?.reply_data?.user?.lname}</h1>
                                            {parseInt(content?.pinned_message) === 1 && <span className="text-sm text-gray-500 dark:text-gray-200 ">· </span>}
                                        </div>
                                    </React.Fragment>
                                }

                                {content?.forwarded_message &&
                                    <React.Fragment>
                                        <div className='flex flex-row gap-2 items-center justify-end '>
                                            <span className='text-xs font-light text-gray-400 dark:text-gray-200'><Forward5Icon fontSize="small" /></span>
                                            <h1 className='text-xs text-gray-500 dark:text-gray-200'>You forwarded a message                                            </h1>
                                            {parseInt(content?.pinned_message) === 1 && <span className="text-sm text-gray-500 dark:text-gray-200">· </span>}
                                        </div>
                                    </React.Fragment>
                                }

                                {parseInt(content?.pinned_message) === 1 && <div className='flex flex-row gap-2 items-center justify-start '>
                                    <span className="text-xs text-red-500 pl-1 flex flex-row gap"><TbPinnedFilled />Pinned</span></div>}

                            </div>


                            {content?.reply_data && <div className='p-2 bg-gray-100 dark:bg-gray-500 rounded cursor-pointer mb-1 gap-2 justify-self-end min-w-fit '>
                                <h1 className='text-sm  text-gray-500 dark:text-gray-200 self-end '>{content?.reply_data?.text_message !== 'null' ? content?.reply_data?.text_message : 'file attached'}</h1>
                            </div>}


                            {content?.forwarded_message &&
                                <React.Fragment>

                                    <div className='px-2 bg-gray-200 dark:bg-gray-500 rounded cursor-pointer mb-2 justify-self-end w-fit' >
                                        <h1 className='text-md '>{content?.reply_data?.text_message !== 'null' ? content?.reply_data?.text_message : 'file attached'}</h1>
                                    </div>
                                </React.Fragment>
                            }

                            {/* <div className='px-2 bg-green-200 rounded cursor-pointer py-2 justify-items-end justify-self-end w-fit '>
                        <h1 className='text-lg self-end'><pre>{content?.text_message}</pre></h1>
                    </div> */}




                            <div className='flex flex-row justify-end items-center gap-2 relative' >


                                {content?.text_message !== 'null' && <div className='px-2 bg-green-200 dark:bg-green-600 rounded cursor-pointer py-2 justify-items-end justify-self-end max-w-[500px] w-fit overflow-hidden'>
                                    <h1 className='text-md self-end whitespace-pre-wrap break-words'>
                                        {parseMessage(content?.text_message)}
                                    </h1>
                                </div>}
                            </div>

                        </Tooltip>
                        {content?.is_edited ? <span className='text-blue-700 absolute right-0 bottom-9 text-[12px]'><TbPencil /></span> : null}

                        {content?.group_file?.length > 0 && (
                            <div className="grid py-2 rounded items-end place-items-end place-self-end place-content-end">


                                <div className="flex gap-1 flex-wrap  items-end">
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
                                                    className="flex flex-row items-center gap-2 font-medium text-gray-900 truncate  border border-red-500 p-2 rounded"
                                                    title={file.file_name}
                                                >
                                                    <span className='text-xl text-red-500'><PiFilePdf /></span>
                                                    <div className='dark:text-gray-200'>
                                                        {file.file_name.length > 25 ? file.file_name.substring(0, 15) + "..." : file.file_name}
                                                    </div>
                                                </a>
                                            )
                                        }

                                    })}
                                </div>



                            </div>
                        )}

                        {parseInt(reactFetch?.length) >= 1 && <span
                            className="text-blue-700  text-[3px] absolute right-0 top-[95%] p-1 flex flex-row gap-1 items-center"

                        >
                            {/* <Badge badgeContent={4}>
                               
                            </Badge> */}
                            {parseInt(reactFetch?.length) >= 2 && <span className='text-[13px]'>{reactFetch?.length}</span>}
                            <ThumbUp sx={{ fontSize: 12 }} />

                        </span>}

                    </div>

                    {seenUser?.length > 1 && checkIfLatestData?.id === content?.id ?

                        (
                            <div className='flex flex-row self-end max-w-[300px] mt-3 flex-wrap'>

                                <span className='text-[10px] self-end whitespace-nowrap'>Seen by </span>
                                {seenUser?.slice(0, 4)?.map((file, index) => (

                                    parseInt(file?.id) !== parseInt(user?.id) && <span key={index} className='ml-2 text-[10px] self-end whitespace-nowrap'>{file?.name}</span>

                                ))}

                            </div>

                        ) : null
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
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                            >


                                <MenuItem onClick={handleClose} />

                                <MenuItem onClick={handleReply}>

                                    <ListItemIcon>
                                        <ReplyIcon fontSize="small" />
                                    </ListItemIcon>

                                    <ListItemText>Reply</ListItemText>

                                </MenuItem>

                                <MenuItem onClick={handleEditTexts}>

                                    <ListItemIcon>
                                        <EditIcon fontSize="small" />
                                    </ListItemIcon>

                                    <ListItemText>Edit</ListItemText>

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

            }

            {isClick &&
                <div className='flex flex-row gap-2 items-center text-gray-600 dark:text-gray-200 mr-2'>
                    <div title='More' onClick={() => setMoreOption(!moreOption)}> <MoreVertIcon fontSize="small" /> </div>
                    <div title='Reply' onClick={handleReply}> <ReplyIcon fontSize="small" /> </div>
                    <div title='Like' onClick={() => [handleReact(content?.id, isLiked, setLike, content, setReactFetch)]}> <ThumbUpOffAltOutlined fontSize="small" /> </div>

                </div>
            }

            <div className='flex flex-row justify-end items-center gap-2 relative' ref={dropdownRef}>

                {moreOption && (
                    <div
                        className="absolute w-fit bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-500 animate-fadeIn z-50 flex flex-col-reverse"
                        style={{
                            left: '0',
                            top: 'calc(85% + 4px)',
                        }}

                    >
                        <div
                            onClick={handleDeleteClick}
                            className="flex items-center cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-500 transition"
                        >
                            <DeleteIcon fontSize="small" className="mr-2 text-gray-600 dark:text-gray-200" /> Delete
                        </div>
                        <div
                            onClick={handleEditTexts}
                            className="flex items-center cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-500 transition"
                        >
                            <EditIcon fontSize="small" className="mr-2 text-gray-600 dark:text-gray-200" /> Edit
                        </div>
                        <div
                            onClick={handleForwardClick}
                            className="flex items-center cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-500 transition"
                        >
                            <Forward5Icon fontSize="small" className="mr-2 text-gray-600 dark:text-gray-200" /> Forward
                        </div>

                        <div
                            onClick={handlePinClick}
                            className="flex items-center cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-500 transition"
                        >
                            <PushPinIcon fontSize="small" className="mr-2 text-gray-600 dark:text-gray-200" /> {parseInt(content?.pinned_message) === 1 ? "Unpin" : "Pin"}
                        </div>


                    </div>
                )}

            </div>
        </div>
    )
});
