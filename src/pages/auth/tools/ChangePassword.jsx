import React from 'react'
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
import { CircularProgress, Divider } from '@mui/material';
import Alert from '@mui/material/Alert';

import { FaUserCircle } from "react-icons/fa";

import { pageRoutes } from '../../../routes/pageRoutes';

export const ChangePassword = ({ handleStep, handleData, password, confirmPassword, setPassword, setConfirmPassword, message, loading }) => {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setConfirmShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickConfirmShowPassword = () => setConfirmShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    return (
        <div className='w-full max-w-md max-md:max-w-full bg-white rounded-lg p-4 flex flex-col gap-2 drop-shadow-md'>

            <div className='w-full items-center flex flex-col gap-2 my-3'>

                {/* <img
                    className='w-[120px] h-[45px] hidden max-md:block'
                    src={require('../../../assets/images/NBPO_LOGO.png')}
                    alt=''
                /> */}

                <span className='text-3xl text-green-600 block max-md:hidden'><FaUserCircle /></span>
                <Header text={"Change Password"} style={"text-xl font-lexend"} />
                <span className='text-green-600 font-light font-lexend text-sm'>Company Portal</span>
            </div>

            <div className='w-full flex flex-col gap-3 mb-10'>

                <FormControl variant="outlined" size="small">

                    <div className='w-full flex flex-row items-center justify-between gap-2 my-3'>
                        <span className='font-normal font-lexend'>New Password</span>
                    </div>

                    <OutlinedInput
                        id="outlined-password"
                        placeholder="New password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={
                                        showPassword ? 'hide the password' : 'display the password'
                                    }
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    onMouseUp={handleMouseUpPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>

                <FormControl variant="outlined" size="small">

                    <div className='w-full flex flex-row items-center justify-between gap-2 my-3'>
                        <span className='font-normal font-lexend'>Confirm Password</span>
                    </div>

                    <OutlinedInput
                        id="outlined-password"
                        placeholder="Confirm password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={
                                        showConfirmPassword ? 'hide the password' : 'display the password'
                                    }
                                    onClick={handleClickConfirmShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    onMouseUp={handleMouseUpPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>

                {message && <Alert severity="success">{message}</Alert>}

                <div onClick={() => handleData()} className='w-full font-lexend bg-green-600 flex flex-col items-center justify-center rounded py-2 cursor-pointer text-white font-medium hover:bg-green-800'>
                    {loading ? <CircularProgress sx={{ color: 'white', size: '10px', padding: '2px' }} /> : <span>Change Account Password</span>}
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
