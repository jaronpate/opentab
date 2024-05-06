import { Button, Drawer, Flex, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import { Form, useActionData, useLoaderData } from "react-router-dom";
import GroupList from "../components/GroupList";

function Groups() {
    const [opened, { open, close }] = useDisclosure(false);

    const { groups } = useLoaderData() as any;

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

    // Close the drawer when the form is submitted
    const response = useActionData() as ({ group?: Record<string, any> } | undefined);

    useEffect(() => {
        if (response?.group) {
            close();
        }
    }, [response, close]);

    return (
        <>
            <Flex w={"100%"} align="center" direction="column" h={'100%'}>
                <Flex w={"100%"} mb={10} align="center" justify="space-between" gap="md">
                    <Text size="lg" fw={700}>Your Groups</Text>
                    <Button variant="light" size="xs" onClick={open}>Create Group</Button>
                </Flex>
                
                <GroupList groups={groups} />
            
                <Drawer
                    offset={8}
                    radius="md"
                    opened={opened}
                    onClose={close}
                    title="Create New Group"
                    overlayProps={{ backgroundOpacity: 0.3, blur: 2 }}
                    style={{ borderRadius: 3 }}
                >
                    <Form method='post'>
                        <TextInput
                            label="Name"
                            name='name'
                            placeholder="a gaggle of geese"
                            key={form.key('name')}
                            {...form.getInputProps('name')}
                            mb="sm"
                            autoComplete="false"
                        />
                        <Button type="submit" size='xs'>Create</Button>
                    </Form>
                </Drawer>
            </Flex>
        </>
    );
}

export default Groups;
