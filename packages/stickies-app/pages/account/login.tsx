import {
  Button,
  Container,
  Grid,
  Group,
  Space,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import Head from "next/head";
import { useRouter } from "next/router";
import Cookies from "cookies";
import { useForm } from "@mantine/form";
import UserMenu from "app/UserMenu";
import { queryFromObj } from "app/string";
import { externalApi } from "app/api";

export function getServerSideProps({ req, res, query }) {
  const { magic } = query;

  if (magic) {
    const cookies = new Cookies(req, res);
    cookies.set("Authorization", `Bearer ${magic}`);
    console.log(query.return);
    res.writeHead("302", {
      Location: query.return ? decodeURIComponent(query.return) : "/",
    });
    res.end();
    return true;
  }

  return { props: {} };
}

export default function Login(props) {
  const { query } = useRouter();
  const { sent } = query;
  const form = useForm({ initialValues: { password: "", email: "" } });

  return (
    <>
      <Head>
        <title>Stickies Login</title>
      </Head>
      <Stack m="md">
        <Grid justify="space-between">
          <Group>
            <Title>Login</Title>
          </Group>
          <Group>
            <UserMenu />
          </Group>
        </Grid>

        <Container>
          {sent ? (
            <Text>Check your email for a login link</Text>
          ) : (
            <form action={externalApi.url('/accounts').query(query)._url} method="post">
              <TextInput name="email" label="Email" />
              <Group position="right" mt="md">
                <Button type="submit">Email Magic Link</Button>
              </Group>
            </form>
          )}
        </Container>
      </Stack>
    </>
  );
}
