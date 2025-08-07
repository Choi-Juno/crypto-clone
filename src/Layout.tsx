import { Outlet } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { isTitleAtom, isDarkAtom } from "./atoms";
import { Link } from "react-router-dom";

const Container = styled.div`
    padding: 0px 20px;
    max-width: 480px;
    margin: 0 auto;
`;

const Header = styled.header`
    height: 10vh;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const LinkHome = styled(Link)`
    font-size: 48px;
    color: ${(props) => props.theme.accentColor};
`;

const ToggleButton = styled.button`
    background: ${(props) => props.theme.backgroundColor};
    border: 2px solid ${(props) => props.theme.accentColor};
    border-radius: 30px;
    width: 60px;
    height: 30px;
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        transform: scale(1.05);
    }

    &::before {
        content: "";
        position: absolute;
        top: 2px;
        left: ${(props) => (props.theme.isDark ? "32px" : "2px")};
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: ${(props) => props.theme.accentColor};
        transition: all 0.3s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
`;

const SunIcon = styled.span`
    position: absolute;
    top: 50%;
    left: 6px;
    transform: translateY(-50%);
    font-size: 12px;
    opacity: ${(props) => (props.theme.isDark ? 0.3 : 1)};
    transition: opacity 0.3s ease;
`;

const MoonIcon = styled.span`
    position: absolute;
    top: 50%;
    right: 6px;
    transform: translateY(-50%);
    font-size: 12px;
    opacity: ${(props) => (props.theme.isDark ? 1 : 0.3)};
    transition: opacity 0.3s ease;
`;

function Layout() {
    const title = useRecoilValue(isTitleAtom);
    const setIsDark = useSetRecoilState(isDarkAtom);

    const toggleDarkMode = () => {
        setIsDark((prev) => !prev);
    };

    return (
        <Container>
            <Header>
                <LinkHome to="/">{title}</LinkHome>
                <ToggleButton onClick={toggleDarkMode}>
                    <SunIcon>☀️</SunIcon>
                    <MoonIcon>🌙</MoonIcon>
                </ToggleButton>
            </Header>
            <Outlet />
        </Container>
    );
}

export default Layout;
