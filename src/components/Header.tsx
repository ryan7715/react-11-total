import { Link } from "react-router";
import styled from "styled-components";
import { useContext } from "react";
import { ThemeContext } from "../contexts/theme/ThemeContext.tsx";
import { FaMoon, FaSun } from "react-icons/fa";

const Head = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 64px;
  padding: 0 30px;
  background-color: ${({ theme }) => theme.color.muted};
  border-bottom: 1px solid ${({ theme }) => theme.color.border};

  @media (max-width: 768px) {
    padding: 0 15px;
    flex-wrap: wrap;
    gap: 12px;
  }
`;

const Logo = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.color.primary};
  white-space: nowrap;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 20px;

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.color.text};
    font-size: 14px;
    transition: color 0.2s;

    &:hover {
      color: ${({ theme }) => theme.color.primary};
    }
  }

  @media (max-width: 900px) {
    order: 3;
    width: 100%;
    overflow-x: auto;
    padding: 10px 0;
  }
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
`;

const ThemeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 8px;

  &:hover {
    opacity: 0.7;
  }
`;

function Header() {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error("Provider 안에서 사용해주세요.");
  }

  return (
    <Head>
      <Logo>My Dashboard</Logo>

      <Nav>
        <Link to="/">Home</Link>
        <Link to="/todo">Todo</Link>
        <Link to="/coin">Coin</Link>
        <Link to="/movie">Movie</Link>
        <Link to="/books">Books</Link>
        <Link to="/product">Product</Link>
        <Link to="/board">Board</Link>
      </Nav>

      <NavRight>
        <ThemeButton
          onClick={themeContext.toggleTheme}
          aria-label="테마 변경"
          title="테마 변경"
        >
          {themeContext.theme === "dark" ? (
            <FaSun size={20} color="#FACC15" />
          ) : (
            <FaMoon size={20} color="#6366F1" />
          )}
        </ThemeButton>
      </NavRight>
    </Head>
  );
}

export default Header;
