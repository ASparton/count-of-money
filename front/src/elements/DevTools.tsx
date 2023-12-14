import { Button, Menu } from "@mantine/core";
import { IconCode, IconKey, IconKeyOff, IconMapPin } from "@tabler/icons-react";
import { Link } from "react-router-dom";

const DevTools: React.FC = () => {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button leftSection={<IconCode />} className="fixed m-10">
          DEV TOOLS
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>LocalStorage</Menu.Label>
        <Menu.Item
          leftSection={<IconKey />}
          onClick={() =>
            localStorage.setItem("auth", "aaaaaaaaaaaaaaaaaaaaaaaaaaaa")
          }
        >
          set auth
        </Menu.Item>

        <Menu.Item
          leftSection={<IconKeyOff />}
          onClick={() => localStorage.clear()}
        >
          del auth
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Router</Menu.Label>
        <Menu.Item leftSection={<IconMapPin />} component={Link} to="/">
          root
        </Menu.Item>
        <Menu.Item
          leftSection={<IconMapPin />}
          component={Link}
          to="/public/home"
        >
          public root
        </Menu.Item>
        <Menu.Item
          leftSection={<IconMapPin />}
          component={Link}
          to="/auth/home"
        >
          auth root
        </Menu.Item>
        <Menu.Item
          leftSection={<IconMapPin />}
          component={Link}
          to="/random/route"
        >
          random route
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default DevTools;
