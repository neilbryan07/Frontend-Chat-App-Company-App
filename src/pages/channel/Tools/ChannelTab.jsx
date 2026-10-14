import React, { useState, useRef, useEffect, useCallback, useMemo, lazy, } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Avatar, IconButton, TextField, Tooltip } from '@mui/material';
import { APIServices } from '../../../hooks/fetchAPI';
import { storeToggleMessage } from '../../../redux/GroupChat/ToggleMessageSlice';
import { ArticleOutlined, AttachFile, Close, CloseRounded, CloudUploadOutlined, PostAdd } from '@mui/icons-material';
import SendIcon from '@mui/icons-material/Send';
import { UserChannel } from '../../../component/channelmsg/UserChannel';
import echo from '../../../hooks/echo';
import { GoSmiley } from 'react-icons/go';
import EmojiList from '../../../component/Emoji/EmojiList';

export const ChannelTabs = ({ handleFetchingGroupChat, teamData }) => {

    const { id, channel_id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const messagesContainerRef = useRef(null);
    const fileInputRef = useRef(null);
    const textFieldRef = useRef(null);

    const [listGroupData, setListGroupData] = useState([]);

    const [files, setFiles] = useState([]);
    const [textSubject, setTextSubject] = useState('');
    const [textMessage, setTextMessage] = useState('');

    const [replyMessage, setReplyMessage] = useState(null);
    const [groupDetails, setGroupDetails] = useState(null);
    const [isUploadBoxVisible, setIsUploadBoxVisible] = useState(false);
    const [listEmpty, setListEmpty] = useState();
    const [isLoading, setIsLoading] = useState();

    const channels = teamData?.[0]?.channels || [];
    const channel = channels.find(c => c.channel_id === Number(channel_id));

    const [page, setPage] = useState(5);
    const [showLoadButton, setShowLoadButton] = useState(false);
    const [showPost, setShowPost] = useState(false);


    const [disableAutoScroll, setDisableAutoScroll] = useState(false);
    const [editView, setEditView] = useState(false);

    const [textBox, setTextBox] = useState(null);
    const [showEmojiList, setShowEmojiList] = useState(false);
    const [emoji, setEmoji] = useState("");



    console.log(textBox, '---')

    // useEffect(() => {
    //     const handleScroll = () => {
    //         if (messagesContainerRef.current) {
    //             if (messagesContainerRef.current.scrollTop === 0) {
    //                 setShowLoadButton(true);
    //             }
    //         }
    //     };

    //     const container = messagesContainerRef.current;
    //     if (container) {
    //         container.addEventListener("scroll", handleScroll);
    //     }

    //     return () => {
    //         if (container) {
    //             container.removeEventListener("scroll", handleScroll);
    //         }
    //     };
    // }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (messagesContainerRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
                if (scrollTop === 0 && listGroupData.length >= 4) {
                    setShowLoadButton(true);
                } else {
                    setShowLoadButton(false); // Hide button if condition not met
                }
            }
        };

        const container = messagesContainerRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
        };
    }, [listGroupData]);

    const scrollToTop = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    };


    const loadMoreMessages = () => {
        console.log('more', page)
        setPage((prevPage) => {
            const newPage = prevPage + 2;
            console.log('more', newPage);

            // Call handleConversation with the updated page
            handleConversation();

            return newPage;
        });

        setShowLoadButton(false);
        scrollToTop();

    };


    const checkIfListEmpty = () => {
        setListEmpty(listGroupData?.length <= 0);
    };


    useEffect(() => {
        checkIfListEmpty();
    }, [listGroupData, channel_id]);


    const user = useSelector((state) => state.user.userData);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles([...files, ...selectedFiles]);
    };


    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles([...files, ...droppedFiles]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleRemoveFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };


    useEffect(() => {
        const handleKeyPress = (event) => {
            if (document.activeElement !== textFieldRef.current) {
                textFieldRef.current?.focus();
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, []);

    useEffect(() => {
        setIsLoading(true);
        setPage(5)
        handleConversation();
        setIsUploadBoxVisible(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setDisableAutoScroll(false); // Re-enable auto-scroll when switching channels

    }, [id, channel_id]);



    const scrollToBottom = () => {
        if (messagesContainerRef.current && !disableAutoScroll) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };

    const handleDeleteMessasage = async (data) => {
        let submitData = {
            "message_id": parseInt(data?.id),
        }

        const response = await APIServices.post({ url: `/delete-message`, payload: submitData });

        if (response?.status === 200) {
            handleConversationAfterEdit();
        }

    };

    const handleDeleteReply = async (data) => {
        let submitData = {
            "reply_id": parseInt(data?.id),
        }

        const response = await APIServices.post({ url: `/delete-reply`, payload: submitData });

        if (response?.status === 200) {
            handleConversationAfterEdit();
        }

    };


    const handleConversation = useCallback(async () => {
        setIsLoading(false);

        try {
            const response = await APIServices.post({
                url: `/get-messages`,
                payload: { "channel_id": channel_id, "scroll": page }
            });

            if (response?.status === 200) {
                setListGroupData(() => [
                    ...response?.data?.messages,
                ]);
                setGroupDetails(response?.data?.channel);
                console.log("New Messages Loaded:", response?.data);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    }, [channel_id, id, page, setPage, loadMoreMessages]);



    const handleConversationAfterEdit = async () => {
        setEditView(true)

        try {

            const response = await APIServices.post({ url: `/get-messages`, payload: { "channel_id": channel_id, "scroll": page } });
            setListGroupData(() => [
                ...response?.data?.messages,
            ]);
            setGroupDetails(response?.data?.channel);

        } catch (error) {
            setListGroupData(null)
            handleConversation();

        } finally {
            setEditView(false)
        }

    };


    const handleButtonClick = () => {
        setIsUploadBoxVisible((prev) => {
            if (!prev) setTimeout(() => fileInputRef.current?.click(), 0);
            return !prev;
        });
    };

    const handleView = () => {
        setShowPost(true)
    };

    const handleEditSubmit = async (data) => {
        setEditView(true)
        try {

            const response = await APIServices.post({
                url: "/update-message",
                payload: data,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });


            if (response?.status === 200) {
                handleConversationAfterEdit()

            }

        } catch (error) {
            console.log(error)
        } finally {
            setEditView(false)
        }

    };


    const handleReplySubmit = async (data) => {

        try {
            const response = await APIServices.post({
                url: "/update-reply",
                payload: data,
            });


            if (response?.status === 200) {
                handleConversationAfterEdit()
            }

            return true
        } catch (error) {

        }

    };

    const handleTextSubmit = useCallback(async () => {
        if (!textMessage.trim()) return;

        try {

            const formData = new FormData();
            formData.append("channel_id", parseInt(channel_id));
            formData.append("user_id", user?.id);
            formData.append("subject", textSubject);
            formData.append("message", textMessage);

            files.forEach((file, index) => {
                formData.append(`files[${index}]`, file); // Ensure file uploads
            });


            const response = await APIServices.post({
                url: "/send-message",
                payload: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response?.status === 201) {
                setReplyMessage(null);
                setTextMessage('');
                setTextSubject('')
                setFiles([]);
                setIsUploadBoxVisible(false)
                if (listEmpty) {
                    handleConversation();
                }
                setListEmpty(false)
                setShowPost(false)

            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }, [APIServices.post, textFieldRef, textMessage, user, files, handleConversation, setReplyMessage]);

    useEffect(() => {

        const channel = echo.channel(`channel-chat`)
            .listen('ChannelMessageSent', handlePusherEvent)
            .error((error) => {
                console.error('Error on channel:', error);  // Log any errors
            });

        return () => {
            channel.stopListening('MessageSent');  // Cleanup the event listener
            echo.leaveChannel(`channel-chat`);  // Clean up the channel
        };
    }, []);

    const handlePusherEvent = useCallback(async (pusherEvent) => {
        setListGroupData((prevData) => [...prevData, pusherEvent]);
        if (pusherEvent?.message) {
            handleFetchingGroupChat();
        }
        setListEmpty(false);
        setIsLoading(false)

    }, []);

    const handleKeyDown = (event) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            setTextMessage((prev) => prev + '      ');
        }

        if (event.altKey && event.key === '8') {
            event.preventDefault();
            setTextMessage((prev) => prev + '•  ');
        }

        if (event.key === ' ' && event.target.selectionStart > 0 && textMessage.endsWith('*')) {
            event.preventDefault();
            setTextMessage((prev) => prev.slice(0, -1) + ' • ');
        }

        if (event.shiftKey && event.key === 'Enter') {
            event.preventDefault();
            setTextMessage((prev) => (prev ? prev + '\n' : '\n'));
            return;
        }

        if (textSubject?.trim() && event.key === 'Enter' && textMessage?.trim()) {
            event.preventDefault();
            handleTextSubmit();
            setTextMessage('');
            setTextSubject('')
        }
    };

    console.log("team", groupDetails)

    const handleValidatedFileChange = (newFiles) => {
        const totalFiles = files.length + newFiles.length;

        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'application/pdf',
        ];

        const validFiles = files.filter((file) =>
            allowedTypes.includes(file.type)
        );

        if (validFiles.length !== files.length) {
            alert('Only image files (JPEG, PNG, GIF) and PDFs are allowed!');
            return;
        }

        if (totalFiles > 25) {
            alert("You can only upload up to 25 files.");
            return;
        }
        setFiles([...files, ...newFiles]);
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
                    if (textMessage || textSubject === null) {
                        textBox === 1 ? setTextSubject(text) : setTextMessage(text)
                        return
                    }
                    textBox === 1 ? setTextSubject((prev) => prev + text) : setTextMessage((prev) => prev + text);
                });
            }

            //handleimages
            if (item.type.startsWith('image/')) {
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

    useEffect(() => {
        handleEmojiSelect(emoji);
    }, [emoji]);

    const handleEmojiSelect = (emoji) => {
        if (textMessage === null) {
            setTextMessage(emoji)
        }
        setTextMessage((prev) => prev + emoji);
        setEmoji('')
        document.querySelector('input').focus();
    };

    return (
        <div className='flex flex-col justify-between w-full h-full'>
            <div className='flex flex-row items-center justify-between w-full max-h-[100px] border-b-[1.5px] border-gray-200 p-4'>
                <div className='flex flex-row items-center gap-4'>
                    <span onClick={() => [dispatch(storeToggleMessage(false)), navigate('/channel')]} className='cursor-pointer'>
                        <ArrowBackIcon />
                    </span>
                    <Avatar sx={{ bgcolor: '#16a34a' }}>{groupDetails?.name?.charAt(0)}</Avatar>
                    <h1 className='font-black text-md'>{groupDetails?.name}</h1>
                </div>
            </div>

            <div className='flex flex-col w-full h-full p-4 overflow-auto gap-7' ref={messagesContainerRef}>

                {isLoading ? (
                    <div className="flex flex-col w-full h-full p-4 overflow-auto gap-7">
                        <p className="text-center text-gray-500">Loading...</p>
                    </div>
                ) : listEmpty ? (
                    <div className="flex flex-col w-full h-full p-4 overflow-auto gap-7">
                        <p className="text-center text-gray-500">No messages</p>
                    </div>
                ) : <>
                    {showLoadButton && (
                        <button
                            className="mx-auto bg-blue-500 text-white px-4 py-2 rounded-md"
                            onClick={loadMoreMessages}
                        >
                            Load Messages
                        </button>
                    )}

                    {listGroupData?.map((chatdetails, index) => (


                        <UserChannel
                            key={index}
                            channelDetails={groupDetails}
                            content={chatdetails}
                            handleDeleteMessasage={handleDeleteMessasage}
                            handleDeleteReply={handleDeleteReply}
                            setListGroupData={setListGroupData}
                            handleEditSubmit={handleEditSubmit}
                            setView={setEditView}
                            view={editView}
                            handleReplySubmit={handleReplySubmit}
                        />



                    ))}

                </>}

            </div>

            {
                isUploadBoxVisible && (
                    <div className='flex flex-row  justify-between w-full px-4 py-2 items-center gap-2'>
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
                                onChange={(e) => {
                                    const selectedFiles = Array.from(e.target.files);
                                    handleValidatedFileChange(selectedFiles);
                                    e.target.value = null;
                                }}
                            />

                            {files.length > 0 && (
                                <div className="grid grid-cols-5 gap-4 mt-1">
                                    {files.map((file, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-start gap-4 items-center bg-gray-100 px-3 py-2 rounded-md w-fit"
                                        >
                                            <ArticleOutlined />
                                            <span className="truncate w-32">{file.name}</span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveFile(index);
                                                }}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Close fontSize="small" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className='cursor-pointer gap-4 px-1'
                            onClick={() => {
                                setIsUploadBoxVisible(false);
                                setFiles([]);
                            }}
                        >
                            <CloseRounded />
                        </div>
                    </div>
                )
            }


            {!showPost && <div className='flex w-fit self-center'>
                <div className='cursor-pointer bg-green-500  text-white p-3 text-md mx-5 my-5' onClick={handleView}>
                    <PostAdd />  Start a post
                </div>
            </div>}

            {showPost && <div className='flex flex-col border-t-[1.5px]'  >
                <div className='flex flex-row items-center justify-between w-full max-h-[300px] gap-4 border-gray-200 px-4 py-2' >

                    <div className='flex flex-col w-full gap-1' onPaste={(e) => handlePaste(e)}
                    >
                        <>
                            <div className='self-end'>
                                <IconButton color="success" size="medium" onClick={() => setShowPost(false)}>
                                    <Close />
                                </IconButton>
                            </div>

                            <TextField
                                //inputRef={textFieldRef}
                                onClick={() => setTextBox(1)}
                                value={textSubject}
                                variant="outlined"
                                fullWidth
                                onChange={(e) => setTextSubject(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Enter Subject ...."
                                multiline
                                minRows={1}
                                maxRows={3}
                                InputProps={{
                                    className: "border dark:border-white text-black dark:text-white bg-white dark:bg-gray-800"
                                }}
                            />

                            <TextField
                                //inputRef={textFieldRef}
                                value={textMessage}
                                onClick={() => setTextBox(2)}
                                variant="outlined"
                                fullWidth
                                onChange={(e) => setTextMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Enter Message ...."
                                multiline
                                minRows={1}
                                maxRows={3}
                                InputProps={{
                                    className: "border dark:border-white text-black dark:text-white bg-white dark:bg-gray-800"
                                }}
                            />

                            <div className='flex flex-row justify-between'>
                                <div className='flex flex-row'>
                                    <IconButton title='Upload File' color="success" size="medium" onClick={handleButtonClick}>
                                        <CloudUploadOutlined />
                                    </IconButton>
                                    <IconButton title='Upload File' color="success" size="medium" onClick={() => setShowEmojiList(!showEmojiList)}>
                                        <GoSmiley />
                                    </IconButton>
                                </div>

                                <div className={`cursor-pointer ${!textMessage || !textSubject ? 'pointer-events-none opacity-50 ' : ' text-white bg-green-500'} text-lg p-2 my-2`} onClick={(textMessage && textSubject) ? handleTextSubmit : null}>
                                    Post  <SendIcon sx={{ color: !textMessage || !textSubject ? 'gray' : 'white' }} />
                                </div>
                            </div>
                        </>
                    </div>


                </div>
                {showEmojiList &&
                    <div>
                        <EmojiList setEmoji={setEmoji} />
                    </div>
                }
            </div>}
        </div >
    );
};


