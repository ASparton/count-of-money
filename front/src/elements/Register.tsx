import {
  Button,
  Divider,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/auth.api";
import { useUserStore } from "../stores/User.store";
import OAuth from "./OAuthGoogle/OAuth";

const envVars = import.meta.env;

const Register: React.FC = () => {
  const navigator = useNavigate();
  const userStore = useUserStore();
  const isDevEnv = envVars.VITE_ENV === "DEV";

  const form = useForm({
    initialValues: {
      email: isDevEnv ? "b@b.com" : "",
      username: isDevEnv ? "b" : "",
      password: isDevEnv ? "b" : "",
      confirmPassword: isDevEnv ? "b" : "",
    },

    validate: {
      email: (value) => (value.length > 0 ? null : "Invalid email"),
      username: (value) => (value.length > 0 ? null : "Invalid username"),
      password: (value) => (value.length > 0 ? null : "Invalid password"),
      confirmPassword: (value, values) =>
        value === values.password ? null : "Invalid passwords",
    },
  });

  return (
    <Stack
      w="100%"
      h="100%"
      mx="auto"
      gap={20}
      className="items-center justify-center"
    >
      <Title order={1}>Access to your dashboard</Title>
      <Title order={4}>Please Register</Title>

      <Divider w="100%" my={10} maw={300} label={"Use an google account"} />

      <OAuth />

      <Divider w="100%" my={10} maw={300} label={"Or use your account"} />

      <form
        onSubmit={form.onSubmit((values) => {
          register(values).then((res) => {
            userStore.create({
              ...res.data.user,
              isAdmin: res.data.user.is_admin,
              token: res.data.token,
            });
            navigator("/auth/home");
          });
        })}
      >
        <Stack gap="xl" mb="xl">
          <TextInput
            withAsterisk
            label="Email"
            placeholder="your@email.com"
            {...form.getInputProps("email")}
          />
          <TextInput
            withAsterisk
            label="Username"
            placeholder="myUserName"
            {...form.getInputProps("username")}
          />

          <PasswordInput
            withAsterisk
            label="Password"
            placeholder="Password"
            {...form.getInputProps("password")}
          />
          <PasswordInput
            withAsterisk
            label="Password Confirmation"
            placeholder="Confirmation"
            {...form.getInputProps("confirmPassword")}
          />
          <Group justify="center">
            <Button type="submit">Register</Button>
          </Group>
        </Stack>
      </form>

      <Divider
        w="100%"
        my={10}
        maw={300}
        label={
          <Text component={Link} to="/public/login">
            {"Already have an account ? Log in !"}
          </Text>
        }
      />
    </Stack>
  );
};

export default Register;
