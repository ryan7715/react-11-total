import { Main } from "../Styles/styles.tsx";
import styled from "styled-components";

const HomeContent = styled.div`
  padding: 40px 24px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 32px;
  color: ${({ theme }) => theme.color.text};
  margin-bottom: 15px;
`;

const Description = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.color.textSecondary};
`;

function Home() {
  return (
    <Main>
      <HomeContent>
        <Title>Welcome to Life Dashboard</Title>
        <Description>한곳에서 보는 나의 일상.</Description>
      </HomeContent>
    </Main>
  );
}

export default Home;
