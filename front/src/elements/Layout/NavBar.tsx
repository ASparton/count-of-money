import { ActionIcon, Box, Stack } from "@mantine/core";
import { IconCurrencyBitcoin, IconHome, IconNews } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import HeaderUser from "./HeaderLogin";

const NavBar: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 z-10 h-full">
      <Box bg="#0D1117" className="h-full pt-4">
        <Stack className="h-full p-3">
          <div>
            <HeaderUser />
          </div>
          <div className="flex h-full gap-10 flex-col w-min items-center justify-center">
            <ActionIcon radius="xl" component={Link} to={"home"} size="lg">
              <IconHome />
            </ActionIcon>
            <ActionIcon radius="xl" component={Link} to={"crypto"} size="lg">
              <IconCurrencyBitcoin />
            </ActionIcon>
            <ActionIcon radius="xl" component={Link} to={"news"} size={"lg"}>
              <IconNews />
            </ActionIcon>
          </div>
        </Stack>
      </Box>
    </div>
  );
};

export default NavBar;
