import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense, useRef } from 'react';

import Select from 'react-select'

import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuIcon from '@mui/icons-material/Menu';

import Avatar from '@mui/material/Avatar';
import Backdrop from '@mui/material/Backdrop';
import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';

import { FaReply } from "react-icons/fa";
import Forward5Icon from '@mui/icons-material/Forward5';
import { TbPinnedFilled } from "react-icons/tb";

import { testUser, customStyles, formatDate, getNameById, formatDisplayDate } from '../../../contants';
import { APIServices } from '../../../hooks/fetchAPI';


import CloseIcon from '@mui/icons-material/Close';
import { PiFilePdf } from 'react-icons/pi';
import { PersonPinCircle } from '@mui/icons-material';

const ViewModelImage = lazy(() => import('../../../component/FileUpload/ViewModelImage'));

const SearchMessageChat = React.memo(({ toggle, setToggle, groupData }) => {

  const [searchData, setSearchData] = useState(null);
  const [searchList, setSearchList] = useState(null);
  const [modalImage, setModalImage] = useState(null);


  const handleChange = (event) => {
    setSearchData(event.target.value);
  };

  useEffect(() => {

    handleConversation();

  }, [searchData]);

  const handleConversation = async () => {

    if (!searchData) return setSearchList(null);

    try {

      let data = {
        "group_id": groupData?.id,
        "searchMessage": searchData
      };

      const response = await APIServices.get({ url: `/fetch-message-text`, payload: data });
      setSearchList(response?.data?.data)

    } catch (error) {
      setSearchList(null)
    }

  };



  const searchtextFieldRef = useRef(null);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (document.activeElement !== searchtextFieldRef.current) {
        searchtextFieldRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
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
      <div className='flex flex-col items-center justify-center w-full h-screen mx-2 px-4 md:px-1 '>

        <div className='flex flex-col w-full lg:w-1/3  gap-4 p-4 bg-white dark:bg-gray-800 rounded max-h-[650px] '>

          <div className='flex flex-row items-center justify-between w-full'>

            <h1 className='font-semibold text-black dark:text-white'>Search </h1>

            <div className='text-black dark:text-white cursor-pointer' onClick={() => setToggle(false)}>
              <CloseIcon />
            </div>

          </div>

          <div className='w-full flex flex-col gap-3 justify-start'>
            <FormControl variant="outlined" size="small" fullWidth>
              <InputLabel className='dark:text-white' htmlFor="outlined-adornment-password">Search Message ....</InputLabel>
              <OutlinedInput
                className="border  dark:border-white text-black dark:text-white bg-white dark:bg-gray-800"
                id="outlined-adornment-password"
                type={'text'}
                size="small"
                inputRef={searchtextFieldRef}
                value={searchData}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      className='dark:text-white'
                      aria-label={'display the password'}
                      edge="end"
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                }
                label="Search Chat ...."
              />
            </FormControl>
          </div>
          <div className='flex flex-col w-full h-full overflow-auto'>
            {searchList?.map((chatdetails, index) => (

              <div className='w-full flex flex-col gap-2' key={index}>

                <div className='flex flex-row items-center justify-start  w-full gap-2'>

                  <Avatar
                    sx={{ bgcolor: '#16a34a', width: 35, height: 35, fontSize: '0.75rem' }}
                    src={chatdetails?.user?.ass_id ? `https://611systems.com/assets_clients/611/users/${chatdetails?.user?.ass_id}/latest_pic.jpg` : <PersonPinCircle />}
                  >
                    {!chatdetails?.user?.ass_id && chatdetails?.user?.fname?.charAt(0).toUpperCase()}
                  </Avatar>


                  <div className='flex flex-col'>


                    <div className='flex flex-row justify-self-start'>

                      {chatdetails?.reply_data && <span className='text-[10px] font-light text-gray-400 pr-1'><FaReply /></span>} {/* reply icon */}
                      {chatdetails?.forwarded_message && <span className='text-xs font-light text-gray-400 pr-1'><Forward5Icon fontSize="small" /></span>} {/* forward icon */}

                      <span className='text-xs text-gray-500'>{chatdetails?.user?.fname} {chatdetails?.user?.lname}</span>

                      {chatdetails?.reply_data && <h1 className='text-xs text-gray-400 pl-1'> replied to {getNameById(chatdetails?.reply_data?.user_id)}</h1>}
                      {chatdetails?.forwarded_message && <h1 className='text-xs text-gray-400 pl-1'>forwarded to {chatdetails?.message_group?.group_name}</h1>}

                      {parseInt(chatdetails?.pinned_message) === 1 && (
                        <>
                          <span className="text-sm text-gray-500 pl-1">· </span>
                          <span className="text-xs text-red-500 pl-1 flex flex-row gap"><TbPinnedFilled />Pinned</span>
                        </>
                      )}
                    </div>

                    {chatdetails?.forwarded_message &&
                      <React.Fragment>
                        <div className='px-2 bg-gray-200 rounded cursor-pointer mb-2'>
                          <h1 className='text-lg'>{chatdetails?.reply_data?.text_message}</h1>
                        </div>
                      </React.Fragment>
                    }

                    {chatdetails?.reply_data && (
                      <div className="flex flex-col py-1 ">
                        {/* Reply container */}
                        <div className="p-2 bg-green-100 rounded cursor-pointer flex flex-row-reverse gap-2 max-w-[500px] w-fit break-words">
                          <h1 className="text-lg text-gray-500">{chatdetails?.reply_data?.text_message}</h1>
                        </div>
                      </div>
                    )}

                    {/* Main message container */}
                    <div className="px-2 bg-green-200 rounded cursor-pointer justify-self-start py-2 flex flex-row gap-2 max-w-[500px]  overflow-hidden" >
                      <h1 className='text-lg whitespace-pre-wrap break-words text-black'>
                        {chatdetails?.text_message}
                      </h1>
                    </div>

                  </div>

                </div>

                <div className='flex flex-col justify-start gap-2 ml-10'>

                  {chatdetails?.group_file?.length > 0 && (
                    <div className="grid mt-2 py-2 rounded">
                      <div className="flex gap-2 flex-wrap">

                        {chatdetails?.group_file?.map((file, index) => {

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

                  <div className='flex flex-col mb-2'>
                    {/* {parseInt(content?.pinned_message) === 1 && <span className='text-[10px] text-red-500'>Pinned</span>} */}
                    <span className='text-[10px] text-black dark:text-white'>{formatDate(chatdetails?.created_at)}</span>
                  </div>

                </div>

              </div>

            ))}
          </div>

        </div>


      </div>

    </Backdrop>
  )
});

export default SearchMessageChat;
