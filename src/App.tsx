import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Chat from "./pages/Chat";
import { AuthProvider } from "./context/Auth";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./components/ProtectedRoute";
import Signup from "./pages/Signup";
import MainChat from "./pages/MainChat";
import "swiper/css";
import { useEffect } from "react";
import useThemeDetector from "./hooks/themeDetector";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

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
      <Route path="/" element={<ProtectedRoute />}>
        <Route index element={<Home />} />
        <Route path="chat/:id" element={<Chat />} />
        <Route path="main/:roomId" element={<MainChat />}></Route>
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </>
  )
);

function App() {
  const isDarkTheme = useThemeDetector();
  useEffect(() => {
    document.body.classList.add(isDarkTheme ? "dark" : "light");
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
