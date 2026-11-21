import {RouterProvider} from "react-router";
import {useEffect, useState} from "react";
import {ThemeProvider} from "styled-components";

import GlobalStyle from "./Styles/GlobalStyle.ts";
import AppRouter from "./router/AppRouter.tsx";
import {DarkTheme, LightTheme} from "./Styles/theme.ts";
import {ThemeContext} from "./contexts/theme/ThemeContext.tsx";

function App() {
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme === "dark" ? "dark" : "light";
    });

    useEffect(() => {
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => {
            return prev === "dark" ? "light" : "dark";
        });
    };

    return (
        <ThemeContext.Provider value={{theme: theme, toggleTheme: toggleTheme}}>
            <ThemeProvider theme={theme === "light" ? LightTheme : DarkTheme}>
                <GlobalStyle/>
                <RouterProvider router={AppRouter()}/>
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}

export default App;

