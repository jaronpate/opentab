import { useContext } from "react";
import GroupList from "../components/GroupList";
import { Flex } from "@mantine/core";
import { AppContext } from "../main";

function Groups() {
    return (
        <>
            <Flex w={"100%"} align="center" direction="column" h={'100%'}>
                <GroupList />
            </Flex>
        </>
    );
}

export default Groups;
