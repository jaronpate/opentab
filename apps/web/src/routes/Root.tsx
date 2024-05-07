import { AppShell, Burger, Container, Flex, Group, Title, Notification } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { IconArrowLeft } from '@tabler/icons-react';
import { useEffect } from "react";
import { Link, Outlet, useLoaderData, useNavigate } from "react-router-dom";
import AppFooter from "../components/AppFooter";
import { notify, notifyClose } from "../main";
import { useSharedState } from "../store";

function Root() {
    const [burgerOpened, { toggle: burgerToggle }] = useDisclosure();
    const [$state, setState] = useSharedState();
    
    const navigate = useNavigate();
    
    const state = useLoaderData() as ({ user?: any } | undefined);

    useEffect(() => {
        if (state?.user) {
            setState((prev: any) => ({ ...prev, user: state.user }));
        }
    }, [state?.user, setState]);

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
                        <AppFooter user={$state.user} />
                    </Flex>
                </Container>
            </AppShell.Main>

            {$state?.user?.id}

            
            {/* disply notification if notifyopend true */}
            {$state.notify.opened && <Notification
                title={$state.notify.title}
                color={$state.notify.color}
                onClose={() => notifyClose([$state, setState])}
                withCloseButton
                style={{ position: 'fixed', bottom: 10, right: 10 }}>
                    {$state.notify.text}
                </Notification>
            }
        </AppShell>
    );
}

export default Root;
