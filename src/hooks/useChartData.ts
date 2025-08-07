import { useQuery } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";
import { fetchCoinHistory } from "../api";

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

interface ChartData {
    series: ApexAxisChartSeries;
    options: ApexCharts.ApexOptions;
    isLoading: boolean;
}

export function useChartData(coinId: string): ChartData {
    const isDark = useRecoilValue(isDarkAtom);
    
    const { isLoading, data } = useQuery<IHistorical[]>({
        queryKey: ["ohlcv", coinId],
        queryFn: () => fetchCoinHistory(coinId),
        refetchInterval: 5000,
    });

    // Chart series 데이터 생성
    const series: ApexAxisChartSeries = [
        {
            name: "Price",
            data: data?.map(price => [
                new Date(price.time_close).getTime(),
                price.open,
                price.high,
                price.low,
                price.close
            ]) || [],
        },
    ];

    // Chart options 설정
    const options = {
        theme: {
            mode: isDark ? "dark" : "light",
        },
        chart: {
            toolbar: {
                show: false,
            },
            height: 300,
            width: 500,
            background: "transparent",
        },
        grid: {
            show: false,
        },
        yaxis: {
            show: false,
        },
        xaxis: {
            labels: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
            type: "datetime" as const,
            categories: data?.map((price) => price.time_close) || [],
        },
        tooltip: {
            y: {
                formatter: (value: number) => `$${value.toFixed(2)}`,
            },
        },
    };

    return {
        series,
        options: options as ApexCharts.ApexOptions,
        isLoading,
    };
}
