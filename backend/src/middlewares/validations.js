export const validateRegister = (body) => {
  if (!body || Object.keys(body).length !== 3) {
    throw new Error("Invalid body.");
  }
  if (!body.username || typeof body.username !== "string") {
    throw new Error("Invalid username.");
  }
  if (!body.password || typeof body.password !== "string") {
    throw new Error("Invalid password.");
  }
  if (!body.email_address || typeof body.email_address !== "string") {
    throw new Error("Invalid email address.");
  }
};

export const validateLogin = (body) => {};
