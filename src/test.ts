import User from "models/User.ts";

describe("User model", () => {
  it("creates a new user and sets the hash", async () => {
    const user = new User();
    const name = "Robert";
    const email = "robert@robert.com";

    user.name = name;
    user.email = email;
    await user.setHash("password");

    expect(user.hash).not.toBeUndefined();
    expect(user.name).toBe(name);
    expect(user.email).toBe(email);
  });
});
