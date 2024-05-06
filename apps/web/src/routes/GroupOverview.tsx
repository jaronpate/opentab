import { useLoaderData } from "react-router-dom";
import GroupTitle from "../components/GroupTitle";
import ExpensesList from "../components/ExpensesList";

function GroupOverview() {
    const { group, expenses } = useLoaderData() as { group: any, expenses: any[]};
    return (
        <>
            <GroupTitle group={group} />
            <ExpensesList group={group} expenses={expenses} />
        </>
    );
}

export default GroupOverview;
