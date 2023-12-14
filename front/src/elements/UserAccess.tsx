import {
	Button,
	Divider,
	Group,
	PasswordInput,
	Stack,
	TextInput,
	Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { getKeywords, setKeywords } from "../services/user.api";
import SearchBar from "./News/SearchBar";

const UserAccess: React.FC = () => {
	const [newsKeyWords, setNewsKeyWords] = useState<string[]>([]);

	useEffect(() => {
		getKeywords().then((res) => setNewsKeyWords(res.data));
	}, []);

	const formUser = useForm({
		initialValues: {
			email: "",
			password: "",
			keywords: "",
		},
		validate: {
			email: (value) => (value.length > 0 ? null : "Invalid email"),
			password: (value) => (value.length > 0 ? null : "Invalid password"),
			keywords: (value) => (value.length > 0 ? null : "Invalid Keyword"),
		},
	});

	const saveNewsKeyWords = () => {
		setKeywords(newsKeyWords);
	};

	return (
		<Stack
			w="100%"
			h="100%"
			mx="auto"
			gap={20}
			className="items-center justify-center"
		>
			<Title order={1}>User Account</Title>

			<Divider
				w="100%"
				my={5}
				maw={300}
				label={"Do you want to change your email?"}
			/>

			<form onSubmit={formUser.onSubmit((values) => console.log(values))}>
				<TextInput
					withAsterisk
					label="Email"
					placeholder="your@email.com"
					{...formUser.getInputProps("email")}
				/>

				<Group justify="center" mt="md">
					<Button type="submit">Change my email</Button>
				</Group>
			</form>

			<Divider
				w="100%"
				my={5}
				maw={300}
				label={"Do you want to change your password?"}
			/>

			<form onSubmit={formUser.onSubmit((values) => console.log(values))}>
				<PasswordInput
					withAsterisk
					label="Password"
					placeholder="Password"
					{...formUser.getInputProps("password")}
				/>

				<Group justify="center" mt="md">
					<Button type="submit">Change my password</Button>
				</Group>
			</form>

			<div className="flex items-center flex-col">
				<Divider
					w="100%"
					my={5}
					maw={300}
					label={"Do you want to change your keywords?"}
				/>
				<div className="flex justify-center flex-col">
					<SearchBar
						data={newsKeyWords}
						onChange={(e) => setNewsKeyWords(e)}
					/>
					<div className="flex justify-center m-5">
						<Button onClick={saveNewsKeyWords}>Save</Button>
					</div>
				</div>
			</div>
		</Stack>
	);
};
export default UserAccess;
