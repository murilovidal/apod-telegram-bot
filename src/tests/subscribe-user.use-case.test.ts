import { helloTest } from "../use-case/subscribe-user.use-case";
import { expect } from "chai";
import "mocha";

describe("Primeiro teste", () => {
  it("retorna true", () => {
    const result = helloTest();
    expect(result).to.equal(true);
  });
});
