import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

let appAccessToken = null;

const getAccessToken = async () => {
  if (appAccessToken) return appAccessToken;

  try {
    const response = await axios.post(
      "https://id.twitch.tv/oauth2/token",
      null,
      {
        params: {
          client_id: process.env.TWITCH_CLIENT_ID,
          client_secret: process.env.TWITCH_CLIENT_SECRET,
          grant_type: "client_credentials",
        },
      },
    );
    appAccessToken = response.data.access_token;
    return appAccessToken;
  } catch (err) {
    console.error("Error fetching Twitch token:", err);
    return null;
  }
};

export const getStreamStatus = async (username) => {
  try {
    const token = await getAccessToken();
    if (!token) throw new Error("No Twitch token available");

    const response = await axios.get(`https://api.twitch.tv/helix/streams`, {
      headers: {
        "Client-ID": process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
      params: {
        user_login: username,
      },
    });

    const stream = response.data.data[0];
    return stream ? { isLive: true, ...stream } : { isLive: false };
  } catch (err) {
    console.error(
      "Error checking stream status:",
      err.response?.data || err.message,
    );
    return { isLive: false, error: true };
  }
};
