import { useQuery } from "@tanstack/react-query";
import { Link, useMatch } from "react-router-dom";
import { Outlet, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import { Helmet } from "react-helmet-async";
import { useRecoilState } from "recoil";
import { isTitleAtom } from "../atoms";

const Container = styled.div`
    padding: 0px 20px;
    max-width: 480px;
    margin: 0 auto;
`;
const Loader = styled.span`
    text-align: center;
    display: block;
`;

const Overview = styled.div`
    display: flex;
    justify-content: space-between;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 10px 20px;
    border-radius: 10px;
`;

const OverviewItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    span:first-child {
        font-size: 10px;
        font-weight: 400;
        text-transform: uppercase;
        margin-bottom: 5px;
    }
`;

const Description = styled.p`
    margin: 20px 0px;
`;

const TabsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    margin: 25px 0px;
    gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
    text-align: center;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 400;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    color: ${(props) =>
        props.isActive ? props.theme.accentColor : props.theme.textColor};
    a {
        display: block;
        padding: 10px 0px;
    }
`;

interface ITag {
    id: string;
    name: string;
    coin_counter: number;
    ico_counter: number;
}
interface InfoData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    is_new: boolean;
    is_active: boolean;
    type: string;
    logo: string;
    tags: ITag[];
    team: object;
    description: string;
    message: string;
    open_source: boolean;
    started_at: string;
    development_status: string;
    hardware_wallet: boolean;
    proof_type: string;
    org_structure: string;
    hash_algorithm: string;
    links: object;
    links_extended: object;
    whitepaper: object;
    first_data_at: string;
    last_data_at: string;
}
interface PriceData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    total_supply: number;
    max_supply: number;
    beta_value: number;
    first_data_at: string;
    last_updated: string;
    quotes: {
        USD: {
            ath_date: string;
            ath_price: number;
            market_cap: number;
            market_cap_change_24h: number;
            percent_change_1h: number;
            percent_change_1y: number;
            percent_change_6h: number;
            percent_change_7d: number;
            percent_change_12h: number;
            percent_change_15m: number;
            percent_change_24h: number;
            percent_change_30d: number;
            percent_change_30m: number;
            percent_from_price_ath: number;
            price: number;
            volume_24h: number;
            volume_24h_change_24h: number;
        };
    };
}

function Coin() {
    const { coinId } = useParams();
    // const [loading, setLoading] = useState(false);
    const { state } = useLocation();
    // const [info, setInfo] = useState<InfoData | null>(null);
    // const [priceInfo, setPriceInfo] = useState<PriceData | null>(null);

    const chartMatch = useMatch("/:coinId/chart");
    const priceMatch = useMatch("/:coinId/price");

    // useEffect(() => {
    //     (async () => {
    //         const infoData = await (
    //             await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
    //         ).json();
    //         const priceData = await (
    //             await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
    //         ).json();
    //         setInfo(infoData);
    //         setPriceInfo(priceData);
    //         setLoading(false);
    //     })();
    // }, [coinId]);

    const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>({
        queryKey: ["info", coinId],
        queryFn: () => fetchCoinInfo(coinId!),
    });
    const { isLoading: tickersLoading, data: tickersData } =
        useQuery<PriceData>({
            queryKey: ["tickers", coinId],
            queryFn: () => fetchCoinTickers(coinId!),
        });
    const loading = infoLoading || tickersLoading;

    const validTitle = state?.name
        ? state.name
        : loading
        ? "Loading..."
        : infoData?.name;
    const [title, setTitle] = useRecoilState(isTitleAtom);
    setTitle(validTitle);
    return (
        <Container>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            {loading ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <Overview>
                        <OverviewItem>
                            <span>Rank: </span>
                            <span>{infoData?.rank}</span>
                        </OverviewItem>
                        <OverviewItem>
                            <span>Symbol: </span>
                            <span>{infoData?.symbol}</span>
                        </OverviewItem>
                        <OverviewItem>
                            <span>Price: </span>
                            <span>{tickersData?.quotes.USD.price}</span>
                        </OverviewItem>
                    </Overview>
                    <Description>{infoData?.description}</Description>
                    <Overview>
                        <OverviewItem>
                            <span>Total Supply: </span>
                            <span>{tickersData?.total_supply}</span>
                        </OverviewItem>
                        <OverviewItem>
                            <span>Max Supply: </span>
                            <span>{tickersData?.max_supply}</span>
                        </OverviewItem>
                    </Overview>
                    <TabsContainer>
                        <Tab isActive={chartMatch !== null}>
                            <Link to="chart">Chart</Link>
                        </Tab>
                        <Tab isActive={priceMatch !== null}>
                            <Link to="price">Price</Link>
                        </Tab>
                    </TabsContainer>
                    <Outlet context={{ coinId }} />
                </>
            )}
        </Container>
    );
}

export default Coin;
