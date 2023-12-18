import { ActionIcon, Avatar, Group } from "@mantine/core";
import { IconLogin2 } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useUser } from "../../stores/User.store";

const HeaderUser: React.FC = () => {
  const user = useUser();

  const displayUser = () => {
    return (
      <Group>
        <Avatar
          radius="xl"
          component={Link}
          to="/auth/user"
          color="orange"
          variant="filled"
        />
      </Group>
    );
  };

  const displayLoginRegister = () => {
    return (
      <ActionIcon component={Link} to="/public/login" size="lg">
        <IconLogin2 />
      </ActionIcon>
    );
  };

  return user.email ? displayUser() : displayLoginRegister();
};

export default HeaderUser;
