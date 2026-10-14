import React, { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { storeToggleMessage } from '../../../redux/GroupChat/ToggleMessageSlice';
import { Avatar, CircularProgress, FormControl, IconButton, InputAdornment, InputLabel, Menu, MenuItem, OutlinedInput, Tooltip } from '@mui/material';
import { Add, Close, Delete, Edit, MoreHoriz, MoreHorizOutlined, Remove, RemoveCircle } from '@mui/icons-material';
import AddChannel from '../popOutMenu/AddChannel';
import { APIServices } from '../../../hooks/fetchAPI';
import ManageMember from '../popOutMenu/ManageMember';
import DeleteTools from '../popOutMenu/DeleteTools';
import UpdateChannel from '../popOutMenu/UpdateChannel';
import SearchIcon from '@mui/icons-material/Search';


export const TeamTab = React.memo(({ handleFetchingGroupChat, team, setManageTeam, setToggleTeam }) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.userData)
    const messengerAdminLevel = user?.permission;


    const [toggle, setToggle] = useState(false);
    const [toggleMember, setToggleMember] = useState(false);
    const [toggleDeleteChannel, setToggleDeleteChannel] = useState(false);
    const [toggleUpdateChannel, setToggleUpdateChannel] = useState(false);

    const [anchorEl, setAnchorEl] = useState(null);
    const [activeTab, setActiveTab] = useState('channel');
    const [listMember, setListMember] = useState(null);
    const [listBlocklist, setBlocklist] = useState([]);
    const [error, setError] = useState([]);


    const [listChannel, setListChannel] = useState([]);

    const [selectedChannelId, setSelectedChannelId] = useState(null);
    const [isTeam, setIsTeam] = useState(false);
    const [teamName, setTeamName] = useState(team?.team_name);
    const [isLoading, setLoading] = useState(false);
    const searchtextFieldRef = useRef(null);
    const [searchInput, setSearchInput] = useState('');
    const [filteredMembers, setFilteredMembers] = useState(listMember);


    const handleChange = (event) => {
        setSearchInput(event.target.value);

    };

    const handleUpdateChannel = useCallback(async (channel_id) => {
        setSelectedChannelId(channel_id)
        setAnchorEl(null);
        setToggleUpdateChannel(true);
        setIsTeam(false)
    }, [handleFetchingGroupChat]);

    const handleUpdateTeam = useCallback(async () => {
        setAnchorEl(null);
        setToggleUpdateChannel(true);
        setIsTeam(true)
    }, [handleFetchingGroupChat]);



    const handleDeleteChannel = useCallback(async (channel_id) => {
        setSelectedChannelId(channel_id)
        setAnchorEl(null);
        setToggleDeleteChannel(true);
    }, [handleFetchingGroupChat]);

    const handleRemoveUser = useCallback(async (channel_id) => {
        setSelectedChannelId(channel_id)
        setAnchorEl(null);
        setToggleDeleteChannel(true);
    }, [handleFetchingGroupChat]);


    const handleAddChannel = useCallback(async () => {
        setAnchorEl(null);
        setToggle(true);
    }, []);

    const handleAddMember = useCallback(async () => {
        setAnchorEl(null);
        setToggleMember(true);
    }, [handleFetchingGroupChat]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleMoreClick = (event, channelId) => {
        setAnchorEl(event.currentTarget);
        setSelectedChannelId(channelId);
    };

    useEffect(() => {
        handleFetchingMembers()
        handlefetchingChannel()
        handleFetchingBlockList()
    }, [team, handleFetchingGroupChat]);

    useEffect(() => {
        setTeamName(team?.team_name)
    }, [team]);




    const handleFetchingBlockList = useCallback(async () => {
        setLoading(false)

        try {

            const response = await APIServices.post({
                url: `/blacklisted-users`,
                payload: { team_id: team.team_id }
            });

            setBlocklist(response?.data)


        } catch (error) {
            console.error('Error creating message group:', error);
            setListMember([]);
        } finally {
            setLoading(false)
        }

    }, [])

    const handleFetchingMembers = useCallback(async () => {
        setLoading(false)

        try {

            const response = await APIServices.post({
                url: `/get-team-members`,
                payload: { team_id: team.team_id }
            });

            setListMember(response?.data)

        } catch (error) {
            console.error('Error creating message group:', error);
            setListMember([]);
        } finally {
            setLoading(false)
        }

    }, [])

    const handlefetchingChannel = useCallback(async () => {

        setLoading(false)
        try {

            const response = await APIServices.post({
                url: `/channels-by-team`,
                payload: { team_id: team.team_id }
            });

            setListChannel(response?.data?.channels)

        } catch (error) {
            console.error('Error creating message group:', error);
            setListChannel([]);
        } finally {
            setLoading(false)
        }

    }, [])

    useEffect(() => {
        if (listMember && listMember.members) {
            const filtered = listMember.members.filter((member) =>
                `${member.user.first_name} ${member.user.last_name}`
                    .toLowerCase()
                    .includes(searchInput.toLowerCase())
            );
            setFilteredMembers(filtered);
        } else {
            setFilteredMembers([]); // Ensure filteredMembers is an array if no data
        }
    }, [searchInput, listMember]);

    console.log('listMember:', listMember, 'filteredMembers:', filteredMembers);

    return (
        <div className='flex flex-col justify-between w-full h-full'>
            {toggle && (
                <Suspense>
                    <AddChannel
                        team={team}
                        toggle={toggle}
                        setToggle={setToggle}
                        refreshData={handleFetchingGroupChat} // Refresh after creating a channel
                    />
                </Suspense>
            )}

            {toggleMember && (
                <Suspense>
                    <ManageMember
                        team={team}
                        memberslist={listMember}
                        setListMember={setListMember}
                        toggle={toggleMember}
                        setToggle={setToggleMember}
                        refreshData={handleFetchingMembers}
                    />
                </Suspense>
            )}

            {toggleDeleteChannel && (
                <Suspense>
                    <DeleteTools
                        team={team}
                        toggle={toggleDeleteChannel}
                        selectedData={selectedChannelId}
                        setToggle={setToggleDeleteChannel}
                        refreshData={handleFetchingGroupChat}
                        type={activeTab === 'channel' ? 1 : 3} //1-channel 0-teams
                    />
                </Suspense>
            )}

            {toggleUpdateChannel && (
                <Suspense>
                    <UpdateChannel
                        team={team}
                        toggle={toggleUpdateChannel}
                        setTeamName={setTeamName}
                        teamName={teamName}
                        selectedData={selectedChannelId || "team"}
                        setToggle={setToggleUpdateChannel}
                        refreshData={handleFetchingGroupChat}
                        type={!isTeam ? 1 : 2} //1-channe; 2-team
                    />
                </Suspense>
            )}

            <div className='flex flex-row items-center justify-between w-full max-h-[100px] border-gray-200 p-4'>
                <div className='flex flex-row items-center gap-4'>
                    <span
                        onClick={() => {
                            setManageTeam([]);
                            setToggleTeam(false);
                            navigate('/channel');
                        }}
                        className='cursor-pointer'
                    >
                        <ArrowBackIcon />
                    </span>
                </div>
            </div>

            {/* Avatar and Team Name */}
            <div className='flex flex-col w-full h-full p-4 overflow-auto gap-4'>
                <div className='self-center'>
                    <Avatar sx={{ bgcolor: '#16a34a', width: 100, height: 100, fontSize: '2.8rem' }}>{teamName.charAt(0).toUpperCase()}</Avatar>
                </div>
                <div className='flex flex-row justify-center ml-10'>
                    <h1 className='font-black text-lg justify-items-center'>{teamName} </h1>
                    <button className='text-blue-500 ml-3' onClick={() => handleUpdateTeam()}> <Edit /></button>

                </div>


                {/* Tab Navigation Below the Team Name */}
                <div className="flex justify-start gap-1 mx-4 p-2 border-b-[1.5px] border-gray-200">
                    <button
                        onClick={() => handleTabChange('channel')}
                        className={`px-4 py-2 rounded-lg ${activeTab === 'channel' ? 'bg-green-500 text-white' : 'bg-white dark:bg-gray-800'}`}
                    >
                        Channels
                    </button>
                    <button
                        onClick={() => handleTabChange('members')}
                        className={`px-4 py-2 rounded-lg ${activeTab === 'members' ? 'bg-green-500 text-white' : 'bg-white dark:bg-gray-800'}`}
                    >
                        Members
                    </button>
                    {/* <button
                        onClick={() => handleTabChange('blocklist')}
                        className={`px-4 py-2 rounded-lg ${activeTab === 'blocklist' ? 'bg-green-500 text-white' : 'bg-white'}`}
                    >
                        Blocklist
                    </button> */}
                </div>

                <div className="mx-4 -my-2">
                    {activeTab === 'channel' &&
                        <div className="flex flex-col justify-center self-start">

                            <div onClick={handleAddChannel} className='border p-2 mb-2 self-end text-sm rounded-lg bg-white dark:bg-gray-800 border-green-500 text-green-500'>
                                <Add /> Add Channel
                            </div>

                            {isLoading ? <div className='self-center'><CircularProgress /></div> : <div className="max-h-[450px] overflow-y-auto border rounded-lg px-2 pb-2">
                                {listChannel?.map((channel, index) => (
                                    <div key={index} className="flex flex-row justify-between mt-2 p-4 border rounded-lg bg-gray-100 dark:bg-gray-700">
                                        <h1>{channel?.name}</h1>
                                        <div className='flex flex-row text-sm gap-2'>
                                            {messengerAdminLevel >= 1 && <button className='text-blue-500' onClick={() => handleUpdateChannel(channel)}> <Edit /></button>}
                                            {messengerAdminLevel >= 1 && <button
                                                className='text-red-500'
                                                onClick={() => handleDeleteChannel(channel)}
                                            >
                                                <Delete />
                                            </button>}

                                        </div>
                                    </div>
                                ))}
                            </div>}

                        </div>
                    }
                    {activeTab === 'members' && <div className="flex flex-col  justify-center">
                        <div onClick={handleAddMember} className='border p-2 mb-2 self-end text-sm rounded-lg bg-white dark:bg-gray-800 border-green-500 text-green-500'>
                            <Add /> Add Member
                        </div>
                        <div className='flex flex-col w-full gap-2 mb-2'>

                            <FormControl variant="outlined" size="small" fullWidth>
                                <InputLabel htmlFor="outlined-adornment-password" className='dark:text-white'>Search Members ....</InputLabel>
                                <OutlinedInput
                                    className="border  dark:border-white text-black dark:text-white bg-white dark:bg-gray-800"

                                    id="outlined-adornment-password"
                                    type={'text'}
                                    size="small"
                                    inputRef={searchtextFieldRef}
                                    value={searchInput}
                                    onChange={handleChange}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton className='dark:text-white'
                                                aria-label={'Search'}
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

                        {isLoading ? <div className='self-center'><CircularProgress /></div> : <div className="max-h-[450px] overflow-y-auto border rounded-lg px-2 pb-2">
                            {filteredMembers?.map((member, index) => (
                                <div key={index} className="flex flex-row justify-between mt-2 p-3 border rounded-lg bg-gray-100 dark:bg-gray-700">
                                    <h1>{member?.user?.first_name} {member?.user?.last_name}</h1>
                                    {messengerAdminLevel >= 1 && <div className="relative group cursor-pointer" onClick={() => handleRemoveUser(member)} >
                                        <Close />
                                        <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            Remove
                                        </span>
                                    </div>}
                                </div>
                            ))}
                        </div>}

                    </div>}
                    {activeTab === 'blocklist' && <div className="flex flex-col  justify-center">
                        <div onClick={handleAddMember} className='p-2 self-end text-sm rounded-lg bg-white dark:bg-gray-800 text-green-500'>
                            <Add /> Blocklist Member
                        </div>
                        {isLoading ? <div className='self-center'><CircularProgress /></div> : <div className="max-h-[450px] overflow-y-auto border rounded-lg px-2 pb-2">
                            {listBlocklist?.data?.map((member, index) => (
                                <div key={index} className="flex flex-row justify-between mt-2 p-3 border rounded-lg bg-gray-100">
                                    <h1>{member?.user?.first_name} {member?.user?.last_name}</h1>
                                    {messengerAdminLevel >= 1 && <div className="relative group cursor-pointer" onClick={() => handleRemoveUser(member)} >
                                        <Close />
                                        <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            Remove
                                        </span>
                                    </div>}
                                </div>
                            ))}
                            <span className='text-black'>{error}</span>
                        </div>}

                    </div>}

                </div>
            </div>
        </div>
    );
});
