import { Box, Button, Container, Group } from "@mantine/core";
import { Link } from "react-router-dom";
import HeaderUser from "./HeaderLogin";

const NavBar: React.FC = () => {
	return (
		<div className="fixed top-0 left-0 w-full z-10">
			<Container>
				<Box bg="#1A1B1E">
					<Group className="p-3 justify-between">
						<div className="flex gap-4">
							<Button radius="xl" component={Link} to={"home"}>
								HOME
							</Button>
							<Button radius="xl" component={Link} to={"crypto"}>
								CRPYTO
							</Button>
							<Button radius="xl" component={Link} to={"news"}>
								NEWS
							</Button>
						</div>
						<div>
							<HeaderUser />
						</div>
					</Group>
				</Box>
			</Container>
		</div>
	);
};

export default NavBar;
