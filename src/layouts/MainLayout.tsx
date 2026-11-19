import Header from "../components/Header.tsx";
import { Outlet } from "react-router";
import Footer from "../components/Footer.tsx";
import styled from "styled-components";

const Wrap = styled.div`
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  background-color: ${({ theme }) => theme.color.background};
  color: ${({ theme }) => theme.color.text};
`;

function MainLayout() {
  return (
    <Wrap>
      <Header />
      <Outlet />
      <Footer />
    </Wrap>
  );
}

export default MainLayout;
