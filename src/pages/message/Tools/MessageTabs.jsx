import React, { useState, useRef, useEffect, useCallback, useMemo, lazy, Suspense } from 'react'

import { useParams, useNavigate } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import ReplyIcon from '@mui/icons-material/Reply';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AttachFileIcon from '@mui/icons-material/AttachFile';

import SearchIcon from '@mui/icons-material/Search';

import { UserMessageDetails } from '../../../component/message/UserMessageDetails';
import { ChatMessageDetails } from '../../../component/message/ChatMessageDetails';

import { useSelector, useDispatch } from "react-redux";

import { APIServices } from '../../../hooks/fetchAPI';

import { RiPushpin2Fill } from "react-icons/ri";

import { storeToggleMessage } from '../../../redux/GroupChat/ToggleMessageSlice';

import { convertToBase64, getNameById, renameFile, validateFileType, convertFileDataArray, getName, p2pFilter, p2pFilterIcon } from '../../../contants';

import echo from "../../../hooks/echo";
import { ArticleOutlined, AttachFile, Close, CloudUploadOutlined, Delete, DeleteOutline, FileCopy, CloseRounded, MoreHoriz } from '@mui/icons-material';
import { Alert, Chip, CircularProgress, IconButton, LinearProgress, Stack, Tooltip } from '@mui/material';
import imageCompression from 'browser-image-compression';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import EmojiList from '../../../component/Emoji/EmojiList';
import { PiSmileyMeh } from 'react-icons/pi';

const ForwardMessage = lazy(() => import('../popOutMenu/ForwardMessage'));
const PinnedMessage = lazy(() => import('../popOutMenu/PinnedMessage'));
const SearchMessageChat = lazy(() => import('../popOutMenu/SearchMessageChat'));

