import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import HallOfFame from './pages/HallOfFame';
import Blog from './pages/Blog';
import Article from './pages/Article';
import ScrollToTop from './components/ScrollToTop';

import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import AdminLayout from './components/AdminLayout';

const Login = React.lazy(() => import('./pages/admin/Login'));
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const ArticleEditor = React.lazy(() => import('./pages/admin/ArticleEditor'));

const TeamManager = React.lazy(() => import('./pages/admin/TeamManager'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="hall-of-fame" element={<HallOfFame />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:id" element={<Article />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={
            <React.Suspense fallback={<div>Chargement...</div>}><Login /></React.Suspense>
          } />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={
              <React.Suspense fallback={<div>Chargement...</div>}><Dashboard /></React.Suspense>
            } />
            <Route path="articles/new" element={
              <React.Suspense fallback={<div>Chargement...</div>}><ArticleEditor /></React.Suspense>
            } />
            <Route path="articles/edit/:id" element={
              <React.Suspense fallback={<div>Chargement...</div>}><ArticleEditor /></React.Suspense>
            } />
            <Route path="articles" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="hall-of-fame" element={
              <React.Suspense fallback={<div>Chargement...</div>}><TeamManager /></React.Suspense>
            } />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
