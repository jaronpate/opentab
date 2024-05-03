import { TextInput, Checkbox, Button, Group, Box, PasswordInput, Flex, Text, Title, Container } from '@mantine/core';
import { useForm, isEmail } from '@mantine/form';
import { Form, useActionData } from 'react-router-dom'

function Login() {
  const errors = useActionData() as ({ email?: boolean, password?: boolean } | undefined);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
      termsOfService: false,
    },

    validate: {
      email: isEmail('Invalid email'),
      password: (value) => value.length < 6 && 'Password is too short',
    },
  });

  return (
    <Container size="30rem">
        <Flex h='100vh' justify="center" direction="column">
            <Flex justify="center" align="flex-start" direction="column" mb={25}>
                <Title order={1} mt={10} mb={5} ml={0}>OpenTab</Title>
                <Text size="xl" fw={500}>Login</Text>
            </Flex>
            <Box w={"100%"}>
                <Form style={{ minWidth: "330px" }} method='post'>
                    <TextInput
                    label="Email"
                    name='email'
                    placeholder="you@fishhat.dev"
                    key={form.key('email')}
                    {...form.getInputProps('email')}
                    mb="sm"
                    error={errors?.email}
                    />

                    <PasswordInput
                        label="Password"
                        name='password'
                        placeholder="something long and secure" 
                        key={form.key('password')}
                        {...form.getInputProps('password')}
                        error={errors?.password}
                    />

                    {/* <Checkbox
                    mt="md"
                    label="I agree to sell my privacy"
                    name='termsOfService'
                    key={form.key('termsOfService')}
                    {...form.getInputProps('termsOfService', { type: 'checkbox' })}
                    /> */}

                    <Group justify="flex-end" mt="md">
                    <Button type="submit" size='xs'>Login</Button>
                    </Group>
                </Form>
            </Box>
        </Flex>
    </Container>
  );
}

export default Login;