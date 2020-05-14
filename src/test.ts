import User from "models/User";

describe("User model", () => {
  it("creates a new user and sets the hash", async () => {
    const user = new User();

    const payload = {
      name: "robert",
      email: "robert@robert.com",
      password: "password",
    };

    user.name = payload.name;
    user.email = payload.email;
    await user.setHash("password");

    expect(user.validatePayload(payload));
    expect(user.hash).not.toBeUndefined();
    expect(user.name).toBe(payload.name);
    expect(user.email).toBe(payload.email);
  });
});
