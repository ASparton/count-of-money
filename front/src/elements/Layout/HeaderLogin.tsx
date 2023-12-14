import { ActionIcon, Button, Group, Text } from "@mantine/core";
import { IconLogin } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useUser } from "../../stores/User.store";

const HeaderUser: React.FC = () => {
  const user = useUser();

  const displayUser = () => {
    return (
      <Group>
        <Button radius="xl" component={Link} to="/auth/user">
          <Text>{user.username}</Text>
        </Button>
      </Group>
    );
  };

  const displayLoginRegister = () => {
    return (
      <ActionIcon component={Link} to="/public/login" size="lg">
        <IconLogin />
      </ActionIcon>
    );
  };

  return user.email ? displayUser() : displayLoginRegister();
};

export default HeaderUser;
