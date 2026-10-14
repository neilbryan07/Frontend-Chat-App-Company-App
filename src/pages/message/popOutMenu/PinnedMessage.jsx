import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';

import Select from 'react-select'

import Avatar from '@mui/material/Avatar';
import Backdrop from '@mui/material/Backdrop';
import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';

import { testUser, customStyles, formatDate, getNameById, formatDisplayDate } from '../../../contants';
import { APIServices } from '../../../hooks/fetchAPI';

import { PiFilePdf } from 'react-icons/pi';
import { RiUnpinFill } from "react-icons/ri";

import CloseIcon from '@mui/icons-material/Close';

const ViewModelImage = lazy(() => import('../../../component/FileUpload/ViewModelImage'));


const PinnedMessage = React.memo(({ toggle, setToggle, pinnedData, handlePinMessasage }) => {

    const user = useSelector((state) => state.user.userData)

    const [userList, setUserList] = useState([]);

    const [gcName, setGcName] = useState(null);
    const [gcAssign, setGcAssign] = useState(null);

    const [modalImage, setModalImage] = useState(null);


    useEffect(() => {
        const transformedUsers = testUser?.map(user => ({
            value: user.id,
            label: user.name,
        }));
        setUserList(transformedUsers);
    }, []);

    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={toggle}
        // onClick={ () => setToggle(false) }
        >


            {modalImage &&
                <Suspense>
                    <ViewModelImage
                        modalImage={modalImage}
                        setModalImage={setModalImage}
                    />
                </Suspense>
            }


            <div className='flex flex-col items-center justify-center w-full h-screen mx-2 px-4 md:px-1'>

                <div className='flex flex-col w-full lg:w-1/3  gap-4 p-4 bg-white dark:bg-gray-800 rounded max-h-[550px] '>

                    <div className='flex flex-row items-center justify-between w-full'>

                        <h1 className='font-semibold text-black dark:text-white'>Pinned Messages</h1>

                        <div className='text-black cursor-pointer dark:text-white' onClick={() => setToggle(false)}>
                            <CloseIcon />
                        </div>

                    </div>

                    <div className='flex flex-col gap-4 overflow-auto h-full px-4'>

                        {pinnedData?.map((pinned, key) => (
                            <div className='w-full flex flex-col gap-2 border-b-[1px] pb-3 '>
                                <div className='flex flex-row justify-between w-full gap-2'>

                                    <div className='flex flex-row items-center justify-start gap-2'>
                                        <Avatar sx={{ bgcolor: '#16a34a', width: 35, height: 35, fontSize: '0.75rem' }} src={pinned?.user?.ass_id && `https://611systems.com/assets_clients/611/users/${pinned?.user?.ass_id}/latest_pic.jpg`} >{!pinned?.user?.ass_id && pinned?.user?.fname?.charAt(0).toUpperCase()}</Avatar>

                                        <div className='flex flex-col'>

                                            <div className='py-1'>
                                                <h1 className='text-xs text-black dark:text-white'>{pinned?.user?.fname} {pinned?.user?.lname}</h1>
                                            </div>

                                            {pinned?.text_message !== 'null' && <div className='p-2 bg-gray-200 rounded cursor-pointer py w-fit '>
                                                <h1 className='text-md text-black self-end whitespace-pre-wrap break-words'>{pinned?.text_message}</h1>
                                            </div>}


                                        </div>

                                    </div>

                                    <div className='flex flex-col gap-2'>
                                        <span className='text-[10px] w-fit text-black dark:text-white'>{formatDisplayDate(pinned?.created_at)}</span>

                                        <div onClick={() => handlePinMessasage(pinned)} className='border border-red-500 text-red-500 flex flex-row gap-2 items-center justify-center rounded cursor-pointer py-2 px-3 hover:bg-red-500 hover:text-white'>
                                            <span className='text-md w-fit'><RiUnpinFill /></span>

                                        </div>

                                    </div>

                                </div>
                                <div className='ml-10 '>
                                    {pinned?.group_file?.length > 0 && (
                                        <div className="grid mt-2 py-2 rounded">
                                            <div className="flex gap-2 flex-wrap">
                                                {pinned?.group_file?.map((file, index) => {

                                                    if (file?.file_type?.startsWith('image/')) {
                                                        return (
                                                            <img
                                                                key={index}
                                                                src={file.file_path}
                                                                alt={file.file_name}
                                                                className="w-30 h-20 object-cover rounded-lg cursor-pointer shadow-md"
                                                                onClick={() => setModalImage(file)}
                                                            />
                                                        )
                                                    }

                                                    if (file?.file_type?.startsWith('application/pdf')) {
                                                        return (
                                                            <a
                                                                href={file.file_path}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex flex-row items-center gap-2 font-medium text-gray-900 truncate max-w-[200px] border border-red-500 p-2 rounded"
                                                                title={file.file_name}
                                                            >
                                                                <span className='text-xl text-red-500'><PiFilePdf /></span>
                                                                <div>
                                                                    {file.file_name.length > 25 ? file.file_name.substring(0, 15) + "..." : file.file_name}
                                                                </div>

                                                            </a>
                                                        )
                                                    }

                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </div>
                        ))}


                    </div>

                </div>

            </div>

        </Backdrop>
    )
});

export default PinnedMessage;
