import {useEffect, useState, type ChangeEvent} from "react";
import {useNavigate} from "react-router";
import styled from "styled-components";
import {Main} from "../Styles/styles.tsx";

interface Movie {
    imdbID: string;
    Title: string;
    Year: string;
    Poster: string;
    Type: string;
}

interface SearchResponse {
    Search?: Movie[];
    Response: string;
    Error?: string;
}

interface MovieDetail {
    Poster: string;
    Title: string;
    Year: string;
    Genre: string;
    Director: string;
    Plot: string;
    imdbRating: string;
    Response: string;
    Error?: string;
}

const MovieContent = styled.div`
    width: 100%;
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 25px;
`;

const Title = styled.h1`
    color: ${({theme}) => theme.color.text};
    font-size: 30px;
`;

const RecommendTitle = styled.h2`
    color: ${({theme}) => theme.color.text};
    font-size: 24px;
`;

const SearchForm = styled.form`
    display: flex;
    gap: 10px;
    width: 100%;
    max-width: 600px;

    @media (max-width: 500px) {
        flex-direction: column;
    }
`;

const SearchInput = styled.input`
    flex: 1;
    min-width: 0;
    padding: 12px;
    border: 1px solid ${({theme}) => theme.color.border};
    border-radius: 8px;
    background-color: ${({theme}) => theme.color.card};
    color: ${({theme}) => theme.color.text};
    outline: none;

    &:focus {
        border-color: ${({theme}) => theme.color.primary};
    }
`;

const ActionButton = styled.button`
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    background-color: ${({theme}) => theme.color.primary};
    color: white;
    cursor: pointer;

    &:hover {
        opacity: 0.85;
    }
`;

const BackButton = styled.button`
    width: fit-content;
    padding: 10px 16px;
    border: 1px solid ${({theme}) => theme.color.border};
    border-radius: 8px;
    background-color: ${({theme}) => theme.color.card};
    color: ${({theme}) => theme.color.text};
    cursor: pointer;

    &:hover {
        background-color: ${({theme}) => theme.color.muted};
    }
`;

const MovieList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
    gap: 20px;
    margin-top: 10px;
`;

const MovieCard = styled.button`
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px;
    border: 1px solid ${({theme}) => theme.color.border};
    border-radius: 12px;
    background-color: ${({theme}) => theme.color.card};
    color: ${({theme}) => theme.color.text};
    text-align: left;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
        transform: translateY(-5px);
    }
`;

const Poster = styled.img`
    width: 100%;
    height: 250px;
    object-fit: cover;
    border-radius: 8px;
`;

const NoPoster = styled.div`
    width: 100%;
    height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background-color: ${({theme}) => theme.color.muted};
    color: ${({theme}) => theme.color.textSecondary};
`;

const MovieTitle = styled.h3`
    font-size: 16px;
    color: ${({theme}) => theme.color.text};
`;

const MovieYear = styled.p`
    color: ${({theme}) => theme.color.textSecondary};
    font-size: 14px;
`;

const DetailContainer = styled.div`
    display: flex;
    gap: 30px;
    padding: 25px;
    border: 1px solid ${({theme}) => theme.color.border};
    border-radius: 12px;
    background-color: ${({theme}) => theme.color.card};

    @media (max-width: 700px) {
        flex-direction: column;
    }
`;

const DetailPoster = styled.img`
    width: 280px;
    max-width: 100%;
    height: fit-content;
    border-radius: 10px;
    object-fit: cover;

    @media (max-width: 700px) {
        width: 100%;
        max-width: 300px;
    }
`;

const DetailInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 18px;
    flex: 1;
    min-width: 0;
`;

const DetailTitle = styled.h2`
    color: ${({theme}) => theme.color.text};
    font-size: 26px;
`;

const DetailItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    color: ${({theme}) => theme.color.text};
    line-height: 1.6;
`;

const DetailLabel = styled.strong`
    color: ${({theme}) => theme.color.primary};
`;

const Message = styled.p`
    color: ${({theme}) => theme.color.textSecondary};
