import { Avatar, Flex, Text } from "@mantine/core";
import { IconSettings } from '@tabler/icons-react';
import { Link } from "react-router-dom";

function AppFooter({ user }: { user: Record<string, any> }) {
    return (
        <Flex w={"100%"} mt={10} align="center" direction="row">
            <Avatar size="md" src={user?.profile_picture} mr={15} />
            <Flex direction="column">
                <Text fw={600} size="md" lh={1}>{user?.first_name} {user?.last_name ?? ''}</Text>
                <Text size="sm" >{user?.email}</Text>
            </Flex>
            <div style={{ flex: 1 }}></div>
            <Link to={`/settings`} className="unstyled">
                <IconSettings color="var(--mantine-color-text)" size={24} style={{ cursor: 'pointer' }} />
            </Link>
        </Flex>
    );
}

export default AppFooter;
