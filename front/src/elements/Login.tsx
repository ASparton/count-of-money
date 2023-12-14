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
import { login } from "../services/auth.api";
import { useUserStore } from "../stores/User.store";
import OAuth from "./OAuthGoogle/OAuth";
const envVars = import.meta.env;

const Login: React.FC = () => {
	const navigator = useNavigate();
	const userStore = useUserStore();
	const isDevEnv = envVars.VITE_ENV === "DEV";

	const form = useForm({
		initialValues: {
			email: isDevEnv ? "d@d.com" : "",
			password: isDevEnv ? "d" : "",
		},

		validate: {
			email: (value) => (value.length > 0 ? null : "Invalid email"),
			password: (value) => (value.length > 0 ? null : "Invalid password"),
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
			<Title order={4}>Please Log In</Title>

			<Divider
				w="100%"
				my={10}
				maw={300}
				label={"Use an google account"}
			/>

			<OAuth />

			<Divider w="100%" my={10} maw={300} label={"Or use your account"} />

			<form
				onSubmit={form.onSubmit((values) => {
					login(values).then((res) => {
						userStore.create({
							...res.data.user,
							isAdmin: res.data.user.is_admin,
							token: res.data.token,
						});
						navigator("/auth/home");
					});
				})}
			>
				<Stack gap="xl">
					<TextInput
						withAsterisk
						label="Email"
						placeholder="your@email.com"
						{...form.getInputProps("email")}
					/>

					<PasswordInput
						withAsterisk
						label="Password"
						placeholder="Password"
						{...form.getInputProps("password")}
					/>

					<Group justify="center" mt="md">
						<Button type="submit">Log in</Button>
					</Group>
				</Stack>
			</form>
			<Divider
				w="100%"
				my={10}
				maw={300}
				label={
					<Text component={Link} to="/public/register">
						{"Doesn't have an account ? Create yours"}
					</Text>
				}
			/>
		</Stack>
	);
};

export default Login;
