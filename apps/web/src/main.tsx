import '@mantine/core/styles.css';
import './App.less';

import React, { createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  redirect
} from "react-router-dom";

import Root from './routes/Root';
import NotFound from './routes/NotFound';
import Login from './routes/auth/Login';
import Groups from './routes/Groups';

import { createTheme, MantineColorsTuple, MantineProvider } from "@mantine/core";

import ky from 'ky';
import { TokenSet } from '@fishhat/db';

const api = ky.create({
  prefixUrl: `${import.meta.env.DEV ? "/api" : "https://api.opentab.dev"}`,
  hooks: {
    beforeRequest: [
      async (request) => {
        const token_set = localStorage.getItem("opentab-token");
        if (token_set) {
          try {
            const token: TokenSet = JSON.parse(token_set);
            request.headers.set("Authorization", `Bearer ${token.access_token}`);
          } catch (error) {
            console.error(error);
          }
        }
      },
    ],
  },
});

const AppContext = createContext({})

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/login",
        element: <Login />,
        action: async ({ request }) => {
          // const $ctx = useContext(AppContext);
          
          let formData = await request.formData();

          const data = {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
          }

          const token_set: TokenSet = await api.post("auth/login", { json: data }).json();

          localStorage.setItem("opentab-token", JSON.stringify(token_set));

          return redirect("/groups");
        },
      },
      // {
      //   path: "/register",
      //   element: <Register />,
      // },
      {
        path: "/groups",
        element: <Groups />,
      },
      // {
      //   path: "/groups/:groupId",
      //   element: <GroupOverview />,
      // }
    ],
  },
]);

const primary: MantineColorsTuple = [
  '#eefcfa',
  '#def6f3',
  '#b6eee7',
  '#8ce6da',
  '#6dded0',
  '#5adbca',
  '#4fd9c6',
  '#40c0af',
  '#33ab9b',
  '#199485'
];

const openTabTheme = createTheme({
    colors: { primary },
    fontFamily: 'Montserrat, sans-serif',
    primaryColor: 'primary',
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme='dark' theme={openTabTheme}>
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>,
)

export { AppContext };
