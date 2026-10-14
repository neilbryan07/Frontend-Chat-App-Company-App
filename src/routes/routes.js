import React from "react";
import { Navigate } from "react-router-dom";

import { LoginPage } from "../pages/auth/LoginPage";
import MessagePage from "../pages/message/MessagePage";
import ChannelPage from "../pages/channel/ChannelPage";

import { pageRoutes } from "./pageRoutes";
import MessageDummy from "../pages/message/MessageDummy";

import { Splash } from "../pages/auth/Splash";
import { RegisterPage } from "../pages/auth/RegisterPage";
import ForgotPassword from "../pages/auth/ForgotPassword";

const routes = [
  {
    path: "app",
    element: null,
    children: [{ path: null, element: null }],
  },
  {
    path: "/",
    children: [
      { path: pageRoutes.LOGIN, element: <LoginPage /> },
      { path: pageRoutes.FORGOTPASS, element: <ForgotPassword /> },
      { path: pageRoutes.REGISTER, element: <RegisterPage /> },
      { path: pageRoutes.SPLASH, element: <Splash /> },
      { path: pageRoutes.MESSAGE, element: <MessagePage /> },
      { path: pageRoutes.CHANNEL, element: <ChannelPage /> },
      { path: pageRoutes.MESSAGEDUMMY, element: <MessageDummy /> },
      { path: "*", element: <Navigate to="/404" /> },
    ],
  },
];

export default routes;
