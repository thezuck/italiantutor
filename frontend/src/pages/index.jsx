import Layout from "./Layout.jsx";

import Home from "./Home";

import Chat from "./Chat";

import LessonDetail from "./LessonDetail";

import Landing from "./Landing";

import Login from "./Login";

import Register from "./Register";

import ProtectedRoute from "@/components/ProtectedRoute";

import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';

const PAGES = {
    
    Home: Home,
    
    Chat: Chat,
    
    LessonDetail: LessonDetail,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    const { isAuthenticated, loading } = useAuth();
    
    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }
    
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={isAuthenticated ? <Navigate to="/home" replace /> : <Landing />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/home" replace /> : <Register />} />
            
            {/* Protected routes */}
            <Route path="/home" element={
                <ProtectedRoute>
                    <Layout currentPageName="Home">
                        <Home />
                    </Layout>
                </ProtectedRoute>
            } />
            <Route path="/Home" element={
                <ProtectedRoute>
                    <Layout currentPageName="Home">
                        <Home />
                    </Layout>
                </ProtectedRoute>
            } />
            <Route path="/Chat" element={
                <ProtectedRoute>
                    <Layout currentPageName="Chat">
                        <Chat />
                    </Layout>
                </ProtectedRoute>
            } />
            <Route path="/LessonDetail" element={
                <ProtectedRoute>
                    <Layout currentPageName="LessonDetail">
                        <LessonDetail />
                    </Layout>
                </ProtectedRoute>
            } />
            
            {/* Catch all - redirect to login if not authenticated, home if authenticated */}
            <Route path="*" element={isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} />
        </Routes>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}