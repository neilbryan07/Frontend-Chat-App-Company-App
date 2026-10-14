import React, { useEffect, useState } from 'react'

import Select from 'react-select';

import { login, testUser } from "../../contants/index";
import { useSelector, useDispatch } from 'react-redux';

import { storeUserDetails } from '../../redux/userSlice';

import { useNavigate } from 'react-router-dom';

import { APIServices } from '../../hooks/fetchAPI';
import { FaUserCircle } from 'react-icons/fa';
import { Alert, AlertTitle, Divider, FormControl, FormControlLabel, FormGroup, IconButton, InputAdornment, OutlinedInput, TextField } from '@mui/material';
import { CheckBox, Close, Visibility, VisibilityOff } from '@mui/icons-material';


const customStyles = {
  control: (provided) => ({
    ...provided,
    width: '100%', // Make the control full width
  }),
};




export const RegisterPage = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userList, setUserList] = useState([]);
  const [selectUser, setSelectUser] = useState(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [loader, setLoader] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true)
    getGuest()
  };
  const handleCloseModal = () => {
    setOpenModal(false)
    setEmail('')
    setPassword('')
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    const transformedUsers = testUser?.map(user => ({
      value: user.id,
      label: user.name,
    }));
    setUserList(transformedUsers);
  }, []);

  const handleChange = (selectedOption) => {
    setSelectUser(selectedOption);
  };

  const getGuest = async () => {

    const response = await APIServices.post({ url: '/login-guest', payload: { "newguest": 1 } });


    if (response.status === 200) {
      setEmail(response?.data?.email)
      setPassword(response?.data?.password)
    }
  }

  const user = useSelector((state) => state.user.userData)

  const saveUser2 = async () => {
    if (!email || !password) {
      setAlertMessage("Please enter email and password");
      setError(true);
      return;
    }

    setLoader(true);
    setError(false);
    setSuccess(false);

    const submitData = {
      fname: fname.trim() || "",
      lname: lname.trim() || "",
      email: email.trim(),
      password: password.trim(),
    };

    try {
      const response = await APIServices.post({
        url: "/login-register-as-guest",
        payload: submitData,
        headers: {
          "Accept": "application/json",
        },
      });

      console.log("data", response?.data);

      if (response?.status === 200 && response?.data?.user) {
        // Store auth token
        localStorage.setItem("access_token", response.data.auth_token);

        // Dispatch user details
        dispatch(
          storeUserDetails({
            id: response.data.user.id,
            ass_id: response?.data?.user?.ass_id,
            name: `${response?.data?.user?.fname} ${response?.data?.user?.lname}` || "Guest",
            email: response?.data?.user?.email,
            permission: 0
          })
        );

        setSuccess(true);
        navigate("/message");
      } else {
        setAlertMessage(response?.data?.message || "Invalid credentials. Please try again.");
        setError(true);
      }
    } catch (error) {
      let errorMessage = "An error occurred.";
      if (error.message.includes("Network Error")) {
        errorMessage = "Unable to connect to the server. Please check if the server is running.";
      } else if (error.response) {
        errorMessage = error.response.data?.message || "Server error occurred";
      }
      setAlertMessage(errorMessage);
      setError(true);
      console.error("CORS or Network Error:", error);
    } finally {
      setLoader(false);
    }
  };




  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-400 w-full'>

      <div className='flex flex-col w-1/4 gap-2 p-4 bg-white dark:bg-gray-800 max-lg:w-3/4 '>
        <div className='w-full items-center flex flex-col gap-2 my-3'>


          <span className='text-3xl text-green-600 block max-md:hidden'><FaUserCircle /></span>
          <div className={` text - black text - xl font - medium antialiased`}>{"Register Guest Account"}</div>


        </div>


        <div className='w-full flex flex-col gap-3 mb-10'>

          <FormControl>
            <span className='mb-3 font-normal font-lexend'>First Name</span>
            <TextField
              id="outlined-required"
              size="small"
              type='name'
              placeholder="First Name"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
              InputProps={{
                className: "border dark:border-white text-black dark:text-white bg-white dark:bg-gray-800"
              }}
            />
          </FormControl>

          <FormControl>
            <span className='mb-3 font-normal font-lexend'>Last Name</span>
            <TextField
              id="outlined-required"
              size="small"
              type='name'
              placeholder="Last Name"
              value={lname}
              onChange={(e) => setLname(e.target.value)}
              InputProps={{
                className: "border dark:border-white text-black dark:text-white bg-white dark:bg-gray-800"
              }}
            />
          </FormControl>

          <FormControl>
            <span className='mb-3 font-normal font-lexend'>Email</span>
            <TextField
              id="outlined-required"
              size="small"
              type='email'
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                className: "border dark:border-white text-black dark:text-white bg-white dark:bg-gray-800"
              }}
            />
          </FormControl>

          <FormControl variant="outlined" size="small">

            <div className='w-full flex flex-row items-center justify-between gap-2 my-3'>
              <span className='font-normal font-lexend'>Password</span>
            </div>

            <OutlinedInput
              id="outlined-adornment-password"
              className="border  dark:border-white text-black dark:text-white bg-white dark:bg-gray-800"
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    className='dark:text-white'
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

          <FormGroup>
            <FormControlLabel className='px-2' control={<CheckBox defaultChecked color="success" />} label="Remember me" />
          </FormGroup>

          {error &&

            <Alert severity="error">
              <AlertTitle>{alertMessage}</AlertTitle>
            </Alert>
          }

          {success &&
            <Alert severity="success">Welcome User</Alert>
          }

          <div onClick={saveUser2} className='w-full font-lexend bg-green-600 flex flex-col items-center justify-center rounded py-2 cursor-pointer text-white font-medium hover:bg-green-800'>
            <span>Register</span>
          </div>

          <Divider />

          <div onClick={() => navigate('/')} className='w-full font-lexend bg-white dark:bg-gray-800 dark:text-white flex flex-col items-center justify-center rounded py-2 cursor-pointer text-black font-small hover:bg-green-600 dark:hover:bg-green-600 hover:text-white'>
            <span>Already have account? Login</span>
          </div>

          {/* Guest Modal */}
          {openModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 gap-2">
              <div className="bg-white p-6 rounded-lg shadow-lg w-[350px]">
                <div className='flex flex-row justify-items-start justify-between'>
                  <span className="text-lg ">Guest Credentials</span>
                  <button
                    onClick={handleCloseModal}
                    className=" text-black rounded"
                  >
                    <Close />
                  </button>
                </div>

                <div className="flex flex-col gap-2 mt-5">
                  <span className="font-lexend text-sm">
                    Email:{" "}
                    <span className="text-green-800 font-bold text-lg">{email}</span>
                  </span>
                  <span className="font-lexend text-sm">
                    Password:{" "}
                    <span className="text-green-800 font-bold text-lg">{password}</span>
                  </span>
                </div>
                <div className="flex justify-end gap-2 mt-8">

                  <button onClick={saveUser2} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-blue-700">
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>


      </div>


    </div>
  )
}
