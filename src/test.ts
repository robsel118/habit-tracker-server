import User from "./models/User";
import { assert, expect } from "chai";

describe("User model", () => {
  it("creates a new user and sets the hash", () => {
    let user = new User();
    const name = "Robert"
    const email = "robert@robert.com"

    user.name = name;
    user.email = email;
    user.setHash("password");

    expect(user.name).to.equal(name);
    expect(user.email).to.equal(email);
    assert.isNotNull(user.hash, "Hash was set");
  });
});
