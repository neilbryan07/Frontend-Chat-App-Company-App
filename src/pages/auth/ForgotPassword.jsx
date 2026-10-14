
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { BackgroundAuth } from '../../component/Auth/BackgroundAuth';
import { VerifyChangePasswordEmail } from './tools/VerifyChangePasswordEmail';
import { OTPEmail } from './tools/OTPEmail';
import { ChangePassword } from './tools/ChangePassword';
import { APIServices } from '../../hooks/fetchAPI';
import { pageRoutes } from '../../routes/pageRoutes';

const ForgotPassword = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errroMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);




    const [stepper, setStepper] = useState(parseInt(0));

    useEffect(() => {
        let errorTimer;
        if (errroMsg || message !== null) {
            errorTimer = setTimeout(() => {
                setErrorMsg('');
                setMessage('')
            }, 10000);
        }
        return () => clearTimeout(errorTimer);
    }, [errroMsg, message]);

    const handleStep = (data) => {
        console.log(data)
        setStepper(parseInt(data))
    }

    const handleBackStep = (data) => {
        console.log(data)
        setStepper(parseInt(data))
        setMessage('')
        setErrorMsg('')
    }

    const handleStep1 = async (email) => {
        setLoading(true)

        try {
            let data = {
                "email": email,
            };

            const response = await APIServices.post({ url: `/auth/forgot-password`, payload: data });

            if (response?.status === 200) {
                setStepper(1)
                setMessage(response?.data?.message)
            } else {
                setErrorMsg(response?.data?.message);
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
            setMessage(errorMessage);
            console.error('Error:', error.response?.data || error.message);
        } finally {
            setLoading(false)
        }
    };

    const handleStep2 = async (otpdata) => {
        setLoading(true)

        try {
            let data = {
                "email": email,
                "otp": otpdata
            };

            const response = await APIServices.post({ url: `/auth/verify-otp`, payload: data });

            if (response?.status === 200) {
                setStepper(2)
                setMessage(response?.data?.message)
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
            setMessage(errorMessage);
            console.error('Error:', error.response?.data || error.message);
        } finally {
            setLoading(false)
        }
    };


    const handleStep3 = async () => {
        setLoading(true)

        try {
            let data = {
                "email": email,
                "otp": otp,
                "password": password,
                "password_confirmation": confirmPassword
            };

            const response = await APIServices.post({ url: `/auth/reset-password`, payload: data });

            if (response?.status === 200) {
                setMessage(response?.data?.message)
                navigate(pageRoutes.LOGIN)
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
            setMessage(errorMessage);
            console.error('Error:', error.response?.data || error.message);
        } finally {
            setLoading(false)
        }
    };

    return (
        <BackgroundAuth>
            {stepper === 0 && <VerifyChangePasswordEmail loading={loading} handleStep={handleBackStep} handleData={handleStep1} setEmail={setEmail} email={email} message={message} errroMsg={errroMsg} />}
            {stepper === 1 && <OTPEmail loading={loading} handleStep={handleBackStep} handleData={handleStep2} handleResend={handleStep1} otp={otp} setOtp={setOtp} message={message} email={email} />}
            {stepper === 2 && <ChangePassword loading={loading} handleStep={handleBackStep} handleData={handleStep3} password={password} confirmPassword={confirmPassword} setPassword={setPassword} setConfirmPassword={setConfirmPassword} message={message} />}
        </BackgroundAuth>
    )
}

export default ForgotPassword;