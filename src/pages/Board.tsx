import {useEffect, useState} from "react";
import {Link, useParams, useNavigate} from "react-router";
import styled from "styled-components";
import {Main} from "../Styles/styles.tsx";

type Post = {
    userId: number;
    id: number;
    title: string;
    body: string;
};

const Container = styled.div`
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    padding: 40px 24px;
    color: ${({theme}) => theme.color.text};
`;

const Title = styled.h1`
    font-size: 28px;
    margin-bottom: 12px;
    color: ${({theme}) => theme.color.text};
`;

const ListTitle = styled.h2`
    font-size: 21px;
    margin-bottom: 18px;
    color: ${({theme}) => theme.color.text};
`;

const PostList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const PostCard = styled(Link)`
    display: block;
    padding: 20px;
    border: 1px solid ${({theme}) => theme.color.border};
    border-radius: 10px;
    background: ${({theme}) => theme.color.card};
    color: ${({theme}) => theme.color.text};
    transition: border-color 0.2s, transform 0.2s;

    &:hover {
        border-color: ${({theme}) => theme.color.primary};
        transform: translateY(-2px);
    }
`;

const PostTitle = styled.h3`
    font-size: 17px;
    margin-bottom: 10px;
    overflow-wrap: anywhere;
`;

const PostInfo = styled.p`
    font-size: 13px;
    color: ${({theme}) => theme.color.textSecondary};
    margin-bottom: 12px;
`;

const PostPreview = styled.p`
    font-size: 14px;
    line-height: 1.6;
    color: ${({theme}) => theme.color.textSecondary};
    overflow-wrap: anywhere;
`;


const Article = styled.article`
    margin-top: 35px;
    padding: 30px;
    border: 1px solid ${({theme}) => theme.color.border};
    border-radius: 12px;
    background: ${({theme}) => theme.color.card};
`;

const DetailTitle = styled.h1`
    font-size: 26px;
    line-height: 1.5;
    margin-bottom: 20px;
    color: ${({theme}) => theme.color.text};
    overflow-wrap: anywhere;
`;

const Meta = styled.div`
    padding-bottom: 20px;
    margin-bottom: 25px;
    border-bottom: 1px solid ${({theme}) => theme.color.border};
    color: ${({theme}) => theme.color.textSecondary};
    font-size: 14px;
`;

const Body = styled.p`
    font-size: 16px;
    line-height: 1.9;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    color: ${({theme}) => theme.color.text};
`;

const BackButton = styled.button`
    padding: 10px 18px;
    border: 1px solid ${({theme}) => theme.color.border};
    border-radius: 7px;
    background: ${({theme}) => theme.color.muted};
    color: ${({theme}) => theme.color.text};
    cursor: pointer;

    &:hover {
        border-color: ${({theme}) => theme.color.primary};
    }
`;

const Loading = styled.p`
    padding: 80px 20px;
    text-align: center;
    color: ${({theme}) => theme.color.textSecondary};
`;

const EmptyMessage = styled.p`
    padding: 40px 20px;
    text-align: center;
    color: ${({theme}) => theme.color.textSecondary};
`;

const ErrorMessage = styled.p`
    padding: 20px;
    text-align: center;
    color: #ef4444;
`;

function Board() {
    const navigate = useNavigate();
    const {id} = useParams();
    const [list, setList] = useState<Post[]>([]);
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const url = id
            ? `https://jsonplaceholder.typicode.com/posts/${id}`
            : "https://jsonplaceholder.typicode.com/posts";

        Promise.resolve()
            .then(() => {
                setLoading(true);
                setError("");

                return fetch(url);
            })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(
                        id
                            ? "게시글을 가져오지 못했습니다."
                            : "게시글 목록을 가져오지 못했습니다."
                    );
                }

                return res.json();
            })
            .then((json: Post | Post[]) => {
                if (id) {
                    const post = json as Post;
                    setPost(post.id ? post : null);
                } else {
                    const posts = json as Post[];

                    const randomPosts = [...posts]
                        .sort(() => Math.random() - 0.5)
                        .slice(0, 80);

                    setList(randomPosts);
                    setPost(null);
                }
            })
            .catch((err: unknown) => {
                setError(
                    err instanceof Error
                        ? err.message
                        : "알 수 없는 오류가 발생했습니다."
                );
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleGoBack = () => {
        if (id) {
            navigate("/board");
        } else {
            navigate("/");
        }
    };

    if (loading) {
        return (
            <Main>
                <Container>
                    <Loading>게시글을 불러오는 중입니다...</Loading>
                </Container>
            </Main>
        );
    }

    if (error) {
        return (
            <Main>
                <Container>
                    <ErrorMessage>{error}</ErrorMessage>
                    <BackButton type="button" onClick={handleGoBack}>
                        뒤로가기
                    </BackButton>
                </Container>
            </Main>
        );
    }


    if (id) {
        if (!post) {
            return (
                <Main>
                    <Container>
                        <EmptyMessage>존재하지 않는 게시글입니다.</EmptyMessage>
                        <BackButton type="button" onClick={handleGoBack}>
                            뒤로가기
                        </BackButton>
                    </Container>
                </Main>
            );
        }

        return (
            <Main>
                <Container>
                    <BackButton type="button" onClick={handleGoBack}>
                        뒤로가기
                    </BackButton>

                    <Article>
                        <DetailTitle>{post.title}</DetailTitle>

                        <Meta>
                            게시글 번호: {post.id}
                            {" | "}
                            작성자 ID: {post.userId}
                        </Meta>

                        <Body>{post.body}</Body>
                    </Article>
                </Container>
            </Main>
        );
    }


    return (
        <Main>
            <Container>
                <BackButton type="button" onClick={handleGoBack}>
                    뒤로가기
                </BackButton>

                <Title>Board</Title>

                <ListTitle>오늘의 게시글</ListTitle>

                <PostList>
                    {list.length === 0 ? (
                        <EmptyMessage>
                            검색 결과가 없습니다.
                        </EmptyMessage>
                    ) : (
                        list.map((item) => (
                            <PostCard key={item.id} to={`/board/${item.id}`}>
                                <PostTitle>{item.title}</PostTitle>

                                <PostInfo>
                                    게시글 번호: {item.id}
                                    {" | "}
                                    작성자 ID: {item.userId}
                                </PostInfo>

                                <PostPreview>{item.body}</PostPreview>
                            </PostCard>
                        ))
                    )}
                </PostList>
            </Container>
        </Main>
    );
}

export default Board;
