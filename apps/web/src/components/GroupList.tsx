import { useState } from "react";
import { Button, Text, Flex, Stack } from "@mantine/core";
import GroupCard from "./GroupCard";
import { Link } from "react-router-dom";

function GroupList() {
    // Create an array to store groups in
    const [groups, setGroups] = useState([
        {
            id: 1,
            name: "Manda And JP",
            members: [
                { id: 2, display_name: "Manda", avatar_url: "https://i.pravatar.cc/300?rand=1" },
                { id: 1, display_name: "JP", avatar_url: "https://i.pravatar.cc/300?rand=2" },
            ],
        },
        {
            id: 2,
            name: "Da Boyz",
            members: [
                { id: 3, display_name: "John", avatar_url: "https://i.pravatar.cc/300?rand=3" },
                { id: 4, display_name: "Levi", avatar_url: "https://i.pravatar.cc/300?rand=4" },
                { id: 1, display_name: "JP", avatar_url: "https://i.pravatar.cc/300?rand=2" },
            ],
        },
        {
            id: 3,
            name: "The Outcasts",
            members: [
                { id: 5, display_name: "Timothee", avatar_url: "https://i.pravatar.cc/300?rand=6" },
                { id: 6, display_name: "Alexi", avatar_url: "https://i.pravatar.cc/300?rand=7" },
                { id: 7, display_name: "Garret", avatar_url: "https://i.pravatar.cc/300?rand=8" },
                { id: 8, display_name: "Jimbo", avatar_url: "https://i.pravatar.cc/300?rand=9" },
                { id: 1, display_name: "JP", avatar_url: "https://i.pravatar.cc/300?rand=2" },
            ],
        },
    ]);

    return (
        <>
            <Flex w={"100%"} mb={10} align="center" justify="space-between" gap="md">
                <Text size="lg" fw={700}>Your Groups</Text>
                <Button variant="light" size="xs">Create Group</Button>
            </Flex>
            <Stack w={"100%"} h={300} bg="var(--mantine-color-body)" align="stretch" justify="flex-start" gap="xs">
                {/* For each grop create an entry */}
                {groups.map((group) => (
                    <Link to={`/groups/${group.id}`} key={group.id} className="unstyled">
                        <GroupCard group={group} />
                    </Link>
                ))}
            </Stack>
        </>
    );
}

export default GroupList;