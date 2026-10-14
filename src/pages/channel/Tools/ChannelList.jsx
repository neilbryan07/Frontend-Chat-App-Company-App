import React, { useState, useRef, useEffect, useCallback, useMemo, lazy, Suspense } from 'react'
import { IoCreateOutline } from "react-icons/io5";
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector, useDispatch } from "react-redux";
import { storeToggleDrawer } from '../../../redux/GroupChat/ToggleDrawerSlice';
import { TeamItem } from '../../../component/teamBox/TeamItem';
import AddTeams from '../popOutMenu/AddTeams';
import AddChannel from '../popOutMenu/AddChannel';
import ManageMember from '../popOutMenu/ManageMember';
import DeleteTools from '../popOutMenu/DeleteTools';


export const ChannelList = React.memo(({ handleFetchingGroupChat, searchInput, setSearchInput, listGroupData, setlistGroupData, setTeam_id, setToggleTeam, toggleTeam }) => {

    const dispatch = useDispatch();

    const user = useSelector((state) => state.user.userData)
    const messengerAdminLevel = user?.permission;
    const [toggleGC, setToggleGC] = useState(false);
    const [toggleManageMember, setToggleManageMember] = useState(false);

    const [toggleTools, setToggleTools] = useState(false);
    const [toggleDeleteTools, setToggleDeleteTools] = useState(false);
    const [selectedData, setSelectedData] = useState([]);
    const [selectedChannelID, setSelectedChannelID] = useState(null);


    const handleChange = (event) => {
        setSearchInput(event.target.value);
    };

    return (

        <div className='flex flex-col w-full h-full max-h-screen gap-5 p-4'>

            {toggleGC &&
                (<Suspense>
                    <AddTeams
                        toggle={toggleGC}
                        setToggle={setToggleGC}
                        refreshData={handleFetchingGroupChat}
                    />
                </Suspense>
                )}

            {toggleTools &&
                (<Suspense>
                    <AddChannel
                        team={selectedData}
                        toggle={toggleTools}
                        setToggle={setToggleTools}
                        refreshData={handleFetchingGroupChat}
                        selectedData={selectedData}
                    />
                </Suspense>)
            }

            {toggleManageMember &&
                (<Suspense>
                    <ManageMember
                        team={selectedData}
                        toggle={toggleManageMember}
                        setToggle={setToggleManageMember}
                        refreshData={handleFetchingGroupChat}
                        selectedData={selectedData}
                    />
                </Suspense>)
            }

            {toggleDeleteTools &&
                (<Suspense>
                    <DeleteTools
                        team={selectedData}
                        toggle={toggleDeleteTools}
                        setToggle={setToggleDeleteTools}
                        refreshData={handleFetchingGroupChat}
                        selectedData={selectedData}
                        type={0}
                    />
                </Suspense>)
            }


            <div className='flex flex-row items-center justify-between'>

                <div className='flex flex-row gap-2 items-center'>

                    <div className='cursor-pointer' onClick={() => dispatch(storeToggleDrawer(true))}>
                        <MenuIcon />
                    </div>

                    <h1 className='text-xl font-black text-black dark:text-gray-200'>Channel</h1>

                </div>

                {messengerAdminLevel >= 1 &&
                    <div className='flex flex-row gap-2 items-center justify-center'>
                        <span onClick={() => setToggleGC(true)} className='text-2xl font-black text-gray-600 dark:text-gray-200 cursor-pointer'><IoCreateOutline /></span>
                    </div>
                }
            </div>

            <div className='flex flex-col w-full gap-2'>

                <FormControl variant="outlined" size="small" fullWidth>
                    <InputLabel htmlFor="outlined-adornment-password" className='dark:text-gray-200'> Search Chat ....</InputLabel>
                    <OutlinedInput
                        className="border  dark:border-white text-black dark:text-white bg-white dark:bg-gray-800"
                        id="outlined-adornment-password"
                        type={'text'}
                        size="small"
                        value={searchInput}
                        onChange={handleChange}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    className='dark:text-gray-200'
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

            <div className='flex flex-col w-full overflow-auto'>


                <h1 className='text-sm font-light text-black dark:text-gray-200'>Pinned</h1>

                {listGroupData?.pinned_teams?.map((chatData, index) => (
                    <TeamItem
                        key={index}
                        data={chatData}
                        setToggle={setToggleTools}
                        setManageMember={setToggleManageMember}
                        setDeleteToggle={setToggleDeleteTools}
                        setSelectedData={setSelectedData}
                        setTeam_id={setTeam_id}
                        setToggleTeam={setToggleTeam}
                        handleFetchingGroupChat={handleFetchingGroupChat}
                        pin={true}
                        toggleTeam={toggleTeam}
                        setSelectedChannelID={setSelectedChannelID}
                        selectedChannelID={selectedChannelID}
                    />
                ))}

            </div>

            <div className='flex flex-col w-full overflow-auto'>
                <h1 className='text-sm font-light text-black dark:text-gray-200'>Recent</h1>

                {listGroupData?.non_pinned_teams &&
                    Object.values(listGroupData.non_pinned_teams).map((chatData, index) => (
                        <TeamItem
                            key={index}
                            data={chatData}
                            setManageMember={setToggleManageMember}
                            setToggle={setToggleTools}
                            setDeleteToggle={setToggleDeleteTools}
                            setSelectedData={setSelectedData}
                            setTeam_id={setTeam_id}
                            setToggleTeam={setToggleTeam}
                            handleFetchingGroupChat={handleFetchingGroupChat}
                            pin={false}
                            toggleTeam={toggleTeam}
                            setSelectedChannelID={setSelectedChannelID}
                            selectedChannelID={selectedChannelID}
                        />
                    ))}
            </div>

        </div>
    )
});
