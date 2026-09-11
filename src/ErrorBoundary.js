import React from "react";
import "./ErrorBoundary.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-page-container">
          <div className="error-page-content">
            <h1 className="error-page-title">Something went wrong</h1>
            <p className="error-page-text">
              We apologize, but an unexpected error has occurred. Please try refreshing the page or navigating back to our home page.
            </p>
            <button 
              className="error-page-btn" 
              onClick={() => window.location.href = "/"}
            >
              Return Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
