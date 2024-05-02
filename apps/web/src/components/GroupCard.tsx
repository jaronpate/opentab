import { useState } from "react";
import { Avatar, Box, Text, Flex, Tooltip } from "@mantine/core";
import { useHover } from '@mantine/hooks';

function GroupCard({ group }: { group: Record<string, any> }) {
    // Create an array to store groups in

    return (
        <>
            <Box key={group.id}>
                <Flex
                    mih={50}
                    px={8}
                    py={6}
                    gap="xs"
                    justify="flex-start"
                    align="center"
                    direction="row"
                    wrap="nowrap"
                    className="group-card"
                >
                    {/* <Avatar size="md" /> */}
                    <Text size="md" fw={500} ml={5}>{group.name}</Text>
                    <div style={{ flexGrow: 1 }} />
                    <Tooltip.Group openDelay={300} closeDelay={100}>
                    <Avatar.Group spacing="sm">
                        {/* For each member create an avatar in the stack */}
                        {group.members.map((member: Record<string, any>) => (
                            <Tooltip label={member.display_name} withArrow key={member.id}>
                                <Avatar src={member.avatar_url} radius="xl" />
                            </Tooltip>
                        ))}
                        {/* <Tooltip
                        withArrow
                        label={
                            <>
                            <div>John Outcast</div>
                            <div>Levi Capitan</div>
                            </>
                        }
                        >
                            <Avatar radius="xl">+2</Avatar>
                        </Tooltip> */}
                    </Avatar.Group>
                    </Tooltip.Group>
                </Flex>
            </Box>
        </>
    );
}

export default GroupCard;
