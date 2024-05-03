import { useContext, useState } from "react";
import GroupList from "../components/GroupList";
import { Avatar, Text, Container, Flex, Title } from "@mantine/core";
import { AppContext } from "../main";

function Groups() {
    const $ctx = useContext(AppContext);

    return (
        <>
            <Container size="sm" h={'100%'}>
                <Title order={1} mt={10} mb={15} ml={0}>OpenTab</Title>
                {/* <GroupList /> */}
                <Flex w={"100%"} align="center" direction="column" h={'100%'}>
                    {$ctx.user ? <GroupList /> : <p>Log in to see your groups</p>}
                    {/* user profile */}
                    <div style={{ flex: 1 }}></div>
                    <Flex w={"100%"} mt={10} align="center" direction="row">
                        <Avatar size="md" src={$ctx.user?.profile_picture} mr={15} />
                        <Flex direction="column">
                            <Text fw={600} size="md" lh={1}>{$ctx.user?.first_name} {$ctx.user?.last_name}</Text>
                            <Text size="sm" >{$ctx.user?.email}</Text>
                        </Flex>
                    </Flex>
                </Flex>
            </Container>
        </>
    );
}

export default Groups;
