import '@mantine/core/styles.css';
import './App.less';

import React, { createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
  json
} from "react-router-dom";

import Root from './routes/Root';
import NotFound from './routes/NotFound';
import Login from './routes/auth/Login';
import Groups from './routes/Groups';
import GroupOverview from './routes/GroupOverview';

import { createTheme, MantineColorsTuple, MantineProvider } from "@mantine/core";

import ky from 'ky';
// import { TokenSet, User } from '@fishhat/db';

export type TokenSet = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
};

export type User = {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  profile_picture?: string;
};

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

const AppContext = createContext<{ user?: User }>({})

const loadUser = async () => {  
  try {
    const raw_token_set = localStorage.getItem("opentab-token");
 
    if (!raw_token_set) {
      return redirect("/login");
    }

    const token_set: TokenSet = JSON.parse(raw_token_set);

    const raw_user_response: { $data: User } = await api.get("v1/me", {
      headers: {
        Authorization: `Bearer ${token_set.access_token}`,
      }
    }).json();
  
    const { $data: raw_user } = raw_user_response;

    return { user: raw_user as User };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to load user");
  }
}


const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    action: async ({ request }) => {
      let formData = await request.formData();

      const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      }

      try {
        const token_set: TokenSet = await api.post("auth/login", { json: data }).json();
        localStorage.setItem("opentab-token", JSON.stringify(token_set));
      } catch (error) {
        return json({ email: true, password: true });
      }

      return redirect("/groups");
    },
  },
  // {
  //   path: "/register",
  //   element: <Register />,
  // },
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFound />,
    loader: loadUser,
    children: [
      {
        path: "/groups",
        element: <Groups />,
        loader: async () => {
          const raw_groups_response: { $data: Record<string, any>[] } = await api.get("v1/groups").json();
          const { $data: raw_groups } = raw_groups_response;
          return { groups: raw_groups };
        }
      },
      {
        path: "/groups/:group_id",
        element: <GroupOverview />,
        loader: async ({ params }) => {
          const raw_group_response: { $data: Record<string, any> } = await api.get(`v1/groups/${params.group_id}`).json();
          const { $data: raw_group } = raw_group_response;
          const raw_expenses_response: { $data: Record<string, any>[] } = await api.get(`v1/groups/${params.group_id}/expenses`).json();
          const { $data: raw_expenses } = raw_expenses_response;
          return { group: raw_group, expenses: raw_expenses};
        }
      }
    ],
  }
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