export const MessageTabs = ({ handleFetchingGroupChat, setToggleTeam }) => {

    const { id } = useParams();



    const dispatch = useDispatch();
    const navigate = useNavigate();

    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };

    const textFieldRef = useRef('');

    const user = useSelector((state) => state.user.userData)

    const { message, action } = useSelector((state) => state.message);
    const listMessageConvo = action?.messageData?.data;

    const [textMessage, setTextMessage] = useState(null);
    const [textReadOnly, setTextReadOnly] = useState(false);
    const [replyMessage, setReplyMessage] = useState(null);
    const [updateMessage, setUpdateMessage] = useState(null);
    const [listGroupData, setlistGroupData] = useState([]);

    const [togglePinned, setTogglePinned] = useState(false)
    const [toggleSearch, setToggleSearch] = useState(false)
    const [isLoadMsg, setLoadMsg] = useState(false)

    const [fileError, setFileError] = useState(false)
    const [errorMsg, setErrorMsg] = useState(false)

    const timeoutIds = useRef({});

    const [forwardedMessage, setForwardedMessage] = useState(null);

    const [groupDetails, setGroupDetails] = useState(null);

    const fileInputRef = useRef(null);
    const [isUploadBoxVisible, setIsUploadBoxVisible] = useState(false);

    const [fileLoading, setFileLoading] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [fileBase64, setFileBase64] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [files, setFiles] = useState([]);
    const [listFileRemove, setListFileRemove] = useState([]);

    const [messageLength, setMessageLength] = useState(15);
    const MAX_LENGTH = 36;

    const [showMentionList, setShowMentionList] = useState(false);
    const [mentionQuery, setMentionQuery] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [emoji, setEmoji] = useState("");
    const [showEmojiList, setShowEmojiList] = useState(false);
    const [disable, setDisable] = useState(false);


    const [chatName, setChatName] = useState("CHAT");

    const [uploadProgress, setUploadProgress] = useState({});

    const handleFileChange = async (e) => {
        setFileError(false);
        const selectedFiles = Array.from(e.target.files);

        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        const validFiles = selectedFiles.filter(file => allowedTypes.includes(file.type));

        if (validFiles.length !== selectedFiles.length) {
            setFileError(true);
            setErrorMsg('Only image files (JPEG, PNG) and PDFs are allowed!');
            return;
        }

        if (validFiles.length > 25) {
            setFileError(true);
            setErrorMsg('You can only upload up to 25 files.');
            return;
        }

        const compressedFiles = await Promise.all(
            validFiles.map(async (file) => {
                try {
                    if (file.type === 'application/pdf') return file;
                    return await imageCompression(file, {
                        maxSizeMB: 0.5,
                        maxWidthOrHeight: 1920,
                        useWebWorker: true,
                    });
                } catch (error) {
                    return file;
                }
            })
        );

        setFiles(prev => [...prev, ...compressedFiles]);

        compressedFiles.forEach(file => {
            const formData = new FormData();
            formData.append('file', file);


            let simulatedProgress = 0;
            const interval = 100;
            const totalDuration = 4000;
            const increment = (99 * interval) / totalDuration;

            const updateProgress = () => {
                if (simulatedProgress < 99) {
                    setDisable(true);
                    simulatedProgress += increment;
                    setUploadProgress(prev => ({
                        ...prev,
                        [file.name]: Math.round(simulatedProgress),
                    }));
                    timeoutIds.current[file.name] = setTimeout(updateProgress, interval);
                } else if (simulatedProgress >= 100) {
                    setDisable(false);
                    chatFieldRef.current.focus();
                    setUploadProgress(prev => ({
                        ...prev,
                        [file.name]: 0,
                    }));
                }
            };

            timeoutIds.current[file.name] = setTimeout(updateProgress, interval);
        });
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setFileError(false);

        const droppedFiles = Array.from(e.dataTransfer.files);

        // Validate file types
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        const validFiles = droppedFiles.filter(file => allowedTypes.includes(file.type));

        if (validFiles.length !== droppedFiles.length) {
            setFileError(true);
            setErrorMsg('Only image files (JPEG, PNG) and PDFs are allowed!');
            return;
        }

        if (validFiles.length + files.length > 25) {
            setFileError(true);
            setErrorMsg('You can only upload up to 25 files total.');
            return;
        }

        // Compress files
        const compressedFiles = await Promise.all(
            validFiles.map(async (file) => {
                try {
                    if (file.type === 'application/pdf') return file;
                    return await imageCompression(file, {
                        maxSizeMB: 0.5,
                        maxWidthOrHeight: 1920,
                        useWebWorker: true,
                    });
                } catch (error) {
                    return file;
                }
            })
        );

        setFiles(prev => [...prev, ...compressedFiles]);


        // Start uploads after compression
        compressedFiles.forEach(file => {
            const formData = new FormData();
            formData.append('file', file);


            let simulatedProgress = 0;
            const interval = 100;
            const totalDuration = 5000;
            const increment = (99 * interval) / totalDuration;

            const updateProgress = () => {
                if (simulatedProgress < 99) {
                    simulatedProgress += increment;
                    setUploadProgress(prev => ({
                        ...prev,
                        [file.name]: Math.round(simulatedProgress),
                    }));
                    timeoutIds.current[file.name] = setTimeout(updateProgress, interval);
                } else if (simulatedProgress >= 100) {
                    setUploadProgress(prev => ({
                        ...prev,
                        [file.name]: 0,
                    }));
                }
            };

            timeoutIds.current[file.name] = setTimeout(updateProgress, interval);
        });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleRemoveFile = (index, file) => {

        if (file?.id) setListFileRemove([...listFileRemove, file?.id])

        setFiles(files.filter((_, i) => i !== index));
    };


    useEffect(() => {

        const channel = echo.channel(`public-chat${id}`)
            .listen('MessageSent', handlePusherEvent)
            .error((error) => {
                console.error('Error on channel:', error);
            });

        return () => {
            channel.stopListening('MessageSent');
            echo.leaveChannel(`public-chat${id}`);
        };

    }, [id]);

    const handlePusherEvent = useCallback(async (pusherEvent) => {

        setlistGroupData((prevData) => [...prevData, pusherEvent?.message]);

        if (pusherEvent?.message) {

            let messageChecker = {
                "group_id": id,
                "assign_user": {
                    "id": user?.id,
                    "name": user?.name
                }
            }

            const responseUpdate = await APIServices.put({ url: `/update-seen-message`, payload: messageChecker });

            if (responseUpdate?.status === 200) {

                handleFetchingGroupChat();

            }

        }

    }, []);

    useEffect(() => {
        // Scroll to the bottom when the component mounts
        if (messagesContainerRef.current && !isLoadMsg) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [listGroupData]);

    useEffect(() => {
        // handleGroupDetails();

        setIsUploadBoxVisible(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setFileBase64(null);
        setFileName(null)


    }, [id,]);


    useEffect(() => {
        if (chatFieldRef.current) {
            chatFieldRef.current.value = '';
            chatFieldRef.current.focus();
        }

        const handleGroupChecker = async () => {
            try {
                let data = {
                    "id": id,
                };

                const response = await APIServices.get({ url: `/fetch-group-details`, payload: data });

                if (response?.status === 200) {

                    const isMember = response?.data?.data?.message_group_assign?.some(
                        member => Number(member.user_id) === user?.id
                    );

                    if (isMember) {
                        handleConversation();
                    }
                }

            } catch (error) {
                setGroupDetails(null)
            }

        };
        handleGroupChecker();
        // handleConversation();
    }, [id, messageLength]);

    useEffect(() => {
        handleEmojiSelect(emoji);
    }, [emoji]);

    // useEffect(() => {
    //     handleConversation();
    // }, [messageLength]);

    const handleGroupDetails = async () => {
        try {
            let data = {
                "id": id,
            };

            const response = await APIServices.get({ url: `/fetch-group-details`, payload: data });

            if (response?.status === 200) {
                setGroupDetails(response?.data?.data)
                setFilteredUsers(response?.data?.data?.message_group_assign)
            }

        } catch (error) {
            setGroupDetails(null)
        }

    };

    const handleConversation = async () => {

        // setlistGroupData([]);
        // setGroupDetails();

        try {

            let messageChecker = {
                "group_id": id,
                "assign_user": {
                    "id": user?.id,
                    "name": user?.name
                }
            }

            const responseUpdate = await APIServices.put({ url: `/update-seen-message`, payload: messageChecker });

            if (responseUpdate?.status === 200) {

                let data = {
                    "group_id": id,
                    "limit_text": messageLength,
                };

                const response = await APIServices.get({ url: `/fetch-message-text`, payload: data });

                if (response?.status === 200) {
                    setlistGroupData([]);
                    setlistGroupData(response?.data?.data)
                    handleGroupDetails();
                }

            }

        } catch (error) {
            setlistGroupData(null)
        }

        setTextMessage('');
        setReplyMessage('');

    };

    const handleConversationAfterEdit = async () => {

        try {

            let data = {
                "group_id": id,
            };

            const response = await APIServices.get({ url: `/fetch-message-text`, payload: data });
            setlistGroupData(response?.data?.data)
            handleFetchingGroupChat();

        } catch (error) {
            setlistGroupData(null)
        }

    };

    const handlePinMessasage = async (data) => {

        let submitData = {
            "id": data?.id,
            "pinned_message": parseInt(data?.pinned_message) === 1 ? 0 : 1
        }

        const response = await APIServices.put({ url: `/pinned-message-text`, payload: submitData });

        if (response?.status === 200) {
            handleConversation();
            handleGroupDetails();
            handleFetchingGroupChat();
        }

    };

    const handleForwardMessage = (data) => {
        setForwardedMessage(data)
    };

    const handleDeleteMessasage = async (data) => {
        let submitData = {
            "id": data?.id,
        }

        const response = await APIServices.deletes({ url: `/delete-message-text`, payload: submitData });

        if (response?.status === 200) {
            handleConversation();
            handleGroupDetails();
            handleFetchingGroupChat();
        }

    };


    const handleKeyDown = (event) => {
        const cursorPos = event.target.selectionStart;



        if (event.key === 'Tab') {
            event.preventDefault();
            setTextMessage(prev => prev + '      ');
        }

        if (event.altKey && event.key === '8') {
            event.preventDefault();
            setTextMessage(prev => prev + '•  ');
        }

        if (event.key === ' ' && event.target.selectionStart > 0 && textMessage.endsWith('*')) {
            event.preventDefault();
            setTextMessage(prev => prev.slice(0, -1) + ' • ');
        }

        if (event.shiftKey && event.key === 'Enter') {
            event.preventDefault();
            setTextMessage(prev => (prev ? prev + '\n' : '\n'));
            return;
        }

        if (event.key === 'Enter') {
            if (disable) {
                setErrorMsg("File is uploading ...")
            } else {
                handleTextSubmit();
                setTextMessage('');
            }
        }

        if (event.key === '@') {
            setShowMentionList(true);
            setMentionQuery('');
        }


        if (showMentionList && event.key.length === 1) {
            setMentionQuery((prev) => prev + event.key);

            const filtered = groupUsers?.filter((user) =>
                user.name.toLowerCase().includes((mentionQuery + event.key).toLowerCase())
            );

            setFilteredUsers(filtered);
        }

        if (showMentionList && event.key === "Backspace") {
            setMentionQuery((prev) => prev.slice(0, -1));

            if (mentionQuery.length <= 1) {
                setShowMentionList(false);
            }
        }
    };

    const handleSelectMention = (username) => {
        setTextMessage((prev) => prev + username + " ");
        setShowMentionList(false);
        setMentionQuery("");
    };


    const handleTextSubmit = async () => {


        try {
            // setTextReadOnly(true);

            if (updateMessage !== null) {

                // let editText = {
                //     "id": updateMessage?.id,
                //     "text_message": textMessage,
                // }

                const formDataEdit = new FormData();
                formDataEdit.append("id", parseInt(updateMessage?.id));
                formDataEdit.append("text_message", textMessage || 'null');

                listFileRemove.forEach((item, index) => {
                    formDataEdit.append(`file_remove[${index}]`, item);
                });


                files.forEach((file, index) => {
                    formDataEdit.append(`files[${index}]`, file);
                });

                const editResponse = await APIServices.post({ url: `/update-message-text`, payload: formDataEdit });
                setUpdateMessage(null);
                handleConversationAfterEdit();
                if (editResponse?.status === 200) {
                    setReplyMessage('');
                    setTextMessage('');
                    setTextReadOnly(false);
                    setFileBase64('');
                    setFileName('')
                    setIsUploadBoxVisible(false)
                    setListFileRemove([]);
                }

            } else {

                if (!textMessage && (!files || files.length === 0)) {
                    console.log("Both message and files are empty, aborting submission");
                    return;
                }
                const formData = new FormData();
                formData.append("user_id", user?.id);
                formData.append("group_id", parseInt(groupDetails?.id));
                formData.append("text_message", textMessage || 'null');
                formData.append("reply_id", replyMessage ? replyMessage?.id : '');
                formData.append("file_upload", fileName ? fileName : '');

                files.forEach((file, index) => {
                    formData.append(`files[${index}]`, file);
                });

                const response = await APIServices.post({
                    url: "/create-message-text",
                    payload: formData,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                if (response?.status === 201) {
                    setReplyMessage('');
                    setTextMessage('');
                    setTextReadOnly(false);
                    setFileBase64('');
                    setFileName('')
                    setIsUploadBoxVisible(false)
                    setFiles([]);
                }

            }

        } catch (error) {
            console.error('Error sending message:', error);
        }


    };

    const truncateText = (text) => {
        if (!text) return "";
        if (text.length <= MAX_LENGTH) {
            return text;
        }
        return text.substring(0, MAX_LENGTH) + " ...";
    };

    const handleButtonClick = () => {
        setIsUploadBoxVisible((prev) => {
            if (!prev) setTimeout(() => fileInputRef.current?.click(), 0);
            return !prev;
        });
    };


    const handleFetchEditText = (data) => {


        const result = convertFileDataArray(data?.group_file)
        setFiles(result)

        setIsUploadBoxVisible(true);
        setUpdateMessage(data);
        setTextMessage(data?.text_message === 'null' ? '' : data?.text_message);

    }

    const handleSearchModal = () => {
        setToggleSearch(true)
    }

    const groupUsers = groupDetails?.message_group_assign?.map((member) => ({
        id: member?.user?.id,
        name: `${member?.user?.fname} ${member?.user?.lname}`,
    })) || [];

    const handleEmojiSelect = (emoji) => {
        if (textMessage === null) {
            setTextMessage(emoji)
        } else {
            setTextMessage((prev) => prev + emoji);
        }
        setEmoji('')
        document.querySelector('input').focus();
    };

    const handlePaste = (event) => {
        event.preventDefault();

        const clipboardItems = event.clipboardData.items;
        const newFiles = [];

        for (let i = 0; i < clipboardItems.length; i++) {
            const item = clipboardItems[i];

            // handletext
            if (item.type === 'text/plain') {

                item.getAsString((text) => {
                    if (textMessage === null) {
                        setTextMessage(text)
                        return
                    }
                    setTextMessage((prev) => prev + text);
                });
            }
            // handleimages
            else if (item.type.startsWith('image/')) {
                setIsUploadBoxVisible(true)
                const file = item.getAsFile();
                if (file) {
                    const fileName = `pasted-image-${Date.now()}.${file.type.split('/')[1]}`;
                    const renamedFile = new File([file], fileName, { type: file.type });
                    newFiles.push(renamedFile);
                }
            }
        }

        if (newFiles.length > 0) {
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        }
    };


    const handleReact = async (idContent, isLiked, setLike, content, setReactFetch) => {

        let data = {
            "id": idContent,
            "is_react": 1,
            "group_id": id,
            "assign_user": {
                "id": user?.id,
                "name": user?.name
            }
        }

        const response = await APIServices.put({ url: `/react-message`, payload: data });

        if (response?.status === 200) {
            setLike(!isLiked);

            // let reactData = content?.is_react_data ? JSON.parse(content.is_react_data) : [];
            // JSON.parse(response?.data?.data?.is_react_data)

            setReactFetch(JSON.parse(response?.data?.data?.is_react_data));
        }

    }

    const handleNameIcon = () => {

        if (!groupDetails) return "Chat".charAt(0);

        if (groupDetails?.is_gc) return groupDetails?.group_name?.charAt(0)
        else return p2pFilterIcon(groupDetails, user)

    }

    const handleName = () => {

        if (!groupDetails) return "Chat";

        if (groupDetails?.is_gc) return groupDetails?.group_name
        else return p2pFilter(groupDetails, user)

    }

    const chatFieldRef = useRef(null);

    let assIdMatch = '';

    if (groupDetails?.group_name === "P2P") {
        assIdMatch = groupDetails?.message_group_assign?.find(member =>
            `${member?.user?.fname} ${member?.user?.lname}` !==
            user?.name
        )?.user?.ass_id;
    }


    return (
        <div className='flex flex-col justify-between w-full h-full'>

            {
                forwardedMessage && (
                    <Suspense>
                        <ForwardMessage forwardedMessage={forwardedMessage} setForwardedMessage={setForwardedMessage} handleFetchingGroupChats={handleFetchingGroupChat} />
                    </Suspense>
                )
            }

            {toggleSearch &&
                (<Suspense >
                    <SearchMessageChat className="w-full"
                        toggle={toggleSearch}
                        setToggle={setToggleSearch}
                        groupData={groupDetails}
                    />
                </Suspense>)
            }


            {togglePinned &&
                (<Suspense >
                    <PinnedMessage className="w-full"
                        toggle={togglePinned}
                        setToggle={setTogglePinned}
                        pinnedData={groupDetails?.message_group_pinned}
                        handlePinMessasage={handlePinMessasage}
                    />
                </Suspense>)
            }

            <div className='flex flex-row items-center justify-between w-full max-h-[100px] border-b-[1.5px] border-gray-200  dark:border-gray-500 p-4'>

                <div className='flex flex-row items-center gap-4'>
                    <span onClick={() => [dispatch(storeToggleMessage(false)), navigate('/message')]} className='cursor-pointer'><ArrowBackIcon /></span>
                    {<Avatar sx={{ bgcolor: '#16a34a' }} src={assIdMatch ? `https://611systems.com/assets_clients/611/users/${assIdMatch}/latest_pic.jpg` : ''}>{handleNameIcon()}</Avatar>}
                    <h1 className='font-black text-md'>{handleName()}</h1>
                </div >

                <div className='flex flex-row gap-2'>
                    <div className='flex flex-row items-center cursor-pointer text-green-700' onClick={handleSearchModal}>
                        <SearchIcon />
                    </div>
                    {groupDetails?.is_gc ?
                        <div className='cursor-pointer' title='View Details' onClick={() => { setToggleTeam(true) }}>
                            <MoreHoriz />
                        </div>
                        : null}
                </div>


            </div >
            {groupDetails?.message_group_pinned?.length > 0 &&
                <div className='flex flex-row items-center justify-between w-full bg-blue-50 dark:bg-gray-600  border-b-[1.5px] border-gray-200 dark:border-gray-500  px-4 py-2'>

                    <div className='flex flex-row items-center gap-4'>
                        <span className='text-xl font-light text-green-500'><RiPushpin2Fill /></span>

                        <div className='flex flex-col'>
                            <h1 className='text-xs font-light text-black  dark:text-white'>{(groupDetails?.message_group_pinned?.[0]?.user?.fname)} {(groupDetails?.message_group_pinned?.[0]?.user?.lname)}</h1>
                            <p className='text-sm font-bold text-black dark:text-white'>{truncateText(groupDetails?.message_group_pinned?.[0]?.text_message)}</p>
                        </div>
                    </div>

                    <div className='cursor-pointer' onClick={() => setTogglePinned(true)}>
                        <ExpandMoreIcon />
                    </div>

                </div>
            }

            <div className='flex flex-col w-full h-full p-4 overflow-auto gap-5 relative' ref={messagesContainerRef}>

                {listGroupData?.length > 14 ?
                    <div className='flex flex-row w-full gap-3 items-center justify-center'>

                        <div onClick={() => [setMessageLength(parseInt(messageLength) + 10), setLoadMsg(true)]} className='px-2 text-green-500 rounded cursor-pointer'>
                            <h1 className='font-normal text-sm underline'>Load Message</h1>
                        </div>

                    </div> : null
                }

                {listGroupData?.map((chatdetails, index) => (
                    <React.Fragment key={index}>

                        {user?.id === parseInt(chatdetails?.user_id) ?
                            <UserMessageDetails
                                content={chatdetails}
                                handlePinMessage={handlePinMessasage}
                                handleDeleteMessasage={handleDeleteMessasage}
                                handleForwardMessage={handleForwardMessage}
                                handleFetchEditText={handleFetchEditText}
                                reply={setReplyMessage}
                                checkIfLatestData={listGroupData?.at(-1)}
                                handleReact={handleReact}
                            /> :
                            <ChatMessageDetails
                                content={chatdetails}
                                reply={setReplyMessage}
                                handleDeleteMessasage={handleDeleteMessasage}
                                handlePinMessage={handlePinMessasage}
                                handleForwardMessage={handleForwardMessage}
                                checkIfLatestData={listGroupData?.at(-1)}
                                handleReact={handleReact}
                            />
                        }

                    </React.Fragment>

                ))}
                <div ref={messagesEndRef} />
            </div>

            {
                replyMessage &&

                <div className='flex flex-row items-center justify-between w-full  border-t-[1.5px] border-gray-200 px-4 py-2'>

                    <div className='flex flex-row items-center gap-4'>
                        <span className='text-xl font-light text-green-500'><ReplyIcon /></span>

                        <div className='flex flex-col'>

                            <h1 className='text-sm font-bold text-black'>Replying to {(replyMessage?.user?.fname)}</h1>
                            <p className='text-xs font-light text-black'>Message : {replyMessage?.text_message !== 'null' ? replyMessage?.text_message : 'file attached'} </p>
                        </div>
                    </div>

                    <div className='cursor-pointer' onClick={() => setReplyMessage(null)}>
                        <CloseIcon />
                    </div>

                </div>
            }


            {
                fileName &&
                <>
                    <div className='flex flex-row  justify-between w-full px-4 py-2 items-center '>
                        <Chip className=' w-full' icon={<InsertDriveFileIcon />} label={fileName} color="success" variant="outlined" />
                        <div className='cursor-pointer gap-4 px-1'
                            onClick={() => {
                                fileInputRef.current.value = '';
                                setFileBase64(null);
                                setFileName(null)
                            }}
                        >
                            <CloseIcon />
                        </div>
                    </div>
                </>
            }

            {
                errorMessage &&
                <div className='flex flex-row  justify-between w-full px-4 py-2 items-center '>
                    <Chip className=' w-full' icon={<InsertDriveFileIcon />} label={"Invalid File Format Only Image and Pdf File"} color="error" variant="outlined" />
                    <div className='cursor-pointer gap-4 px-1'
                        onClick={() => {
                            fileInputRef.current.value = '';
                            // setFileBase64(null);
                            // setFileName(null);
                            setErrorMessage(null)
                        }}
                    >
                        <CloseIcon />
                    </div>
                </div>
            }


            {
                fileLoading &&
                <div className='w-full flex flex-col'>
                    <span className='text-green-500 text-sm'>File Upload Loading..</span>
                    <LinearProgress color="success" />
                </div>
            }

            {
                commentLoading &&
                <div className='w-full flex flex-col text-black'>
                    <LinearProgress color="success" />
                    <span>load done</span>
                </div>
            }

            {/* <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} /> */}


            {
                fileError && <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert severity="warning" onClose={() => { setFileError(false) }}>{errorMsg}</Alert>
                </Stack>
            }

            {
                isUploadBoxVisible && (
                    <div className='flex flex-row  justify-between w-full px-4 py-2 items-center '>
                        <div
                            className="border-2 border-dashed border-gray-400 p-2 rounded-lg text-center cursor-pointer gap-2 mx-2 my-2 w-full"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current.click()}
                            onPaste={(e) => handlePaste(e)}
                        >
                            {files.length === 0 && (
                                <>
                                    <AttachFile sx={{ color: '#16a34a' }} className="mx-auto mb-2" />
                                    <p className="text-gray-600">Drag & drop files here or click to upload</p>
                                </>
                            )}


                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                className="hidden"
                                accept="image/*,application/pdf"
                                onChange={handleFileChange}
                            />


                            {files.length > 0 && (
                                <div className="grid grid-cols-5 gap-4 mt-1">
                                    {files.map((file, index) => (
                                        <div key={index} className="flex flex-col gap-2 bg-gray-100 px-3 py-2 rounded-md w-full">
                                            <div className="flex flex-row items-center gap-4">

                                                <ArticleOutlined />

                                                <span className="truncate w-32">{file.name}</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveFile(index, file);
                                                    }}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Close fontSize="small" />
                                                </button>


                                            </div>
                                            {parseInt(uploadProgress[file.name]) <= 98 ? (

                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-green-600 h-2 rounded-full"
                                                        style={{ width: `${uploadProgress[file.name]}%` }}
                                                    />
                                                </div>
                                            ) :
                                                null
                                            }
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className='cursor-pointer gap-4 px-1'
                            onClick={() => {
                                setIsUploadBoxVisible(false);
                                setFiles([]);
                                fileInputRef.current.value = '';
                            }}
                        >
                            <CloseRounded />
                        </div>
                    </div>

                )
            }

            {/*Show user lists */}


            <div className='flex flex-col border-t-[1.5px] relative '>

                {showMentionList && (
                    <div className="absolute bg-white border border-gray-300 rounded shadow-lg mt-1  w-fit max-h-40 overflow-auto w-48" style={{
                        left: '0',
                        bottom: 'calc(100% + 4px)',
                    }}>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user, index) => (
                                <div
                                    key={index}
                                    className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                                    onClick={() => handleSelectMention(`${user?.user?.fname} ${user?.user?.lname}`)}
                                >
                                    @{user?.user?.fname}{' '}{user?.user?.lname}
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-2 text-gray-500">No users found</div>
                        )}
                    </div>
                )}



                <div className='flex flex-row items-center justify-between w-full max-h-[300px] gap-4  border-gray-200 p-4' onPaste={(e) => handlePaste(e)}
                >

                    <Tooltip title="Upload File">
                        <IconButton color="success" size="small" onClick={handleButtonClick}>
                            <CloudUploadOutlined />
                        </IconButton >
                    </Tooltip>


                    <TextField
                        className="border  dark:border-white text-black dark:text-white bg-white dark:bg-gray-800"
                        id="message-text-field"
                        inputRef={chatFieldRef}
                        value={textMessage}
                        fullWidth
                        onChange={(e) => setTextMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter Message ...."
                        multiline
                        minRows={1}
                        maxRows={3}
                        InputProps={{
                            readOnly: textReadOnly,
                            className: "border dark:border-white text-black dark:text-white bg-white dark:bg-gray-800"

                        }}
                    />

                    <div className={`cursor-pointer `} onClick={() => setShowEmojiList((prev) => !prev)}
                    >
                        <PiSmileyMeh sx={{ color: !emoji ? 'gray' : '#16a34a', }} />
                    </div>

                    {/* <div className={`cursor-pointer ${!textMessage ? 'pointer-events-none opacity-50' : ''}`} onClick={textMessage ? handleTextSubmit : null}>
                        <SendIcon sx={{ color: !textMessage ? 'gray' : '#16a34a' }} />
                    </div> */}

                    <div className={`cursor-pointer & ${disable ? 'pointer-events-none opacity-50 dark:opacity-10' : ''}`} onClick={handleTextSubmit} >
                        <SendIcon sx={{ color: '#16a34a' }} />
                    </div>

                </div>
                {showEmojiList &&
                    <div>
                        <EmojiList setEmoji={setEmoji} />
                    </div>
                }
            </div>


        </div >
    )
};

