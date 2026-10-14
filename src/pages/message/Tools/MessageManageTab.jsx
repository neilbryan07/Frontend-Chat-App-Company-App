import React, { useState, useRef, useEffect, useCallback, Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { storeToggleMessage } from '../../../redux/GroupChat/ToggleMessageSlice';
import { Avatar, Chip, FormControl, IconButton, InputAdornment, InputLabel, Menu, MenuItem, OutlinedInput, Tooltip } from '@mui/material';
import { Add, Close, Delete, Edit, MoreHorizOutlined, PersonPinCircle, Remove, RemoveCircle } from '@mui/icons-material';
import { APIServices } from '../../../hooks/fetchAPI';
import ManageGroupMember from '../popOutMenu/ManageGroupMember';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import LabelUser from '../../../component/chip/LabelUser';


const UpdateGroupChatTools = lazy(() => import('./UpdateGroupChatTools'));
const DeleteGroupChatTools = lazy(() => import('./DeleteGroupChatTools'));

export const MessageManageTab = React.memo(({ handleFetchingGroupChat, team, setManageTeam, setToggleTeam }) => {

    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [nicknames, setNicknames] = useState([]);
    const [editingNickname, setEditingNickname] = useState(null);
    const [nicknameInput, setNicknameInput] = useState('');
    const [toggleMember, setToggleMember] = useState(false);

    const [anchorEl, setAnchorEl] = useState(null);
    const [activeTab, setActiveTab] = useState('members');

    const [groupDetails, setGroupDetails] = useState(null);
    const [fetchMember, setFetchMember] = useState(null)

    const [toggleTools, setToggleTools] = useState(false);
    const [toggleDeleteTools, setToggleDeleteTools] = useState(false);

    const user = useSelector((state) => state.user.userData)

    const messengerAdminLevel = user?.permission;
    const searchtextFieldRef = useRef(null);
    const [searchInput, setSearchInput] = useState('');
    const [filteredMembers, setFilteredMembers] = useState([]);

    useEffect(() => {
        const fetchNicknames = async () => {
            try {
                const response = await APIServices.post({
                    url: '/nickname-show-by-group',
                    payload: {
                        group_id: id
                    }
                });

                if (response?.status === 200) {
                    setNicknames(response.data);
                }
            } catch (error) {
                console.error("Error fetching nicknames:", error);
            }
        };

        if (id) {
            fetchNicknames();
        }
    }, [id]);

    const handleChange = (event) => {
        setSearchInput(event.target.value);

    };
    const handleSaveNickname = async (userId) => {
        try {
            const existing = nicknames.find(nick => nick.user_id === userId);

            const payload = {
                group_id: id,
                user_id: userId,
                nickname: nicknameInput
            };

            const url = existing ? '/nickname-update' : '/nickname-create';

            const response = await APIServices.post({ url, payload });

            if (response?.status === 200 || response?.status === 201) {
                // refetch nicknames after save (refresh)
                const updatedNicknamesResponse = await APIServices.post({
                    url: '/nickname-show-by-group',
                    payload: {
                        group_id: id
                    }
                });

                if (updatedNicknamesResponse?.status === 200) {
                    setNicknames(updatedNicknamesResponse.data); // Update state with fresh data
                }

                setEditingNickname(null);
                setNicknameInput('');
            }
        } catch (error) {
            console.error("Nickname error", error);
        }
    };



    const handleDeleteNickname = async (userId) => {
        try {
            const response = await APIServices.deletes({
                url: '/nickname-delete',
                payload: {
                    group_id: id,
                    user_id: userId,
                }
            });

            if (response?.status === 200) {
                setNicknames(prev => prev.filter(n => n.user_id !== userId));
                setEditingNickname(null);
            }
        } catch (err) {
            console.error("Error deleting nickname", err);
        }
    };

    useEffect(() => {
        handleGroupDetails();
    }, [id, toggleMember]);

    const handleGroupDetails = useCallback(async () => {
        try {
            let data = {
                "id": id,
            };

            const response = await APIServices.get({ url: `/fetch-group-details`, payload: data });

            if (response?.status === 200) {
                setGroupDetails(null)
                setGroupDetails(response?.data?.data)
                setFetchMember(response?.data?.data?.message_group_assign)
            }

        } catch (error) {
            // setGroupDetails(null)
        }

    }, [id]);

    useEffect(() => {
        if (!fetchMember) return;

        if (searchInput.trim() === '') {
            setFilteredMembers(fetchMember);
        } else {
            const filtered = fetchMember.filter((member) => {

                const fname = typeof member?.user?.fname === 'string' ? member.user.fname.toLowerCase() : '';
                const lname = typeof member?.user?.lname === 'string' ? member.user.lname.toLowerCase() : '';

                const searchTerm = searchInput.toLowerCase();
                return fname.includes(searchTerm) || lname.includes(searchTerm);
            });
            setFilteredMembers(filtered);
        }
    }, [searchInput, fetchMember]);

    const handleAddMember = useCallback(async () => {
        handleGroupDetails();
        setAnchorEl(null);
        setToggleMember(true);
    }, [handleGroupDetails]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleRemoveUser = async (data) => {

        let submitData = {
            "id": data?.id,
            "user_id": data?.user?.id,
            "group_id": data?.group_id
        }

        try {

            const response = await APIServices.deletes({ url: `/remove-user-group`, payload: submitData });

            if (response?.status === 200) {

                setFetchMember((prevData) => prevData.filter((item) => item.id !== data?.id));
                // handleGroupDetails();
            }

        } catch (error) {
            console.error('Error creating message group:', error);
        }

    }


    return (
        <div className='flex flex-col justify-between w-full h-full'>

            {toggleMember && (
                <Suspense>
                    <ManageGroupMember
                        team={groupDetails}
                        fetchMember={fetchMember}
                        toggle={toggleMember}
                        setToggle={setToggleMember}
                        refreshData={handleGroupDetails}
                    />
                </Suspense>
            )}

            {toggleTools &&
                (<Suspense>
                    <UpdateGroupChatTools
                        toggle={toggleTools}
                        setToggle={setToggleTools}
                        refreshData={handleFetchingGroupChat}
                        selectedData={team}
                    />
                </Suspense>)
            }


            {toggleDeleteTools &&
                (<Suspense>
                    <DeleteGroupChatTools
                        toggle={toggleDeleteTools}
                        setToggle={setToggleDeleteTools}
                        refreshData={handleFetchingGroupChat}
                        selectedData={team}
                    />
                </Suspense>)
            }


            <div className='flex flex-row items-center justify-between w-full max-h-[100px] border-gray-200 p-4'>
                <div className='flex flex-row items-center gap-4'>
                    <span
                        onClick={() => {
                            setToggleTeam(false);
                            navigate(`/message/${id}`);
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
                    <Avatar sx={{ bgcolor: '#16a34a', width: 100, height: 100, fontSize: '2.8rem' }}>{groupDetails?.group_name.charAt(0).toUpperCase()}</Avatar>
                </div>

                <h1
                    onClick={() => messengerAdminLevel >= 1 ? setToggleTools(true) : ''}
                    className='font-black text-lg self-center cursor-pointer flex flex-row items-center gap-2'
                >
                    {groupDetails?.group_name} {messengerAdminLevel >= 1 && <EditIcon sx={{ color: "#22C55E" }} />}
                </h1>


                {/* Tab Navigation Below the Team Name */}
                <div className="flex justify-start gap-1 mx-4 p-2 border-b-[1.5px] border-gray-200">
                    {/* <button
                        onClick={() => handleTabChange('channel')}
                        className={`px-4 py-2 rounded-lg ${activeTab === 'channel' ? 'bg-green-500 text-white' : 'bg-white'}`}
                    >
                        Channels
                    </button> */}
                    <button
                        onClick={() => handleTabChange('members')}
                        className={`px-4 py-2 rounded-lg ${activeTab === 'members' ? 'bg-green-500 text-white' : 'bg-white'}`}
                    >
                        Members
                    </button>
                </div>

                <div className="px-4">

                    <div className="flex flex-col  justify-center w-full">


                        <div className='w-full flex flex-row items-center justify-between py-2'>

                            <h1 className=' font-semibold text-sm'>{groupDetails?.team_id ? "Team Lead:" : "Created By:"} {groupDetails?.group_owner?.fname} {groupDetails?.group_owner?.lname}</h1>

                            {messengerAdminLevel >= 1 && <div onClick={handleAddMember} className='text-sm rounded-lg bg-white dark:bg-gray-900 text-green-500 border px-2 border-green-500 cursor-pointer py'>
                                <Add /> Add Member
                            </div>}
                        </div>

                        <div className='flex flex-col w-full gap-2'>

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
                        <div className="max-h-[450px] h-full overflow-y-auto border rounded-lg px-2 pb-2 mt-2">
                            {filteredMembers?.map((member, index) => {
                                const memberNickname = nicknames.find(nick => nick.user_id === member.user.id);
                                const nickname = memberNickname ? memberNickname.nickname : 'Set Nickname';
                                const isEditing = editingNickname === member.user.id;

                                return (
                                    <div key={index} className="flex justify-between items-center mt-2 p-3 border rounded-lg bg-gray-100 dark:bg-gray-700">
                                        <div className="flex items-center gap-2">
                                            <Avatar
                                                sx={{ bgcolor: '#16a34a', width: 35, height: 35, fontSize: '0.75rem' }}
                                                src={member?.user?.ass_id !== null ? `https://611systems.com//assets_clients/611/users/${member?.user?.ass_id}/latest_pic.jpg` : ''}
                                            >
                                                {member?.user?.fname?.charAt(0).toUpperCase()}
                                            </Avatar>
                                            <div className="flex items-center gap-2"> {/* Add this class */}

                                                {
                                                    isEditing ? <div className='flex flex-row gap-2'>
                                                        <input value={nicknameInput}
                                                            onChange={(e) => setNicknameInput(e.target.value)}
                                                            className="border px-2 py-1 rounded dark:bg-gray-800"
                                                            placeholder="Enter nickname">

                                                        </input>
                                                        <button onClick={() => handleSaveNickname(member.user.id)} className="text-green-500">Save</button>
                                                        <button onClick={() => setEditingNickname(null)} className="text-gray-500 dark:text-gray-200">Cancel</button>
                                                        {memberNickname && (
                                                            <button onClick={() => handleDeleteNickname(member.user.id)} className="text-red-500">Delete</button>
                                                        )}
                                                    </div>
                                                        : !memberNickname ?
                                                            <div className='flex flex-col '>
                                                                <h1 className="font-semibold dark:text-gray-200">{member?.user?.fname} {member?.user?.lname}</h1>
                                                                <span className='text-sm  dark:text-gray-200'>{nickname}</span>
                                                            </div>
                                                            :
                                                            <div className='flex flex-col '>
                                                                <span className="font-semibold  dark:text-gray-200">{nickname}</span>
                                                                <h1 className='text-sm  dark:text-gray-200'>{member?.user?.fname} {member?.user?.lname}</h1>
                                                            </div>
                                                }

                                                {member?.user?.messenger_admin !== 0 && (
                                                    <Chip
                                                        label={`${member?.user?.messenger_admin === 2 ? 'Head' : member?.user?.messenger_admin === 1 ? 'Admin' : ''}`}
                                                        variant='outlined'
                                                        color='info'
                                                        size="small"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div className='flex flex-row gap-2'>
                                            <div className="relative group cursor-pointer" onClick={() => {
                                                setEditingNickname(member.user.id);
                                                setNicknameInput(nickname !== '' ? nickname : '');
                                            }} title='Edit Nickname'>
                                                <Edit />

                                            </div>
                                            {messengerAdminLevel >= 1 && (
                                                <div title='Remove Member' className="relative group cursor-pointer" onClick={() => handleRemoveUser(member)}>
                                                    <Close />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                );
                            })}

                        </div>



                    </div>
                </div>


                {messengerAdminLevel >= 1 && <div className='flex flex-row-reverse items-center cursor-pointer'>
                    <div className='cursor-pointer' onClick={() => setToggleDeleteTools(true)}>
                        <DeleteIcon sx={{ color: "red" }} />
                    </div>
                </div>}

            </div>
        </div >
    );
});
