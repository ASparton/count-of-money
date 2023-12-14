import { Avatar, Button, Group, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import { useUser } from "../../stores/User.store";

const HeaderUser: React.FC = () => {
  const user = useUser();

  const displayUser = () => {
    return (
      <Group>
        <Avatar variant="transparent" radius="xl" size="md" src="" />
        <Button radius="xl" component={Link} to="/auth/user">
          <Text>{user.username}</Text>
        </Button>
      </Group>
    );
  };

  const displayLoginRegister = () => {
    return (
      <Button component={Link} to="/public/login">
        Login/Register
      </Button>
    );
  };

  return user.email ? displayUser() : displayLoginRegister();
};

export default HeaderUser;
