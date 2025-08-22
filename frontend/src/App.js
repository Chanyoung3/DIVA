import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Container from "@mui/material/Container";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Main from './components/js/main';
import Viewer from './components/js/viewer'

const queryClient = new QueryClient();

function App() {
    return (
        <Container maxWidth="xl">
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Routes>
                        {/* 2. Route 문법 수정 */}
                        <Route path="/" element={<Main />} />
                        <Route path="/view" element={<Viewer />} />
                    </Routes>
                </BrowserRouter>
            </QueryClientProvider>
        </Container>
    );
}

export default App;
