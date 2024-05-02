import { Link } from "react-router-dom";
import { Flex, Title } from "@mantine/core";

function NotFound() {
    return (
        <>
            <Flex style={{ height: "100vh" }} direction="column" align="center" justify="center" gap="xs">
                <Title>Oops, page not found (404)</Title>
                <Link to="/">Back home</Link>
            </Flex>
        </>
    );
}

export default NotFound;
