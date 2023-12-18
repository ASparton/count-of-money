import { ActionIcon, Box, Stack } from "@mantine/core";
import { IconCurrencyBitcoin, IconNews } from "@tabler/icons-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser, useUserStore } from "../../stores/User.store";
import HeaderUser from "./HeaderLogin";

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const userStore = useUserStore();
  const user = useUser();

  useEffect(() => {
    console.log("update user :", user.token);
  }, [user]);

  return (
    <div className="fixed top-0 left-0 z-10 h-full">
      <Box bg="#0D1117" className="h-full pt-4">
        <Stack className="h-full p-3">
          <div>
            <HeaderUser />
          </div>
          <div className="flex h-full gap-10 flex-col w-min items-center justify-center">
            <ActionIcon radius="xl" component={Link} to={"crypto"} size="lg">
              <IconCurrencyBitcoin />
            </ActionIcon>
            <ActionIcon radius="xl" component={Link} to={"news"} size={"lg"}>
              <IconNews />
            </ActionIcon>
          </div>
          {user.token && (
            <div>
              <ActionIcon
                radius={"xl"}
                onClick={() => {
                  navigate("/");
                  userStore.delete();
                }}
              >
                <IconNews />
              </ActionIcon>
            </div>
          )}
        </Stack>
      </Box>
    </div>
  );
};

export default NavBar;
