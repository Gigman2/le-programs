"use client"
import axios from "axios";


let appToken = ""; // Initialize appToken as an empty string
const headers: Record<string, string> = {
    'Content-Type': 'application/json'
}
// Check if we're on the client-side before accessing localStorage
if (typeof window !== "undefined") {
    appToken = localStorage.getItem('auth_token') || '';
    headers['Authorization'] = `Bearer ${appToken}`
}

export const axiosInstance = axios.create({
    baseURL: 'baseUrlHere',
    timeout: 1000,
    headers: headers
});