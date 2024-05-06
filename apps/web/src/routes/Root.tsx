import { useContext } from "react";
import { Link, Outlet, useLoaderData, useNavigate } from "react-router-dom";
import { AppContext, NotifyContext, notifyClose } from "../main";
import { useDisclosure } from '@mantine/hooks';
import { AppShell, Avatar, Text, Burger, Container, Flex, Group, Title, Notification } from "@mantine/core";
import { IconArrowLeft, IconSettings } from '@tabler/icons-react';

function Root() {
    const [burgerOpened, { toggle: burgerToggle }] = useDisclosure();

    const state = useLoaderData() as ({ user?: any } | undefined);
    const $ctx = useContext(AppContext);
    const $notify = useContext(NotifyContext);

    const navigate = useNavigate();

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !burgerOpened } }}
        >
            <AppShell.Header withBorder={false}>
                <Container size="sm" px={10}>
                    <Group h="100%">
                        <IconArrowLeft color="var(--mantine-color-text)" size={24} style={{ cursor: 'pointer' }} onClick={() => navigate(-1)} />
                        <div style={{ flex: 1 }}></div>
                        <Link to="/groups" className="unstyled">
                            <Title order={1} mt={10} mb={15} ml={0}>OpenTab</Title>
                        </Link>
                        <div style={{ flex: 1 }}></div>
                        {/* <Group justify="space-between" style={{ flex: 1 }}>
                            <Group ml="xl" gap={0} visibleFrom="sm">
                                <UnstyledButton py='xs' px='md'>About</UnstyledButton>
                                <UnstyledButton py='xs' px='md'>Support</UnstyledButton>
                            </Group>
                        </Group> */}
                        <Burger opened={burgerOpened} onClick={burgerToggle} size="sm" />
                    </Group>
                </Container>
            </AppShell.Header>

            <AppShell.Navbar py="md" px={4} withBorder={false}>
                {/* <UnstyledButton py='xs' px='md'>About</UnstyledButton>
                <UnstyledButton py='xs' px='md'>Support</UnstyledButton> */}
            </AppShell.Navbar>
            
            <AppShell.Main h='100dvh'>
                <Container size="sm" p={10} h={'100%'}>
                    <Flex w={"100%"} align="center" direction="column" h={'100%'}>
                        <Outlet />
                        <div style={{ flex: 1 }}></div>
                        <Flex w={"100%"} mt={10} align="center" direction="row">
                            <Avatar size="md" src={$ctx.user?.profile_picture} mr={15} />
                            <Flex direction="column">
                                <Text fw={600} size="md" lh={1}>{$ctx.user?.first_name} {$ctx.user?.last_name ?? ''}</Text>
                                <Text size="sm" >{$ctx.user?.email}</Text>
                            </Flex>
                            <div style={{ flex: 1 }}></div>
                            <Link to={`/settings`} className="unstyled">
                                <IconSettings color="var(--mantine-color-text)" size={24} style={{ cursor: 'pointer' }} />
                            </Link>
                        </Flex>
                    </Flex>
                </Container>
            </AppShell.Main>

            
            {/* disply notification if notifyopend true */}
            {$notify.opened && <Notification
                title={$notify.data.title}
                color={$notify.data.color}
                onClose={() => notifyClose($notify)}
                withCloseButton
                style={{ position: 'fixed', bottom: 10, right: 10 }}>
                    {$notify.data.text}
                </Notification>
            }
        </AppShell>
    );
}

export default Root;
