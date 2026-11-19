
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Main } from "../Styles/styles.tsx";

type Coin = {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  price_usd: string;
  percent_change_7d: string;
};

type CoinResponse = {
  data: Coin[];
};

type ExchangeResponse = {
  rates: {
    KRW: number;
  };
};

const Container = styled.div`
  padding: 30px 24px;
  color: ${({ theme }) => theme.color.text};
`;

const Card = styled.section`
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 12px;
  background: ${({ theme }) => theme.color.muted};
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 20px;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  margin-top: 12px;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.color.muted};
  color: ${({ theme }) => theme.color.text};
`;

const Price = styled.h2`
  font-size: 28px;
  margin: 15px 0;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 13px 0;
  border-bottom: 1px solid ${({ theme }) => theme.color.border};

  &:last-child {
    border-bottom: none;
  }
`;

const CoinRow = styled(Row)`
  display: grid;
  grid-template-columns: 1fr 1.2fr 0.8fr;
  cursor: pointer;
  font-size: 13px;

  &:hover {
    background: ${({ theme }) => theme.color.border};
  }

  span:nth-child(2),
  span:nth-child(3) {
    text-align: right;
  }
`;

const Change = styled.span<{ $positive: boolean }>`
  color: ${({ $positive }) => $positive ? "#16a34a" : "#ef4444"};
  font-weight: bold;
`;

function CoinTracker() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [selectedId, setSelectedId] = useState("90");
  const [exchangeRate, setExchangeRate] = useState(0);
  const [error, setError] = useState("");

  const selectedCoin = coins.find((coin) => coin.id === selectedId);

  const formatKRW = (price: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    const getCoins = () => {
      fetch("https://api.coinlore.net/api/tickers/?start=0&limit=50")
        .then((response) => {
          if (!response.ok) {
            throw new Error("코인 정보를 가져오지 못했습니다.");
          }

          return response.json();
        })
        .then((json: CoinResponse) => {
          setCoins(json.data);
          setError("");
        })
        .catch((error: unknown) => {
          setError(
            error instanceof Error
              ? error.message
              : "알 수 없는 오류가 발생했습니다."
          );
        });
    };

    const getExchangeRate = () => {
      fetch("https://open.er-api.com/v6/latest/USD")
        .then((response) => response.json())
        .then((json: ExchangeResponse) => {
          setExchangeRate(json.rates.KRW);
        })
        .catch((error: unknown) => console.log(error));
    };

    getCoins();
    getExchangeRate();

    const timer = setInterval(getCoins, 10000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Main>
      <Container>
        <Title>Coin Tracker</Title>

        <Card>
          <Row>
            <span>USD / KRW</span>
            <strong>
              {exchangeRate ? formatKRW(exchangeRate) : "로딩 중"}
            </strong>
          </Row>
        </Card>

        {error && <p>{error}</p>}

        <Card>
          <strong>코인 선택</strong>

          <Select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {coins.map((coin) => (
              <option key={coin.id} value={coin.id}>
                {coin.name} ({coin.symbol})
              </option>
            ))}
          </Select>
        </Card>

        {selectedCoin && (
          <Card>
            <strong>{selectedCoin.name} ({selectedCoin.symbol})</strong>

            <Price>
              {formatKRW(
                Number(selectedCoin.price_usd) * exchangeRate
              )}
            </Price>

            <Row>
              <span>7일 변동률</span>
              <Change
                $positive={Number(selectedCoin.percent_change_7d) >= 0}
              >
                {Number(selectedCoin.percent_change_7d) > 0 ? "+" : ""}
                {selectedCoin.percent_change_7d}%
              </Change>
            </Row>

            <Row>
              <span>순위</span>
              <strong>#{selectedCoin.rank}</strong>
            </Row>
          </Card>
        )}

        <Card>
          <strong>전체 코인</strong>

          <CoinRow>
            <strong>코인</strong>
            <strong>가격</strong>
            <strong>7일 변동</strong>
          </CoinRow>

          {coins.map((coin) => (
            <CoinRow
              key={coin.id}
              onClick={() => setSelectedId(coin.id)}
            >
              <span>
                <strong>{coin.name}</strong>
                <br />
                {coin.symbol}
              </span>

              <span>
                {formatKRW(Number(coin.price_usd) * exchangeRate)}
              </span>

              <Change
                $positive={Number(coin.percent_change_7d) >= 0}
              >
                {Number(coin.percent_change_7d) > 0 ? "+" : ""}
                {coin.percent_change_7d}%
              </Change>
            </CoinRow>
          ))}
        </Card>
      </Container>
    </Main>
  );
}

export default CoinTracker;
