#!/bin/bash
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    npm install react-router-dom
fi
echo "Starting site..."
npm start