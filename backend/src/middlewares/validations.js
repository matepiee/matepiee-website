export const validateRegister = (body) => {
  const { username, password, email, email_address } = body;

  const finalEmail = email || email_address;

  if (!body) {
    throw new Error("Invalid body.");
  }

  if (!username || typeof username !== "string") {
    throw new Error("Invalid username.");
  }

  if (!password || typeof password !== "string") {
    throw new Error("Invalid password.");
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,16}$/;

  if (!passwordRegex.test(password)) {
    throw new Error(
      "Password must be 6-16 characters, include upper and lowercase, number and symbol",
    );
  }

  if (!finalEmail || typeof finalEmail !== "string") {
    throw new Error("Invalid email address.");
  }
};

export const validateLogin = (body) => {
  const { username, email, password } = body;

  const identifier = username || email;

  if (!identifier || typeof identifier !== "string") {
    throw new Error("Username or Email is required.");
  }
  if (!password || typeof password !== "string") {
    throw new Error("Password is required.");
  }
};
