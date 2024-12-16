const axios = require("axios");

const BASE_URL = "http://localhost:3000/api/auth";

async function testRegister() {
  try {
    const response = await axios.post(`${BASE_URL}/register`, {
      name: "Test User",
      email: "test@example.com",
      password: "password123"
    });
    console.log("Register Response:", response.data);
  } catch (err) {
    console.error("Register Error:", err.response.data || err.message);
  }
}

async function testLogin() {
  try {
    const response = await axios.post(`${BASE_URL}/login`, {
      email: "test@example.com",
      password: "password123"
    });
    console.log("Login Response:", response.data);
  } catch (err) {
    console.error("Login Error:", err.response.data || err.message);
  }
}

testRegister();
testLogin();
