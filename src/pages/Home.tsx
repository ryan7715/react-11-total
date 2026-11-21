import {Link} from "react-router";
import {Main} from "../Styles/styles.tsx";
import styled from "styled-components";

const HomeContent = styled.div`
    padding: 40px 24px;
    text-align: center;
`;

const Title = styled.h1`
    font-size: 32px;
    color: ${({theme}) => theme.color.text};
    margin-bottom: 15px;
`;

const Description = styled.p`
    font-size: 16px;
    color: ${({theme}) => theme.color.textSecondary};
    margin-bottom: 35px;
`;

const Content = styled.div`
    display: flex;
    gap: 24px;
    text-align: left;
`;

const SunsetImage = styled.img`
    width: 55%;
    height: 400px;
    object-fit: cover;
    border-radius: 12px;
`;

const CardList = styled.div`
    width: 45%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
`;

const PageCard = styled(Link)`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 20px;
    padding: 20px;
    border-radius: 12px;
    background: ${({theme}) => theme.color.card};
    color: ${({theme}) => theme.color.text};
    border: 1px solid ${({theme}) => theme.color.border};
    text-decoration: none;
    font-size: 18px;
    font-weight: bold;
`;

const TodoIcon = styled.span`
    color: #8b5cf6;
    background: #ede9fe;
`;

const CoinIcon = styled.span`
    color: #d4a017;
    background: #ffffff;
`;

const MovieIcon = styled.span`
    color: #e88b9a;
    background: #fce4ec;
`;

const BooksIcon = styled.span`
    color: #16a34a;
    background: #dcfce7;
`;

const ProductIcon = styled.span`
    color: #3b82f6;
    background: #dbeafe;
`;

const BoardIcon = styled.span`
    color: #0d9488;
    background: #ccfbf1;
`;
const CardIcon = styled.span`
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    flex-shrink: 0;
`;

function Home() {
    return (
        <Main>
            <HomeContent>
                <Title>Welcome to Life Dashboard</Title>
                <Description>한곳에서 보는 나의 일상.</Description>

                <Content>
                    <SunsetImage
                        src="/sunset-lake.png"
                        alt="노을이 지는 호수"
                    />

                    <CardList>
                        <PageCard to="/todo">
                            <CardIcon as={TodoIcon}>✓</CardIcon>
                            TodoList
                        </PageCard>

                        <PageCard to="/coin">
                            <CardIcon as={CoinIcon}>$</CardIcon>
                            CoinTracker
                        </PageCard>

                        <PageCard to="/movie">
                            <CardIcon as={MovieIcon}>▶</CardIcon>
                            Movie
                        </PageCard>

                        <PageCard to="/books">
                            <CardIcon as={BooksIcon}>▤</CardIcon>
                            Books
                        </PageCard>

                        <PageCard to="/product">
                            <CardIcon as={ProductIcon}>▣</CardIcon>
                            Product
                        </PageCard>

                        <PageCard to="/board">
                            <CardIcon as={BoardIcon}>♧</CardIcon>
                            Board
                        </PageCard>
                    </CardList>
                </Content>
            </HomeContent>
        </Main>
    );
}

export default Home;
