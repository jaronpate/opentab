import { Avatar, Text, Container, Flex, Title, Tooltip } from "@mantine/core";
import { useLoaderData } from "react-router-dom";

function GroupOverview() {
    const { group } = useLoaderData() as { group: any };
    return (
        <>
            <Flex justify="flex-start" align="center" direction="row" w={"100%"}>
                <Avatar size='lg' src={group.icon} alt={group.name} mr={10} />
                <Title order={3} mt={10} mb={5}>{group.name}</Title>
                <Text size="xl" fw={500}>{group.description}</Text>
                <div style={{ flex: 1 }}></div>
                
                <Avatar.Group spacing="sm">
                    {/* For each member create an avatar in the stack */}
                    {group.members.map((member: Record<string, any>) => (
                        <Tooltip label={member?.first_name ? `${member.first_name} ${member.last_name}`.trim() : member.email} withArrow key={member.id}>
                            <Avatar src={member.profile_picture} radius="xl" />
                        </Tooltip>
                    ))}
                </Avatar.Group>
            </Flex>
        </>
    );
}

export default GroupOverview;
