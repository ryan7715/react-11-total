import {createGlobalStyle} from "styled-components";

const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    html, body, #root {
        width: 100%;
        min-height: 100%;
    }

    body {
        font-family: Arial, "Noto Sans KR", sans-serif;
        background-color: ${({theme}) => theme.color.background};
        color: ${({theme}) => theme.color.text};
        transition: background-color 0.2s ease, color 0.2s ease;
    }

    button, input, textarea, select {
        font: inherit;
    }

    button {
        cursor: pointer;
    }

    a {
        color: inherit;
        text-decoration: none;
    }
`;

export default GlobalStyle;

