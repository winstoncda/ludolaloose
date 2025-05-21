// React
import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

// Pages
import ErrorPage from "./pages/ErrorPage";
import Onboarding from "./pages/Onboarding";
import ForgotPassword from "./pages/ForgotPassword";
import App from "./App";
import Home from "./pages/Home";

// Lazy-loaded pages for better performance
const Register = lazy(() => import("./pages/Register"));
const SignIn = lazy(() => import("./pages/SignIn"));
const AddTraining = lazy(() => import("./pages/AddTraining"));

// Protected route component
const ProtectedRoute = ({ children }) => {
  // We'll use localStorage to check auth state for simplicity
  const isAuthenticated = !!localStorage.getItem("user");

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Onboarding />,
      },
      {
        path: "add-training",
        element: (
          <Suspense
            fallback={
              <div className="loading loading-spinner loading-lg"></div>
            }
          >
            <ProtectedRoute>
              <AddTraining />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "register",
        element: (
          <Suspense
            fallback={
              <div className="loading loading-spinner loading-lg"></div>
            }
          >
            <Register />
          </Suspense>
        ),
      },
      {
        path: "home",
        element: (
          <Suspense
            fallback={
              <div className="loading loading-spinner loading-lg"></div>
            }
          >
            <Home />
          </Suspense>
        ),
      },
      {
        path: "AddTraining",
        element: (
          <Suspense
            fallback={
              <div className="loading loading-spinner loading-lg"></div>
            }
          >
            <AddTraining />
          </Suspense>
        ),
      },
      {
        path: "signin",
        element: (
          <Suspense
            fallback={
              <div className="loading loading-spinner loading-lg"></div>
            }
          >
            <SignIn />
          </Suspense>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <Suspense
            fallback={
              <div className="loading loading-spinner loading-lg"></div>
            }
          >
            <ForgotPassword />
          </Suspense>
        ),
      },
    ],
  },
]);
