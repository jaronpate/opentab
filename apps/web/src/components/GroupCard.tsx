import { Avatar, Box, Text, Flex, Tooltip, Button } from "@mantine/core";

function GroupCard({ group, invite = false }: { group: Record<string, any>, invite?: boolean}) {
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
                    <Avatar size="md" src={group.icon} />
                    <Text size="md" fw={500}>{group.name}</Text>
                    <div style={{ flexGrow: 1 }} />
                    <Tooltip.Group openDelay={300} closeDelay={100}>
                    <Avatar.Group spacing="sm">
                        {/* For each member create an avatar in the stack */}
                        {!invite && group.members.map((member: Record<string, any>) => (
                            <Tooltip label={member?.first_name ? `${member.first_name} ${member.last_name ?? ''}`.trim() : member.email} withArrow key={member.id}>
                                <Avatar src={member.profile_picture} radius="xl" />
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
                    {invite && <Button size="xs"> Join </Button>}
                </Flex>
            </Box>
        </>
    );
}

export default GroupCard;
