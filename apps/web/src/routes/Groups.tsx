import { useState } from "react";
import GroupList from "../components/GroupList";
import { Container, Title } from "@mantine/core";

function Groups() {
    return (
        <>
            <Container size="sm">
                <Title order={1} mt={10} mb={15} ml={0}>OpenTab</Title>
                <GroupList />
            </Container>
        </>
    );
}

export default Groups;
