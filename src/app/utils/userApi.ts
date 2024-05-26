import axios from "axios";

// Create an Axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:4001", // Replace with your server URL
  // baseURL: "https://data-neuron-backend-3pwc.onrender.com", // Replace with your server URL
});

// Define routes
const userRoutes = {
  login: "/user/login",
  register: "/user/register",
  shortenUrl: "/user/shortenUrl",
  deleteHash: "/user/deleteHash",
  allUrls: "/user/allUrls",
  redirectUrl: "/user/redirectUrl",
};

export interface ISignUp {
  email: string;
  name: string;
  password: string;
}

export interface IUser extends Document {
  _id: String;
  name: string;
  email: string;
  password: string;
}

export interface IUrl {
  _id: string;
  originalUrl: string;
  hash: string;
  clicks: number;
  maxUses: number;
  remainingUses: number;
  userId: string;
  createdAt: Date;
  __v: number;
  fullUrl: string;
}

export async function register(
  data: ISignUp
): Promise<{ user: IUser; token: string }> {
  try {
    const response = await api.post(userRoutes.register, data);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<{ user: IUser; token: string }> {
  try {
    const response = await api.post(userRoutes.login, data);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

export async function shortenUrl(
  data: {
    originalUrl: string;
    maxUses: number;
  },
  jwt: string
): Promise<{ shortUrl: string }> {
  try {
    const response = await api.put(userRoutes.shortenUrl, data, {
      headers: {
        Authorization: jwt,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

export async function deleteHash(
  data: { hash: string },
  jwt: string
): Promise<{}> {
  try {
    const response = await api.post(userRoutes.deleteHash, data, {
      headers: {
        Authorization: jwt,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

export async function getAllUrls(jwt: string): Promise<IUrl[]> {
  try {
    const response = await api.get(userRoutes.allUrls, {
      headers: {
        Authorization: jwt,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

export async function getRedirectUrl(data: {
  userId: string;
  hash: string;
}): Promise<{ shortUrl: string }> {
  try {
    const response = await api.post(
      userRoutes.redirectUrl + "/" + data.userId + "/" + data.hash
    );
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}
