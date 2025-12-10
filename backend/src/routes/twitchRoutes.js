import express from "express";
import { getStreamStatus } from "../services/twitchService.js";

const router = express.Router();

router.get("/status/:username", async (req, res) => {
  const { username } = req.params;
  const status = await getStreamStatus(username);
  res.json(status);
});

export default router;
