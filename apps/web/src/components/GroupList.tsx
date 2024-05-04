import { useState } from "react";
import { Button, Text, Flex, Stack, Drawer, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import GroupCard from "./GroupCard";
import { Form, Link, useLoaderData } from "react-router-dom";
import { useForm } from "@mantine/form";

function GroupList({ groups }: { groups: any[] }) {
    return (
        <>
            <Stack w={"100%"} h={300} bg="var(--mantine-color-body)" align="stretch" justify="flex-start" gap="xs">
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