import { useOutletContext } from "react-router-dom";
import ApexChart from "react-apexcharts";
import { useChartData } from "../hooks/useChartData";

interface ChartProps {
    coinId: string;
    isDark: boolean;
}

function Chart() {
    const { coinId } = useOutletContext<ChartProps>();
    const { series, options, isLoading } = useChartData(coinId);

    return (
        <div>
            {isLoading ? (
                "Loading chart..."
            ) : (
                <ApexChart
                    type="candlestick"
                    series={series}
                    options={options}
                />
            )}
        </div>
    );
}

export default Chart;
