import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useTheme } from "styled-components";

type Book = {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    categories?: string[];
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
  };
};

type ApiResponse = {
  items?: Book[];
};

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

function Books() {
  const navigate = useNavigate();

  const theme = useTheme() as {
    color: {
      background: string;
      text: string;
      muted: string;
      primary: string;
      border: string;
      card: string;
      textSecondary: string;
    };
  };

  const [keyword, setKeyword] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [currentSearchKeyword, setCurrentSearchKeyword] = useState("");
  const [searchHistory, setSearchHistory] = useState<
    { keyword: string; books: Book[] }[]
  >([]);

  const containerStyle = {
    display: "flex",
    flexDirection: "column" as const,
    width: "100%",
    padding: "40px",
    backgroundColor: theme.color.background,
    color: theme.color.text,
    minHeight: "100vh",
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
  };

  const titleStyle = {
    fontSize: "30px",
    fontWeight: 800,
    color: theme.color.text,
  };

  const subtitleStyle = {
    color: theme.color.textSecondary,
    marginBottom: "30px",
  };

  const searchCardStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    maxWidth: "650px",
    padding: "12px",
    backgroundColor: theme.color.card,
    border: `1px solid ${theme.color.border}`,
    borderRadius: "12px",
    marginBottom: "40px",
  };

  const inputStyle = {
    flex: 1,
    minWidth: 0,
    padding: "12px",
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
    color: theme.color.text,
    fontSize: "15px",
  };

  const buttonStyle = {
    padding: "12px 22px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: theme.color.primary,
    color: "#FFFFFF",
    fontWeight: 700,
    cursor: "pointer",
  };

  const sectionTitleStyle = {
    fontSize: "22px",
    fontWeight: 700,
    marginBottom: "8px",
    color: theme.color.text,
  };

  const sectionSubtitleStyle = {
    color: theme.color.textSecondary,
    fontSize: "14px",
    marginBottom: "22px",
  };

  const bookGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "20px",
    width: "100%",
  };

  const bookCardStyle = {
    display: "flex",
    flexDirection: "column" as const,
    padding: "14px",
    borderRadius: "12px",
    border: `1px solid ${theme.color.border}`,
    backgroundColor: theme.color.card,
    cursor: "pointer",
    minWidth: 0,
  };

  const coverStyle = {
    width: "100%",
    height: "210px",
    objectFit: "contain" as const,
    borderRadius: "6px",
    marginBottom: "12px",
  };

  const noCoverStyle = {
    width: "100%",
    height: "210px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.color.muted,
    color: theme.color.textSecondary,
    borderRadius: "6px",
    marginBottom: "12px",
  };

  const bookTitleStyle = {
    fontSize: "15px",
    fontWeight: 700,
    color: theme.color.text,
    marginBottom: "6px",
  };

  const authorsStyle = {
    fontSize: "12px",
    color: theme.color.textSecondary,
  };

  const resultCardStyle = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "14px",
    borderRadius: "12px",
    border: `1px solid ${theme.color.border}`,
    backgroundColor: theme.color.card,
    cursor: "pointer",
    marginBottom: "12px",
  };

  const resultCoverStyle = {
    width: "75px",
    height: "110px",
    objectFit: "contain" as const,
    borderRadius: "6px",
  };

  const messageStyle = {
    padding: "30px 10px",
    textAlign: "center" as const,
    color: theme.color.textSecondary,
  };

  const backBtnStyle = {
    width: "fit-content",
    padding: "9px 15px",
    borderRadius: "8px",
    border: `1px solid ${theme.color.border}`,
    backgroundColor: theme.color.card,
    color: theme.color.text,
    cursor: "pointer",
    marginBottom: "25px",
  };

  const detailCardStyle = {
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
    padding: "25px",
    borderRadius: "14px",
    backgroundColor: theme.color.card,
    border: `1px solid ${theme.color.border}`,
    maxWidth: "850px",
  };

  const detailCoverStyle = {
    width: "200px",
    height: "290px",
    objectFit: "contain" as const,
    borderRadius: "8px",
  };

  const detailTextStyle = {
    color: theme.color.textSecondary,
    lineHeight: 1.8,
    fontSize: "14px",
  };

  useEffect(() => {
    const categories = [
      "subject:fiction",
      "subject:science",
      "subject:history",
      "subject:self-help",
      "subject:biography",
    ];

    const fetchFeaturedBooks = async () => {
      setFeaturedLoading(true);

      try {
        const responses = await Promise.all(
          categories.map((category) =>
            fetch(
              `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(category)}&maxResults=5&key=${API_KEY}`,
            )
              .then((res) => {
                if (!res.ok) {
                  throw new Error("추천 도서를 불러오지 못했습니다.");
                }
                return res.json() as Promise<ApiResponse>;
              })
              .catch(() => ({ items: [] })),
          ),
        );

        const allBooks = responses.flatMap((response) => response.items || []);

        const uniqueBooks = Array.from(
          new Map(allBooks.map((book) => [book.id, book])).values(),
        );

        const shuffledBooks = [...uniqueBooks].sort(() => Math.random() - 0.5);

        setFeaturedBooks(shuffledBooks.slice(0, 10));
      } catch (err) {
        console.log(err);
        setFeaturedBooks([]);
      } finally {
        setFeaturedLoading(false);
      }
    };

    fetchFeaturedBooks();
  }, []);

  const searchBooks = (searchKeyword: string) => {
    setLoading(true);
    setHasSearched(true);
    setBooks([]);
    setSelectedBookId(null);
    setSelectedBook(null);

    fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchKeyword)}&maxResults=20&key=${API_KEY}`,
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("도서 검색에 실패했습니다.");
        }
        return res.json();
      })
      .then((json: ApiResponse) => {
        setBooks(Array.isArray(json.items) ? json.items : []);
      })
      .catch((err: unknown) => {
        console.log(err);
        setBooks([]);
      })
      .finally(() => setLoading(false));
  };

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const searchKeyword = keyword.trim();

    if (!searchKeyword) return;

    if (currentSearchKeyword) {
      setSearchHistory([
        ...searchHistory,
        {
          keyword: currentSearchKeyword,
          books: books,
        },
      ]);
    }

    setCurrentSearchKeyword(searchKeyword);
    searchBooks(searchKeyword);
  };

  const getBookDetail = (id: string) => {
    setSelectedBookId(id);
    setSelectedBook(null);
    setDetailLoading(true);

    fetch(`https://www.googleapis.com/books/v1/volumes/${id}?key=${API_KEY}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("도서 정보를 불러오지 못했습니다.");
        }
        return res.json();
      })
      .then((json: Book) => setSelectedBook(json))
      .catch((err: unknown) => console.log(err))
      .finally(() => setDetailLoading(false));
  };

  const handleDetailBack = () => {
    setSelectedBookId(null);
    setSelectedBook(null);
  };

  const handleSearchBack = () => {
    if (searchHistory.length > 0) {
      const previousSearch = searchHistory[searchHistory.length - 1];

      setKeyword(previousSearch.keyword);
      setCurrentSearchKeyword(previousSearch.keyword);
      setBooks(previousSearch.books);
      setSearchHistory(searchHistory.slice(0, -1));
      setLoading(false);
    } else if (currentSearchKeyword) {
      setKeyword("");
      setCurrentSearchKeyword("");
      setBooks([]);
      setHasSearched(false);
      setLoading(false);
    } else {
      navigate("/");
    }
  };

  const getCover = (book: Book) =>
    book.volumeInfo.imageLinks?.thumbnail ||
    book.volumeInfo.imageLinks?.smallThumbnail;

  return (
    <div style={containerStyle}>
      {selectedBookId !== null ? (
        <>
          <button style={backBtnStyle} onClick={handleDetailBack}>
            뒤로 가기
          </button>

          <div style={headerStyle}>
            <h1 style={titleStyle}>Google Books</h1>
          </div>

          <p style={subtitleStyle}>
            다양한 책을 검색하고 새로운 이야기를 발견해 보세요.
          </p>

          <form onSubmit={onSearch} style={searchCardStyle}>
            <input
              style={inputStyle}
              type="text"
              placeholder="책 제목이나 저자를 입력하세요."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />

            <button style={buttonStyle} type="submit">
              검색
            </button>
          </form>

          {detailLoading ? (
            <p style={messageStyle}>도서 정보를 불러오고 있습니다...</p>
          ) : (
            selectedBook && (
              <div style={detailCardStyle}>
                <h2 style={titleStyle}>{selectedBook.volumeInfo.title}</h2>

                {getCover(selectedBook) ? (
                  <img
                    style={detailCoverStyle}
                    src={getCover(selectedBook)}
                    alt={selectedBook.volumeInfo.title}
                  />
                ) : (
                  <div style={noCoverStyle}>No Cover</div>
                )}

                <div>
                  <h3 style={bookTitleStyle}>저자</h3>
                  <p style={detailTextStyle}>
                    {selectedBook.volumeInfo.authors?.join(", ") || "정보 없음"}
                  </p>
                </div>

                <div>
                  <h3 style={bookTitleStyle}>장르</h3>
                  <p style={detailTextStyle}>
                    {selectedBook.volumeInfo.categories?.join(", ") ||
                      "정보 없음"}
                  </p>
                </div>

                <div>
                  <h3 style={bookTitleStyle}>책 소개 및 줄거리</h3>

                  <p
                    style={detailTextStyle}
                    dangerouslySetInnerHTML={{
                      __html:
                        selectedBook.volumeInfo.description ||
                        "소개가 없습니다.",
                    }}
                  />
                </div>
              </div>
            )
          )}
        </>
      ) : (
        <>
          <button style={backBtnStyle} onClick={handleSearchBack}>
            뒤로 가기
          </button>

          <div style={headerStyle}>
            <h1 style={titleStyle}>Google Books</h1>
          </div>

          <p style={subtitleStyle}>
            다양한 책을 검색하고 새로운 이야기를 발견해 보세요.
          </p>

          <form onSubmit={onSearch} style={searchCardStyle}>
            <input
              style={inputStyle}
              type="text"
              placeholder="책 제목이나 저자를 입력하세요."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />

            <button style={buttonStyle} type="submit">
              검색
            </button>
          </form>

          {!hasSearched && (
            <>
              <h2 style={sectionTitleStyle}>오늘의 추천 도서</h2>

              <p style={sectionSubtitleStyle}>다양한 장르의 책을 만나보세요.</p>

              {featuredLoading ? (
                <p style={messageStyle}>추천 도서를 불러오고 있습니다...</p>
              ) : featuredBooks.length === 0 ? (
                <p style={messageStyle}>추천 도서를 불러오지 못했습니다.</p>
              ) : (
                <div style={bookGridStyle}>
                  {featuredBooks.map((book) => (
                    <div
                      key={book.id}
                      style={bookCardStyle}
                      onClick={() => getBookDetail(book.id)}
                    >
                      {getCover(book) ? (
                        <img
                          style={coverStyle}
                          src={getCover(book)}
                          alt={book.volumeInfo.title}
                        />
                      ) : (
                        <div style={noCoverStyle}>No Cover</div>
                      )}

                      <h3 style={bookTitleStyle}>{book.volumeInfo.title}</h3>

                      <p style={authorsStyle}>
                        {book.volumeInfo.authors?.join(", ") ||
                          "저자 정보 없음"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {hasSearched && (
            <>
              <h2 style={sectionTitleStyle}>검색 결과</h2>

              {loading ? (
                <p style={messageStyle}>도서를 검색하고 있습니다...</p>
              ) : books.length === 0 ? (
                <p style={messageStyle}>검색 결과가 없습니다.</p>
              ) : (
                books.map((book) => (
                  <div
                    key={book.id}
                    style={resultCardStyle}
                    onClick={() => getBookDetail(book.id)}
                  >
                    {getCover(book) ? (
                      <img
                        style={resultCoverStyle}
                        src={getCover(book)}
                        alt={book.volumeInfo.title}
                      />
                    ) : (
                      <div style={noCoverStyle}>No Cover</div>
                    )}

                    <div>
                      <h3 style={bookTitleStyle}>{book.volumeInfo.title}</h3>

                      <p style={authorsStyle}>
                        {book.volumeInfo.authors?.join(", ") ||
                          "저자 정보 없음"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Books;
