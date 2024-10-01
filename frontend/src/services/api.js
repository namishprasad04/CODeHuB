const API_URL = "http://localhost:5000/api";

export const register = async (username, email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export async function fetchProblem(id) {
  const response = await fetch(`http://localhost:5000/api/problems/${id}`);
  if (!response.ok) {
    throw new Error("Problem not found");
  }
  return await response.json();
}


// Services to interact with the backend API
export const submitCode = async (id, status) => {
  console.log(id, status.toLowerCase());
  try {
    const response = await fetch(`${API_URL}/code/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id, // The problem's ID
        status: status.toLowerCase(), // Convert status to lowercase
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to submit code");
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting code:", error);
    throw error;
  }
};
