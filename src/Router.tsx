import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Coins from "./routes/Coins";
import Coin from "./routes/Coin";
import Chart from "./routes/Chart";
import Price from "./routes/Price";

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Coins />} />
                    <Route path=":coinId" element={<Coin />}>
                        <Route path="price" element={<Price />} />
                        <Route path="chart" element={<Chart />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
