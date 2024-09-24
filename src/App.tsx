import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { AuthProvider } from "./context/Auth";
import Login from "./pages/Login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./components/ProtectedRoute";
import Signup from "./pages/Signup";
import MainChat from "./pages/MainChat";
import "swiper/css";
import { useEffect } from "react";
import useThemeDetector from "./hooks/themeDetector";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import RedirectRoute from "./pages/RedirectRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
});

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/main/:roomId" element={<ProtectedRoute />}>
        <Route index element={<MainChat />}></Route>
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/*" element={<RedirectRoute />} />
    </>
  )
);

function App() {
  const isDarkTheme = useThemeDetector();
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) {
      document.body.classList.add(
        theme === "system" ? (isDarkTheme ? "dark" : "light") : theme
      );
    } else {
      localStorage.setItem("theme", "system");
      document.body.classList.add(isDarkTheme ? "dark" : "light");
    }
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
