import React, { Suspense, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoHome, IoSettingsSharp, IoNewspaper } from "react-icons/io5";
import { DarkMode, LightModeOutlined, LogoutOutlined } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { storeUserDetails } from '../../redux/userSlice';
import { Avatar } from '@mui/material';
import UserProfile from './UserProfile';
import { setTheme } from '../../hooks/axiosConfig';


export const ActionSelection = React.memo(() => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [darktheme, setDarkTheme] = useState(localStorage.getItem('theme') || 'light');
    const [showMenu, setShowMenu] = useState(false);
    const [selected, setSelected] = useState("");
    const [toggleMember, setToggleMember] = useState(false);
    const user = useSelector((state) => state.user.userData)
    const session_key = user?.session_key;

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
            setDarkTheme(savedTheme);
        } else {
            setTheme('light');
            setDarkTheme('light');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = darktheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        setDarkTheme(newTheme);
    };

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        dispatch(storeUserDetails({ id: null, name: null }));
        navigate("/");
    };

    const handleNavigation = (path, value) => {
        setSelected(value);
        setTimeout(() => navigate(path), 50);
    };


    return (
        <div className="w-full max-w-[60px] h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col items-center justify-between gap-2 py-5">
            {toggleMember && (
                <Suspense>
                    <UserProfile
                        data={user}
                        toggle={toggleMember}
                        setToggle={setToggleMember}
                    />
                </Suspense>
            )}

            <div className="flex flex-col gap-7" >
                <span
                    title='Chats'
                    onClick={() => handleNavigation('/message', 'message')}
                    className={`${selected === "message" ? 'text-green-500' : 'text-gray-600 dark:text-gray-300'} text-xl cursor-pointer`}
                >
                    <IoHome />
                </span>
                <span
                    title='Channel'
                    onClick={() => handleNavigation('/channel', 'channel')}
                    className={`${selected === "channel" ? 'text-green-500' : 'text-gray-600 dark:text-gray-300'} text-xl cursor-pointer`}
                >
                    <IoNewspaper />
                </span>
            </div>


            {/* Settings Icon with Dropdown */}
            <div className="flex flex-col gap-6">
                <span
                    onClick={toggleTheme}
                    title={darktheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    className={`${showMenu ? 'text-green-500' : 'text-gray-600 dark:text-gray-300'} text-xl cursor-pointer ml-2`}
                >
                    {darktheme === 'dark' ? <LightModeOutlined /> : <DarkMode />}
                </span>

                <span
                    onClick={() => { setToggleMember(true) }}
                    title={`${user?.name} (${user?.email})`}
                    className={`${showMenu ? 'text-green-500' : 'text-gray-600 dark:text-gray-300'} text-xl cursor-pointer`}
                >
                    <Avatar sx={{ bgcolor: '#16a34a', width: 35, height: 35, fontSize: '0.75rem' }} src={`https://611systems.com/assets_clients/611/users/${user?.ass_id}/latest_pic.jpg`}
                    >{user?.name?.charAt(0).toUpperCase()}</Avatar>
                </span>


                <span
                    onClick={handleLogout}
                    title='Logout'
                    className={`${showMenu ? 'text-green-500' : 'text-gray-600 dark:text-gray-300'} text-xl cursor-pointer ml-2`}
                >
                    <LogoutOutlined />
                </span>

            </div>
        </div>
    );
});
