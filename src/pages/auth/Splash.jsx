import React, { useEffect } from 'react'

import { useParams } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';

import { useNavigate, useLocation } from 'react-router-dom';

import { APIServices } from '../../hooks/fetchAPI';

import { storeUserDetails } from '../../redux/userSlice';

import CircularProgress from '@mui/material/CircularProgress';
import SendIcon from '@mui/icons-material/Send';
import MessageIcon from '@mui/icons-material/Message';

export const Splash = () => {

    const { session_key } = useParams();

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const sessionKey = params.get('session_key');
    const ass_id = params.get('ass_id');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        saveUser2();
    }, []);

    const saveUser2 = async () => {
        // if (!session_key) {
        //     console.log("Please enter email and password");
        //     return;
        // }

        let submitData = {
            session_key: sessionKey,
        };

        try {
            const response = await APIServices.post({ url: `/login-route`, payload: submitData });

            if (response?.status === 200 && response?.data?.user) {
                localStorage.setItem("access_token", response?.data?.auth_token);

                dispatch(storeUserDetails({
                    id: response?.data?.user?.id,
                    ass_id: response?.data?.user?.ass_id,
                    name: `${response?.data?.user?.fname} ${response?.data?.user?.lname}`,
                    email: response?.data?.user?.email,
                    permission: response?.data?.user?.messenger_admin,
                    session_key: sessionKey
                }));

                if (ass_id) {

                    let dataParams = {
                        "ass_id": ass_id,
                        "user_id": response?.data?.user?.id,
                    };

                    const responseParams = await APIServices.get({ url: `/short-cut-checker`, payload: dataParams });

                    if (responseParams?.[0]?.status === 404) {
                        navigate("/message");
                    } else {
                        navigate(`/message/${responseParams?.data?.redirect_to_this_group}`);
                    }

                }
                else {

                    navigate("/message");

                }


            } else {
                console.log("Invalid credentials. Please check your email and password.");
            }
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div className='w-full h-screen bg-white flex flex-col items-center justify-center gap-2'>

            <CircularProgress color="success" />

            <div className='flex flex-row gap-2 items-center text-gray-500'>
                <span className=' font-semibold'>Loading Messenger</span>
                <MessageIcon />
                {ass_id}
                {/* {sessionKey} */}
            </div>

        </div>
    )
}