`;

function Movie() {
    const navigate = useNavigate();

    const [keyword, setKeyword] = useState("");
    const [list, setList] = useState<Movie[]>([]);
    const [recommendList, setRecommendList] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
    const [detail, setDetail] = useState<MovieDetail | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState("");

    const [currentSearchKeyword, setCurrentSearchKeyword] = useState("");
    const [searchHistory, setSearchHistory] = useState<
        { keyword: string; list: Movie[]; error: string }[]
    >([]);

    useEffect(() => {
        fetch("https://www.omdbapi.com/?apikey=6a0a8eb4&s=movie")
            .then((res) => res.json())
            .then((json: SearchResponse) => {
                if (json.Response === "False") {
                    setRecommendList([]);
                } else {
                    const movieList = json.Search || [];
                    movieList.sort(() => Math.random() - 0.5);
                    setRecommendList(movieList.slice(0, 10));
                }
            })
            .catch((err) => {
                console.log(err);
                setRecommendList([]);
            });
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.target.value);
    };

    const handleSearch = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        const searchKeyword = keyword.trim();
        if (!searchKeyword) return;

        if (currentSearchKeyword) {
            setSearchHistory([
                ...searchHistory,
                {
                    keyword: currentSearchKeyword,
                    list: list,
                    error: error,
                },
            ]);
        }

        setCurrentSearchKeyword(searchKeyword);
        setSelectedMovieId(null);
        setDetail(null);
        setLoading(true);
        setError("");

        fetch(
            `https://www.omdbapi.com/?apikey=6a0a8eb4&s=${encodeURIComponent(searchKeyword)}`
        )
            .then((res) => res.json())
            .then((json: SearchResponse) => {
                if (json.Response === "False") {
                    setList([]);
                    setError(json.Error || "검색 결과가 없습니다.");
                } else {
                    setList(json.Search || []);
                }
            })
            .catch((err) => {
                console.log(err);
                setList([]);
                setError("영화 검색 중 오류가 발생했습니다.");
            })
            .finally(() => setLoading(false));
    };

    const handleDetail = (id: string) => {
        setSelectedMovieId(id);
        setDetail(null);
        setDetailLoading(true);
        setDetailError("");

        fetch(
            `https://www.omdbapi.com/?apikey=6a0a8eb4&i=${id}&plot=full`
        )
            .then((res) => res.json())
            .then((json: MovieDetail) => {
                if (json.Response === "False") {
                    setDetailError(json.Error || "상세 정보를 불러올 수 없습니다.");
                } else {
                    setDetail(json);
                }
            })
            .catch((err) => {
                console.log(err);
                setDetailError("상세 정보 조회 중 오류가 발생했습니다.");
            })
            .finally(() => setDetailLoading(false));
    };

    const handleDetailBack = () => {
        setSelectedMovieId(null);
        setDetail(null);
        setDetailError("");
    };

    const handleSearchBack = () => {
        if (searchHistory.length > 0) {
            const previousSearch = searchHistory[searchHistory.length - 1];

            setKeyword(previousSearch.keyword);
            setCurrentSearchKeyword(previousSearch.keyword);
            setList(previousSearch.list);
            setError(previousSearch.error);
            setSearchHistory(searchHistory.slice(0, -1));
            setLoading(false);
        } else if (currentSearchKeyword) {
            setKeyword("");
            setCurrentSearchKeyword("");
            setList([]);
            setError("");
            setLoading(false);
        } else {
            navigate("/");
        }
    };

    const renderMovieCards = (movies: Movie[]) =>
        movies.map((item) => (
            <MovieCard
                key={item.imdbID}
                onClick={() => handleDetail(item.imdbID)}
            >
                {item.Poster && item.Poster !== "N/A" ? (
                    <Poster src={item.Poster} alt={item.Title}/>
                ) : (
                    <NoPoster>No image</NoPoster>
                )}

                <MovieTitle>{item.Title}</MovieTitle>
                <MovieYear>{item.Year}</MovieYear>
            </MovieCard>
        ));

    return (
        <Main>
            <MovieContent>
                {selectedMovieId ? (
                    <>
                        <BackButton onClick={handleDetailBack}>
                            뒤로가기
                        </BackButton>

                        <Title>Movie</Title>

                        <SearchForm onSubmit={handleSearch}>
                            <SearchInput
                                value={keyword}
                                onChange={handleChange}
                                placeholder="영화 제목을 검색하세요..."
                                autoComplete="off"
                            />
                            <ActionButton type="submit">Search</ActionButton>
                        </SearchForm>

                        {detailLoading && <Message>Loading...</Message>}

                        {detailError && <Message>{detailError}</Message>}

                        {detail && (
                            <DetailContainer>
                                {detail.Poster && detail.Poster !== "N/A" ? (
                                    <DetailPoster
                                        src={detail.Poster}
                                        alt={detail.Title}
                                    />
                                ) : (
                                    <NoPoster>No image</NoPoster>
                                )}

                                <DetailInfo>
                                    <DetailTitle>{detail.Title}</DetailTitle>

                                    <DetailItem>
                                        <DetailLabel>Genre</DetailLabel>
                                        {detail.Genre}
                                    </DetailItem>

                                    <DetailItem>
                                        <DetailLabel>Year</DetailLabel>
                                        {detail.Year}
                                    </DetailItem>

                                    <DetailItem>
                                        <DetailLabel>Rating</DetailLabel>
                                        {detail.imdbRating === "N/A"
                                            ? "평점 정보 없음"
                                            : detail.imdbRating}
                                    </DetailItem>

                                    <DetailItem>
                                        <DetailLabel>Director</DetailLabel>
                                        {detail.Director}
                                    </DetailItem>

                                    <DetailItem>
                                        <DetailLabel>Plot</DetailLabel>
                                        {detail.Plot}
                                    </DetailItem>
                                </DetailInfo>
                            </DetailContainer>
                        )}
                    </>
                ) : (
                    <>
                        <BackButton onClick={handleSearchBack}>
                            뒤로가기
                        </BackButton>

                        <Title>Movie</Title>

                        <SearchForm onSubmit={handleSearch}>
                            <SearchInput
                                value={keyword}
                                onChange={handleChange}
                                placeholder="영화 제목을 검색하세요..."
                                autoComplete="off"
                            />
                            <ActionButton type="submit">Search</ActionButton>
                        </SearchForm>

                        {list.length === 0 && !loading && !error && (
                            <>
                                <RecommendTitle>오늘의 추천 영화</RecommendTitle>

                                <MovieList>
                                    {renderMovieCards(recommendList)}
                                </MovieList>
                            </>
                        )}

                        {loading && <Message>Loading...</Message>}

                        {error && <Message>{error}</Message>}

                        {!loading && !error && list.length === 0 && (
                            <Message>영화 제목을 검색하세요.</Message>
                        )}

                        <MovieList>
                            {renderMovieCards(list)}
                        </MovieList>
                    </>
                )}
            </MovieContent>
        </Main>
    );
}

export default Movie;
