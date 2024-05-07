import { Flex, Group, Stack, Text } from "@mantine/core";
import Decimal from "decimal.js";
import { useSharedState } from "../store";

function ExpensesList({ group, expenses }: { group: any, expenses: any[] }) {
    const [$state, _] = useSharedState();
    
    return (
        <>
            <Stack w={"100%"} h={300} bg="var(--mantine-color-body)" align="stretch" justify="flex-start" gap="xs" mt={15}>
                {expenses.map((expense: any) => {
                    const date = new Date(expense.created_at);
                    const month = date.toLocaleString('default', { month: 'long' });
                    const day = date.getDate();

                    const payee = group.members.find((member: any) => member.id === expense.payee_id);
                    const payee_name = (() => {
                        if (payee) {
                            if (payee.id === $state.user!.id) {
                                return 'You';
                            } else if (payee.first_name) {
                                return payee.first_name;
                            } else {
                                return payee.email;
                            }
                        } else {
                            return '';
                        }
                    })();

                    const total = new Decimal(expense.subtotal).add(expense.tax);
                    const my_split = expense.split[$state.user!.id];

                    const my_share = (() => {
                        if (payee.id === $state.user!.id) {
                            return '0.00';
                        } else if (my_split.fixed) {
                            // fixed amount to deduct
                            return new Decimal(my_split.fixed).toFixed(2);
                        } else if (my_split.percent) {
                            // percentage to deduct
                            const percent = new Decimal(my_split.percent).div(100);
                            return total.mul(percent).toFixed(2);
                        }
                    })();

                    const formatted_total = total.toFixed(2);

                    return (
                        <Group key={expense.id}>
                            <Flex direction="column" align="center">
                                <Text fw={600}>{month}</Text>
                                <Text>{day}</Text>
                            </Flex>
                            <Text>{expense.name}</Text>
                            <div style={{ flex: 1 }}></div>
                            <Flex direction="column" align="flex-end">
                                <Text fw={600}>{`${payee_name} Paid`.trim()}</Text>
                                <Text>${formatted_total}</Text>
                            </Flex>
                            <Flex direction="column" align="flex-end">
                                <Text fw={600}>You Owe</Text>
                                <Text>${my_share}</Text>
                            </Flex>
                        </Group>
                    )
                })}
            </Stack>
        </>
    );
}

export default ExpensesList;