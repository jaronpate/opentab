import { useContext } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import { AppContext } from "../main";
import { useDisclosure } from '@mantine/hooks';
import { AppShell, Avatar, Text, Burger, Container, Flex, Group, Title } from "@mantine/core";

function Root() {
    const [opened, { toggle }] = useDisclosure();

    const state = useLoaderData() as ({ user?: any } | undefined);
    const $ctx = useContext(AppContext);

    if (state) {
        if (state.user) {
            $ctx.user = state.user;
        }
    }

    return (

        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
        >
            <AppShell.Header withBorder={false}>
                <Container size="sm" px={10}>
                    <Group h="100%">
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                        <Group justify="space-between" style={{ flex: 1 }}>
                        <Title order={1} mt={10} mb={15} ml={0}>OpenTab</Title>
                        <Group ml="xl" gap={0} visibleFrom="sm">
                            {/* <UnstyledButton py='xs' px='md'>About</UnstyledButton>
                            <UnstyledButton py='xs' px='md'>Support</UnstyledButton> */}
                        </Group>
                        </Group>
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
                                <Text fw={600} size="md" lh={1}>{$ctx.user?.first_name} {$ctx.user?.last_name}</Text>
                                <Text size="sm" >{$ctx.user?.email}</Text>
                            </Flex>
                        </Flex>
                    </Flex>
                </Container>
            </AppShell.Main>
        </AppShell>
    );
}

export default Root;
