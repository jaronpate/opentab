import { useState } from "react";
import { Button, Text, Flex, Stack, Drawer, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import GroupCard from "./GroupCard";
import { Form, Link, useLoaderData } from "react-router-dom";
import { useForm } from "@mantine/form";

function GroupList() {
    const { groups } = useLoaderData() as any;
    const [opened, { open, close }] = useDisclosure(false);

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
          name: '',
          icon: ''
        },
    
        validate: {
            name: (value) => value.length < 3 && 'Name is too short',
        },
    });

    return (
        <>
            <Flex w={"100%"} mb={10} align="center" justify="space-between" gap="md">
                <Text size="lg" fw={700}>Your Groups</Text>
                <Button variant="light" size="xs" onClick={open}>Create Group</Button>
            </Flex>
            <Stack w={"100%"} h={300} bg="var(--mantine-color-body)" align="stretch" justify="flex-start" gap="xs">
                {groups.map((group: any) => (
                    <Link to={`/groups/${group.id}`} key={group.id} className="unstyled">
                        <GroupCard group={group} />
                    </Link>
                ))}
            </Stack>
            
            <Drawer
                offset={8}
                radius="md"
                opened={opened}
                onClose={close}
                title="Create New Group"
                overlayProps={{ backgroundOpacity: 0.3, blur: 2 }}
                style={{ borderRadius: 3 }}
            >
                <Form>
                    <TextInput
                        label="Name"
                        name='name'
                        placeholder="a gaggle of geese"
                        key={form.key('name')}
                        {...form.getInputProps('name')}
                        mb="sm"
                    />
                    <Button type="submit" size='xs'>Create</Button>
                </Form>
            </Drawer>
        </>
    );
}

export default GroupList;