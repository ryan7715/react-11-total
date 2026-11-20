import { useEffect, useState } from "react";
import styled from "styled-components";
import { Main } from "../Styles/styles.tsx";

type Coin = {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  price_usd: string;
  percent_change_24h: string;
  volume24: string;
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
  cursor: pointer;
  margin-bottom: 8px;
  padding: 15px 10px;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 8px;
  font-size: 13px;

  &:hover {
    background: ${({ theme }) => theme.color.border};
  }
`;

const Change = styled.span<{ $positive: boolean }>`
  color: ${({ $positive }) => ($positive ? "#16a34a" : "#ef4444")};
  font-weight: bold;
`;

const Chart = styled.svg`
  width: 100%;
  height: 180px;
  margin-top: 15px;
`;

function CoinTracker() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [exchangeRate, setExchangeRate] = useState(0);
  const [volumeHistory, setVolumeHistory] = useState<number[]>([]);
  const [error, setError] = useState("");

  const selectedCoin = coins.find((coin) => coin.id === selectedId);

  const formatKRW = (price: number) => price.toLocaleString("ko-KR") + "원";

  useEffect(() => {
    let isFetching = false;
    let isActive = true;

    const getCoins = () => {
      if (isFetching) return;

      isFetching = true;

      fetch("https://api.coinlore.net/api/tickers/?start=0&limit=50")
        .then((response) => {
          if (!response.ok) {
            throw new Error("코인 정보를 가져오지 못했습니다.");
          }

          return response.json();
        })
        .then((json: CoinResponse) => {
          if (!isActive) return;

          setCoins(json.data);
          setError("");

          if (!selectedId && json.data.length > 0) {
            setSelectedId(json.data[0].id);
            return;
          }

          const coin = json.data.find((item) => item.id === selectedId);

          if (coin) {
            setVolumeHistory((prev) =>
              [...prev, Number(coin.volume24)].slice(-30),
            );
          }
        })
        .catch((error: unknown) => {
          if (!isActive) return;

          setError(
            error instanceof Error
              ? error.message
              : "알 수 없는 오류가 발생했습니다.",
          );
        })
        .finally(() => {
          isFetching = false;
        });
    };

    getCoins();

    const timer = setInterval(getCoins, 60000);

    return () => {
      isActive = false;
      clearInterval(timer);
    };
  }, [selectedId]);

    useEffect(() => {
      fetch("https://open.er-api.com/v6/latest/USD")
        .then((response) => {
          if (!response.ok) {
            throw new Error("환율 정보를 가져오지 못했습니다.");
          }

          return response.json();
        })
        .then((json: ExchangeResponse) => {
          setExchangeRate(json.rates.KRW);
        })
        .catch((error: unknown) => {
          setError(
            error instanceof Error
              ? error.message
              : "환율 정보를 불러오는 중 오류가 발생했습니다.",
          );
        });
    }, []);

  const handleSelect = (id: string) => {
    if (id === selectedId) return;
    setSelectedId(id);
    setVolumeHistory([]);
  };

  const maxVolume = Math.max(...volumeHistory, 1);

  const minVolume = volumeHistory.length > 0 ? Math.min(...volumeHistory) : 0;

  const chartPoints = volumeHistory
    .map((volume, index) => {
      const x = 10 + (index / Math.max(volumeHistory.length - 1, 1)) * 480;

      const y =
        160 - ((volume - minVolume) / (maxVolume - minVolume || 1)) * 140;

      return `${x},${y}`;
    })
    .join(" ");

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
            onChange={(e) => handleSelect(e.target.value)}
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
            <strong>
              {selectedCoin.name} ({selectedCoin.symbol})
            </strong>

            <Price>
              {formatKRW(Number(selectedCoin.price_usd) * exchangeRate)}
            </Price>

            <Row>
              <span>24시간 변동률</span>

              <Change $positive={Number(selectedCoin.percent_change_24h) >= 0}>
                {Number(selectedCoin.percent_change_24h) > 0 ? "+" : ""}
                {selectedCoin.percent_change_24h}%
              </Change>
            </Row>

            <Row>
              <span>순위</span>
              <strong>#{selectedCoin.rank}</strong>
            </Row>

            <Row>
              <span>24시간 거래량</span>
              <strong>
                {formatKRW(Number(selectedCoin.volume24) * exchangeRate)}
              </strong>
            </Row>

            <h3>거래량 그래프</h3>

            <Chart viewBox="0 0 500 180">
              <line x1="0" y1="160" x2="500" y2="160" stroke="gray" />

              <polyline
                points={chartPoints}
                fill="none"
                stroke="#16a34a"
                strokeWidth="3"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </Chart>

            {volumeHistory.length < 10 && (
              <p>그래프 준비 중: {volumeHistory.length}/10개 데이터 수집</p>
            )}

            <small>1분 간격 거래량 기록 (최근 30개)</small>
          </Card>
        )}

        <Card>
          <strong>전체 코인</strong>

          <CoinRow>
            <strong>코인</strong>
            <strong>가격</strong>
            <strong>24시간 변동</strong>
          </CoinRow>

          {coins.map((coin) => (
            <CoinRow key={coin.id} onClick={() => handleSelect(coin.id)}>
              <span>
                <strong>{coin.name}</strong>
                <br />
                {coin.symbol}
              </span>

              <span>{formatKRW(Number(coin.price_usd) * exchangeRate)}</span>

              <Change $positive={Number(coin.percent_change_24h) >= 0}>
                {Number(coin.percent_change_24h) > 0 ? "+" : ""}
                {coin.percent_change_24h}%
              </Change>
            </CoinRow>
          ))}
        </Card>
      </Container>
    </Main>
  );
}

export default CoinTracker;
