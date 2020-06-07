import React, { Component } from 'react';

console.log(process.env.PUBLIC_URL);
const logger = window.require('../src/winston');

class ErrorBoundary extends Component {
    constructor(props){
        super(props);

        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error){
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        logger.error(`${error} ${errorInfo}`);
      }
    
      render() {
        if (this.state.hasError) {
          return <h1>Something went wrong.</h1>;
        }
        return this.props.children; 
      }
}

export default ErrorBoundary;