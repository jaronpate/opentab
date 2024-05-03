import { useContext } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import { AppContext } from "../main";
import { Box } from "@mantine/core";

function Root() {
    const state = useLoaderData() as ({ user?: any } | undefined);

    if (state) {
        if (state.user) {
            const $ctx = useContext(AppContext);
            $ctx.user = state.user;
        }
    }

    return (
        <>
            <Outlet />
        </>
    );
}

export default Root;
