import { Stack } from "@mantine/core";
import { Link } from "react-router-dom";
import GroupCard from "./GroupCard";

function GroupList({ groups }: { groups: any[] }) {
    return (
        <>
            <Stack w={"100%"} mb={25} bg="var(--mantine-color-body)" align="stretch" justify="flex-start" gap="xs">
                {groups.map((group: any) => (
                    <Link to={`/groups/${group.id}`} key={group.id} className="unstyled">
                        <GroupCard group={group} />
                    </Link>
                ))}
            </Stack>
        </>
    );
}

export default GroupList;