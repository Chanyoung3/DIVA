import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Container from "@mui/material/Container";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Main from './components/js/main';
import Viewer from './components/js/viewer'
import Login from './components/js/login'

const queryClient = new QueryClient();

function App() {
    return (
        <Container maxWidth="xl">
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<Main />} />
                        <Route path="/view/:studyUid" element={<Viewer />} />
                    </Routes>
                </BrowserRouter>
            </QueryClientProvider>
        </Container>
    );
}

export default App;
