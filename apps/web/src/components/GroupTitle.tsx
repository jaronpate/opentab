import { Avatar, Text, Flex, Title, Tooltip, Button, ActionIcon, Drawer, TextInput } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconLogout, IconPlus, IconQuestionMark } from "@tabler/icons-react";
import { useContext, useEffect } from "react";
import { Form, useActionData } from "react-router-dom";
import { NotifyContext, notify } from "../main";
import { useSharedState } from "../store";

function GroupTitle({ group }: { group: Record<string, any> }) {    
    const [opened, { open, close }] = useDisclosure(false);
    const $state = useSharedState();

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            email: ''
        },
    
        validate: {
            email: isEmail() || 'Please enter a valid email address',
        },
    });

    const response = useActionData() as ({ invite?: boolean } | undefined);

    useEffect(() => {        
        if (response?.invite) {
            close();
            notify($state, 'Invitation sent', 'The invitation has been sent to the new member', 'teal')
        }
    }, [response, close]);

    return (
        <>
            <Flex justify="flex-start" align="center" direction="row" w={"100%"}>
                <Avatar size='lg' src={group.icon} alt={group.name} mr={10} />
                <Title order={3} mt={10} mb={5}>{group.name}</Title>
                <Text size="xl" fw={500}>{group.description}</Text>
                <div style={{ flex: 1 }}></div>
                
                <Avatar.Group spacing="sm">
                    {/* For each member create an avatar in the stack */}
                    {group.members.map((member: Record<string, any>) => {
                        const display_name = member?.first_name ? `${member.first_name} ${member.last_name ?? ''}`.trim() : member.email;

                        if (member.membership.status === 'pending') {
                            return (
                                <Tooltip label={`${display_name} (Pending)`} withArrow key={member.id}>
                                    <Avatar src={null} alt={`${display_name} (Pending)`}>
                                        <IconQuestionMark style={{ width: '75%', height: '75%' }} stroke={1.5} />
                                    </Avatar>
                                </Tooltip>
                            )
                        } else {
                            return (
                                <Tooltip label={display_name} withArrow key={member.id}>
                                    <Avatar src={member.profile_picture} alt={display_name} />
                                </Tooltip>
                            )
                        }
                    })}
                </Avatar.Group>
                
                <Tooltip label="Invite Member" withArrow>
                    <ActionIcon variant="filled" aria-label="Settings" ml={4} onClick={open}>
                        <IconPlus style={{ width: '75%', height: '75%' }} stroke={1.5} />
                    </ActionIcon>
                </Tooltip>

                <Tooltip label="Leave Group" withArrow>
                    <ActionIcon variant="filled" aria-label="Settings" ml={6}>
                        <IconLogout style={{ width: '75%', height: '75%' }} stroke={1.5} />
                    </ActionIcon>
                </Tooltip>
            
                <Drawer
                    offset={8}
                    radius="md"
                    opened={opened}
                    onClose={close}
                    title="Invite New Member"
                    overlayProps={{ backgroundOpacity: 0.3, blur: 2 }}
                    style={{ borderRadius: 3 }}
                >
                    <Form method='post'>
                        <TextInput
                            label="Email"
                            name='email'
                            placeholder="joe@shmoe.com"
                            key={form.key('name')}
                            {...form.getInputProps('name')}
                            mb="sm"
                            autoComplete="false"
                        />
                        <Button type="submit" size='xs' name="intent" value="invite">Invite</Button>
                    </Form>
                </Drawer>
            </Flex>
        </>
    );
}

export default GroupTitle;
