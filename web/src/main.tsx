import '@mantine/core/styles.css';
import './App.less';

import React, { createContext } from 'react';
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/login",
        element: <Login />,
        action: async ({ params, request }) => {
          let formData = await request.formData();
          console.log("formData", formData.get("email"), formData.get("password"))
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

const AppContext = createContext({})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={openTabTheme}>
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>,
)

export { AppContext };
