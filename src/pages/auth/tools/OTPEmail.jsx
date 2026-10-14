import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

import { Header } from '../../../component/Typogaphy/Header';
import { BackgroundAuth } from '../../../component/Auth/BackgroundAuth';

import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Alert, CircularProgress, Divider } from '@mui/material';

import { FaUserCircle } from "react-icons/fa";

import { pageRoutes } from '../../../routes/pageRoutes';
import { ArrowBack } from '@mui/icons-material';

export const OTPEmail = ({ handleStep, handleData, otp, setOtp, message, email, handleResend, loading }) => {

    const navigate = useNavigate();

    const [cooldown, setCooldown] = useState(180);

    useEffect(() => {
        let timer;
        if (cooldown > 0) {
            timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [cooldown]);

    const handleResendSubmit = () => {
        if (cooldown === 0) {
            handleResend(email)
            console.log("OTP resent");
            setCooldown(180);
        }
    };

    return (
        <div className='w-full max-w-md max-md:max-w-full bg-white rounded-lg p-4 flex flex-col gap-2 drop-shadow-md'>

            <div className='flex flex-row'>
                <ArrowBack titleAccess='Back' onClick={() => { handleStep(0) }} />
            </div>

            <div className='w-full items-center flex flex-col gap-2 my-3'>

                {/* <img
                    className='w-[120px] h-[45px] hidden max-md:block'
                    src={require('../../../assets/images/NBPO_LOGO.png')}
                    alt=''
                /> */}

                <span className='text-3xl text-green-600 block max-md:hidden'><FaUserCircle /></span>
                <Header text={"Reset password verification code "} style={"text-xl font-lexend text-center"} />
                <span className='text-gray-600 text-center font-light font-lexend text-sm'>Please enter the OTP code that was sent to {email}</span>
            </div>

            <div className='w-full flex flex-col gap-3 mb-10'>

                <FormControl>
                    <span className='mb-3 font-normal font-lexend'>Enter OTP</span>
                    <TextField
                        id="outlined-required"
                        size="small"
                        type='email'
                        placeholder="OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                </FormControl>

                <div className='flex flex-row'>
                    <button
                        onClick={handleResendSubmit}
                        disabled={cooldown > 0}
                        className={`text-blue-600 ${cooldown > 0 ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                        {cooldown > 0 ? `Resend OTP in ${Math.floor(cooldown / 60)}:${(cooldown % 60).toString().padStart(2, '0')}` : 'Resend OTP'}
                    </button>
                </div>

                {message && <Alert severity="success">{message}</Alert>}


                <div onClick={() => handleData(otp)} className='w-full font-lexend bg-green-600 flex flex-col items-center justify-center rounded py-2 cursor-pointer text-white font-medium hover:bg-green-800'>
                    {loading ? <CircularProgress sx={{ color: 'white', size: '10px', padding: '2px' }} /> : <span>Submit</span>}
                </div>

                <div className='mt-2'><Divider /></div>

                <div className='w-full justify-center flex flex-row gap-2'>
                    <span className='text-black font-light text-sm font-lexend'>Already have an account?</span>
                    <span onClick={() => navigate(pageRoutes.LOGIN)} className='text-green-600 font-medium font-lexend text-sm cursor-pointer hover:text-green-800'>Sign In Now</span>
                </div>

            </div>

        </div>
    )
}
