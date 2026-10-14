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

import { formatDate, formatDisplayDate, getNameById } from '../../contants';
import { PiDownloadSimple, PiFilePdfFill } from 'react-icons/pi';
import { ViewImage } from '../FileUpload//ViewImage';
import { FilesDetails } from '../FileUpload/FilesDetails';
import { ImageDetails } from '../FileUpload/ImageDetails';
import { Avatar, Chip, CircularProgress, Divider, IconButton, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useSelector } from 'react-redux';
import { APIServices } from '../../hooks/fetchAPI';
import { useParams } from 'react-router-dom';
import echo from '../../hooks/echo';
import { ArticleOutlined, AttachFile, Close, CloseRounded, CloudUploadOutlined, Download, DownloadRounded, MoreHoriz } from '@mui/icons-material';
import { LuImageDown } from 'react-icons/lu';
import { CgEnter } from 'react-icons/cg';
import { all } from 'axios';
import { GiPreviousButton } from 'react-icons/gi';
import { GrFormNext, GrFormPrevious } from 'react-icons/gr';
import ViewModelImage from '../FileUpload/ViewModelImage';



const Menu = lazy(() => import('@mui/material/Menu'));

export const UserChannel = React.memo(({ channelDetails, content, handleDeleteMessasage, setListGroupData, handleEditSubmit, setView, view, handleDeleteReply, handleReplySubmit }) => {

    const { id, channel_id } = useParams();
    const user = useSelector((state) => state.user.userData)
    const [textSubject, setTextSubject] = useState();
    const [textContent, setTextContent] = useState();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const containerRef = useRef(null);
    const [modalImage, setModalImage] = useState(null);
    const initialAllFiles = content?.files || [];
    const initialImageFiles = content?.files?.filter(file => file.file_type.includes("image")) || [];
    const initialFiles = content?.files?.filter(file => !file.file_type.includes("image")) || [];
    const [allFiles, setAllFiles] = useState(initialAllFiles);

    const [imageFiles, setImageFiles] = useState(initialImageFiles);
    const [otherFiles, setOtherFiles] = useState(initialFiles);
    const [replyOptionView, setReplyOptionView] = useState(false);
    const [replyEditView, setReplyEditView] = useState(false);
    const [selectedReplyId, setSelectedReplyId] = useState(null);
    const [removedFileIds, setRemovedFileIds] = useState([]);

    const fileInputRef = useRef(null);
    const [files, setFiles] = useState([]);
    const [editView, setEditView] = useState(false);

    const textFieldRef = useRef(null);
    const [textMessage, setTextMessage] = useState('');
    const [replyEditMessage, setReplyEditMessage] = useState('');
    const [replyEditID, setReplyEditID] = useState('');


    const [replyView, setReplyView] = useState(false);



    const [listReplies, setReplies] = useState([]);


    const [zoom, setZoom] = useState(1);


    useEffect(() => {
        setImageFiles(content?.files?.filter(file => file.file_type.includes("image")))
        setOtherFiles(content?.files?.filter(file => !file.file_type.includes("image")))
    }, [content]);


    useEffect(() => {

        setTextSubject(content?.subject)
        setTextContent(content?.message)

        const observer = new ResizeObserver(() => {
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

    const resetZoom = () => {
        setZoom(1);
    };

    const handleZoomChange = (e) => {
        setZoom(parseFloat(e.target.value));
    };

    useEffect(() => {

        const channel = echo.channel(`channel-reply`)
            .listen('ChannelReplySent', handlePusherEvent)
            .error((error) => {
                console.error('Error on channel:', error);
            });

        return () => {
            channel.stopListening('ChannelReplySent');
            echo.leaveChannel(`channel-reply`);
        };
    }, []);


    const handlePusherEvent = (pusherEvent) => {
        setListGroupData((prevData) => {

            const indexOf = prevData?.findIndex(item => item.id === content.id);

            if (prevData?.[indexOf]?.id === pusherEvent?.message_id) {

                const updatedData = [...prevData];
                updatedData[indexOf] = {
                    ...updatedData[indexOf],
                    replies: [...(updatedData[indexOf]?.replies || []), pusherEvent],
                };

                return updatedData;
            }
            return prevData;
        });

    };




    const handleSubmitReply = async () => {
        if (!textMessage.trim()) return;

        let data = {
            channel_id: parseInt(channel_id),
            message_id: content?.id,
            user_id: user?.id,
            reply: textMessage.trim(),
        };

        console.log('reply-submit', textMessage.trim(),)


        try {
            const response = await APIServices.post({
                url: "/reply-message",
                payload: data,
            });

            if (response?.status === 201) {
                setTextMessage("");
                setReplyView(false);
            }
        } catch (error) {
            console.error("Error sending reply:", error);
        }
    };

    useEffect(() => {
        const observer = new ResizeObserver(() => {
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
        setTextSubject('')
        setTextContent('')
        setAllFiles([])
        setRemovedFileIds([])
        console.log("after", removedFileIds)

    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleEditClick = useCallback(() => {
        setEditView(true)
        setTextSubject(content?.subject)
        setTextContent(content?.message)
        setAllFiles(content?.files)
        handleClose()
    }, [content, handleClose]);

    const handleDeleteClick = useCallback(() => {
        handleDeleteMessasage(content);
        handleClose();
    }, [handleDeleteMessasage, content, handleClose]);

    const handleDeleteReplyClick = useCallback((data) => {
        handleDeleteReply(data);
        setReplyEditView(false);
    }, [handleDeleteReply,]);


    const handleDiscard = useCallback(() => {
        setAllFiles(initialAllFiles)
        setEditView(false)
    }, [initialImageFiles]);

    const handleEditReply = useCallback((replyData) => {
        setReplyEditMessage(replyData.reply_message)
        setReplyEditID(replyData.id)
        setReplyEditView(true)

    }, []);

    const handleEditReplySubmit = async () => {

        let data = {
            "reply_id": replyEditID,
            "reply": replyEditMessage
        }

        await handleReplySubmit(data)
        setReplyEditView(false)
        setSelectedReplyId(null)
        setEditView(false)
    }

    const fetchFileAsBlob = async (file) => {
        console.log(file, '-file')
        try {
            const response = await fetch(file.file_path);
            const blob = await response.blob();
            return new File([blob], file.file_name, { type: file.file_type });
        } catch (error) {
            console.error("Error fetching file:", file.file_path, error);
            return null;
        }
    };

    const [isContentLoading, setIsContentLoading] = useState(false);

    const handleSubmitEdit = async () => {
        setIsContentLoading(true)
        console.log("submit", removedFileIds)
        const formData = new FormData();
        formData.append("message_id", content?.id);
        formData.append("subject", textSubject);
        formData.append("message", textContent);

        removedFileIds.forEach((id) => {
            formData.append("delete_files[]", id);
        });

        const filePromises = allFiles.map(fetchFileAsBlob);
        const resolvedFiles = await Promise.all(filePromises);

        resolvedFiles.forEach((file, index) => {
            if (file) {
                formData.append(`files[${index}]`, file);
            }
        });

        await handleEditSubmit(formData);
        setIsContentLoading(false)
        if (!view) setEditView(false);

    };


    const handleCloseReply = () => {
        setReplyEditView(false)
        setSelectedReplyId(null)
        setEditView(false)
    }

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const newFile = {
                file_name: file.name,
                file_path: URL.createObjectURL(file),
                file_type: file.type
            };
            setAllFiles((prevFiles) => [...prevFiles, newFile]);
        }
    };

    const Header = <div className='flex flex-row justify-between items-center gap-2 mb-2'>

        <div className='flex flex-row justify-start items-center gap-2 mb-2'>
            <Avatar sx={{ bgcolor: '#16a34a', width: 35, height: 35, fontSize: '0.75rem' }}>{content?.user?.first_name?.charAt(0).toUpperCase() || content?.user?.fname?.charAt(0).toUpperCase()}</Avatar>
            <h1 className='font-medium dark:text-gray-200'>
                {content?.user?.first_name || `${content?.user?.fname} ${content?.user?.lname}`}
            </h1>
            <span className=' text-gray-500 dark:text-gray-400'>{formatDisplayDate(content?.created_at)}</span>
            {content?.edited === 1 && <span className=' text-gray-500 dark:text-gray-200'>• Edited</span>}

        </div>
        {editView ? (
            <div className='' onClick={handleDiscard}>
                <Close />
            </div>
        ) : (
            user.id === content?.user?.id && (
                <div className='' onClick={handleClick}>
                    <MoreHoriz />
                </div>
            )
        )}

    </div>;



    return (
        <div className='flex flex-row-reverse w-full justify-self-center justify-center  ' ref={containerRef}>

            <div className='flex flex-col ' onClick={null}>
                <Tooltip title={null
                    //formatDate(content?.created_at)
                } placement="left">

                    <div className="px-4 py-3 bg-green-200 dark:bg-green-800 rounded cursor-pointer lg:min-w-[800px] md:min-w-[500px] sm:min-w-[400px] w-[350px] overflow-hidden">

                        {editView ? <>
                            {Header}
                            <div className='m-2'>
                                <TextField
                                    //inputRef={textFieldRef}
                                    value={textSubject}
                                    variant="outlined"
                                    fullWidth
                                    onChange={(e) => setTextSubject(e.target.value)}
                                    label="Subject"
                                    placeholder="Enter Subject ...."
                                    multiline
                                    minRows={1}
                                    maxRows={3}
                                />
                            </div>
                            <div className='m-2'>
                                <TextField
                                    //inputRef={textFieldRef}
                                    value={textContent}
                                    variant="outlined"
                                    fullWidth
                                    onChange={(e) => setTextContent(e.target.value)}
                                    label="Content"
                                    placeholder="Enter Subject ...."
                                    multiline
                                    minRows={1}
                                    maxRows={3}
                                />
                            </div>

                            {allFiles.length > 0 && (
                                <FilesDetails otherFiles={allFiles} editView={editView} setOtherFiles={setAllFiles} setRemovedFileIds={setRemovedFileIds} />
                            )}

                            <div className='flex flex-row justify-between'>
                                <Tooltip title="Upload File">
                                    <IconButton color="success" size="medium" onClick={handleButtonClick}>
                                        <CloudUploadOutlined />
                                    </IconButton>
                                </Tooltip>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: "none" }}
                                    onChange={handleFileChange}
                                />
                                <div onClick={handleSubmitEdit} className='text-sm rounded-lg bg-green-500 text-white border  border-green-500 cursor-pointer px-3 py-2 gap-2 mt-2'>
                                    {!view && <SendIcon />}
                                    {view && <>Loading...</>}
                                </div>
                            </div>
                        </>
                            :
                            <>
                                {Header}
                                {isContentLoading ?
                                    <div className="flex justify-center items-center py-4">
                                        <CircularProgress variant="plain" size="lg" color="primary" />
                                        <span className="text-gray-600">Loading...</span>
                                    </div>
                                    :
                                    <>
                                        <h1 className="text-lg self-start whitespace-pre-wrap break-words font-bold mt-3">
                                            {content?.subject || "Subject"}
                                        </h1>

                                        <h3 className="text-lg self-start whitespace-pre-wrap break-words my-2">
                                            {content?.message}
                                        </h3>

                                        {imageFiles.length > 0 && (
                                            <div className="grid mt-2 py-2 rounded">
                                                <div className="flex gap-2 flex-wrap">
                                                    {imageFiles.map((file, index) => (
                                                        <img
                                                            key={index}
                                                            src={file.file_path}
                                                            alt={file.file_name}
                                                            className="w-30 h-20 object-cover rounded-lg cursor-pointer shadow-md"
                                                            onClick={() => setModalImage(file.download_url)} />
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {otherFiles.length > 0 && (
                                            <FilesDetails otherFiles={otherFiles} editView={editView} setOtherFiles={setOtherFiles} setRemovedFileIds={setRemovedFileIds} />
                                        )}

                                        {modalImage && (
                                            <ViewModelImage
                                                modalImage={modalImage}
                                                setModalImage={setModalImage}
                                                imageFiles={imageFiles}
                                            />
                                        )}
                                    </>}
                            </>}
                    </div>

                </Tooltip>

                {content.replies && content?.replies?.map((reply) => (
                    <div
                        key={reply?.id}
                        className={`flex flex-col justify-between gap-2 mt-0 pl-5 border-t border-gray-300 dark:border-gray-800 w-full p-2 bg-green-100 dark:bg-green-200 rounded`}
                    >

                        <div className='flex flex-row  justify-between items-start'>
                            <div className='flex flex-row items-start gap-2 '>
                                <Avatar sx={{ bgcolor: '#16a34a', width: 25, height: 25, fontSize: '0.75rem' }}>
                                    {reply?.user?.first_name?.charAt(0).toUpperCase()}
                                </Avatar>


                                <div className="flex flex-col justify-start gap-1 ">
                                    <div className="flex flex-row gap-2">
                                        <h1 className="font-medium dark:text-black" >
                                            {reply?.user?.first_name} {reply?.user?.last_name}
                                        </h1>
                                        <span className="text-gray-500 ">{formatDisplayDate(reply?.created_at)}</span>
                                        {reply?.edited === 1 && <span className=' text-gray-500 dark:text-black'>• Edited</span>}

                                    </div>

                                </div>
                            </div>

                            {selectedReplyId === reply.id ? (
                                <div>
                                    <IconButton size="small">
                                        <EditIcon onClick={() => handleEditReply(reply)} />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => handleDeleteReplyClick(reply)}>
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton size="small" onClick={handleCloseReply}>
                                        <Close />
                                    </IconButton>
                                </div>
                            ) : (
                                reply.user.id === user.id && (
                                    <div className='dark:text-black' onClick={() => setSelectedReplyId(reply.id)}>
                                        <MoreHoriz />
                                    </div>
                                )
                            )}

                        </div>

                        {selectedReplyId === reply.id && replyEditView ? (
                            <div className="w-full ">
                                {replyField(replyEditMessage, setReplyEditMessage, handleEditReplySubmit)}
                            </div>
                        ) : (
                            <span className='dark:text-black'>{reply?.reply_message}</span>
                        )}
                    </div>
                ))}

                <div className='flex flex-row items-center gap-2 border-t p-2 mt-0.5 dark:border-green-800  bg-green-200 dark:bg-green-800 rounded'>
                    {replyView && <IconButton onClick={() => setReplyView(false)}><Close /></IconButton>}
                    <Avatar sx={{ bgcolor: '#16a34a', width: 35, height: 35, fontSize: '0.75rem' }}>
                        {user?.name?.charAt(0).toUpperCase()}
                    </Avatar>

                    {!replyView && <div
                        className="cursor-pointer text-green-600 dark:text-white font-medium"
                        onClick={() => setReplyView((prev) => !prev)}
                    >
                        <span>Reply</span>
                    </div>}

                    {replyView && (
                        replyField(textMessage, setTextMessage, handleSubmitReply)
                    )}

                </div>

                <div className='flex flex-col'>
                    <span className='text-[10px] self-end'>{formatDate(content?.created_at)}</span>

                </div>

            </div>

            {anchorEl &&
                <Suspense>
                    <Menu
                        id="basic-menu ml-10"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >

                        <MenuItem onClick={handleClose} />

                        <MenuItem onClick={handleEditClick}>

                            <ListItemIcon>
                                <EditIcon />
                            </ListItemIcon>

                            <ListItemText>Edit</ListItemText>

                        </MenuItem>

                        <MenuItem onClick={handleDeleteClick}>

                            <ListItemIcon>
                                <DeleteIcon fontSize="small" />
                            </ListItemIcon>

                            <ListItemText>Delete</ListItemText>

                        </MenuItem>

                    </Menu>
                </Suspense>
            }

        </div>
    )
});

function replyField(textMessage, setTextMessage, handleSubmitReply) {
    return <div className="mt-2 flex flex-row w-full gap-2">
        <TextField
            variant="outlined"
            fullWidth
            placeholder="Enter Reply..."
            value={textMessage}
            onChange={(e) => setTextMessage(e.target.value)} />
        <div
            className={`cursor-pointer flex items-center gap-1 px-4 py-2 bg-green-500 text-white dark: rounded-md ${!textMessage ? 'pointer-events-none opacity-50' : ''}`}
            onClick={handleSubmitReply}

        >
            <SendIcon sx={{ color: 'white' }} />

        </div>

    </div>;
}



