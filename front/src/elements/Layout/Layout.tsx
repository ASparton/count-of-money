import { Box, Container } from "@mantine/core";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

const Layout: React.FC = () => {
  return (
    <Container className="h-screen w-screen">
      <NavBar />
      <Box className="py-20">
        <Box className="m-10 p-3 rounded-xl">
          <Outlet />
        </Box>
      </Box>
    </Container>
  );
};

export default Layout;
