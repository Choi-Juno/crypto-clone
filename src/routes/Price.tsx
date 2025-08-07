import { useOutletContext } from "react-router-dom";
import { fetchCoinHistory } from "../api";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";

interface IHistorical {
    time_open: string;
    time_close: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    market_cap: number;
}

interface PriceProps {
    coinId: string;
}

interface IPriceData {
    date: string;
    price: number;
    change: number;
    changePercent: number;
}

const Container = styled.div`
    padding: 20px;
`;

const Title = styled.h2`
    font-size: 24px;
    margin-bottom: 20px;
    color: ${(props) => props.theme.textColor};
`;

const PriceTable = styled.div`
    background: ${(props) => props.theme.backgroundColor};
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
`;

const TableHeader = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 15px;
    padding: 15px 0;
    font-weight: 600;
    font-size: 14px;
    color: ${(props) => props.theme.textColor};
    border-bottom: 1px solid ${(props) => props.theme.textColor}20;
    margin-bottom: 10px;
`;

const TableRow = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 15px;
    padding: 12px 0;
    border-bottom: 1px solid ${(props) => props.theme.textColor}10;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background: ${(props) => props.theme.textColor}05;
        border-radius: 5px;
    }
`;

const DateCell = styled.div`
    font-size: 14px;
    color: ${(props) => props.theme.textColor};
`;

const PriceCell = styled.div`
    font-size: 14px;
    font-weight: 500;
    color: ${(props) => props.theme.textColor};
`;

const ChangeCell = styled.div<{ isPositive: boolean }>`
    font-size: 14px;
    font-weight: 500;
    color: ${(props) => (props.isPositive ? "#2ed573" : "#ff4757")};
`;

const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    font-size: 18px;
    color: ${(props) => props.theme.textColor};
`;

function Price() {
    const { coinId } = useOutletContext<PriceProps>();
    const { isLoading, data } = useQuery<IHistorical[]>({
        queryKey: ["ohlcv", coinId],
        queryFn: () => fetchCoinHistory(coinId),
    });

    const processedData: IPriceData[] = data?.length
        ? data
              ?.map((item, index) => {
                  const currentPrice = Number(item.close) || 0;
                  const previousPrice =
                      index > 0
                          ? Number(data[index - 1].close) || 0
                          : currentPrice;
                  const change = currentPrice - previousPrice;
                  const changePercent =
                      index > 0 && previousPrice !== 0
                          ? (change / previousPrice) * 100
                          : 0;
                  // 날짜 파싱 개선 - Unix timestamp 처리
                  const parseDate = (dateValue: string | number) => {
                      if (!dateValue) return "Invalid Date";

                      // Unix timestamp (seconds)인 경우 milliseconds로 변환
                      const timestamp =
                          typeof dateValue === "string"
                              ? parseInt(dateValue)
                              : dateValue;
                      const date =
                          timestamp > 10000000000
                              ? new Date(timestamp)
                              : new Date(timestamp * 1000);

                      // 디버깅용 로그 (첫 번째 아이템만)
                      if (index === 0) {
                          console.log("Date parsing debug:", {
                              original: dateValue,
                              timestamp,
                              isMs: timestamp > 10000000000,
                              parsedDate: date,
                              formatted: date.toLocaleDateString("ko-KR"),
                          });
                      }

                      return date.toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                      });
                  };

                  return {
                      date: parseDate(item.time_close),
                      price: currentPrice,
                      change: change,
                      changePercent: changePercent,
                  };
              })
              .reverse() || []
        : [];

    return (
        <Container>
            {isLoading ? (
                <LoadingContainer>Loading price data...</LoadingContainer>
            ) : (
                <>
                    <Title>일자별 가격 정보</Title>
                    <PriceTable>
                        <TableHeader>
                            <div>날짜</div>
                            <div>종가</div>
                            <div>등락액</div>
                            <div>등락률</div>
                        </TableHeader>
                        {processedData.length > 0 ? (
                            processedData.slice(0, 20).map((item, index) => (
                                <TableRow key={index}>
                                    <DateCell>{item.date}</DateCell>
                                    <PriceCell>
                                        $
                                        {typeof item.price === "number"
                                            ? item.price.toFixed(2)
                                            : "N/A"}
                                    </PriceCell>
                                    <ChangeCell isPositive={item.change >= 0}>
                                        {typeof item.change === "number" ? (
                                            <>
                                                {item.change >= 0 ? "+" : ""}$
                                                {Math.abs(item.change).toFixed(
                                                    4
                                                )}
                                            </>
                                        ) : (
                                            "N/A"
                                        )}
                                    </ChangeCell>
                                    <ChangeCell
                                        isPositive={item.changePercent >= 0}
                                    >
                                        {typeof item.changePercent ===
                                        "number" ? (
                                            <>
                                                {item.changePercent >= 0
                                                    ? "+"
                                                    : ""}
                                                {item.changePercent.toFixed(2)}%
                                            </>
                                        ) : (
                                            "N/A"
                                        )}
                                    </ChangeCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <DateCell
                                    style={{
                                        gridColumn: "1 / -1",
                                        textAlign: "center",
                                        padding: "20px",
                                    }}
                                >
                                    데이터가 없습니다. Raw data:{" "}
                                    {JSON.stringify(data?.slice(0, 2))}
                                </DateCell>
                            </TableRow>
                        )}
                    </PriceTable>
                </>
            )}
        </Container>
    );
}

export default Price;
