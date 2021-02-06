import { subscribeUser } from "../../domain/subscribe-user.use-case";
import { expect } from "chai";
import "mocha";
import { User } from "../../data/entity/User.entity";

// describe("Should return a true when the user is registered in database", () => {
//   it("Returns true", async () => {
//     let user = new User();
//     user.firstName = "Timber";
//     user.id = 123445;
//     return await subscribeUser(user).then((result) => {
//       expect(result).to.equal(true);
//     });
//   });
// });

// describe("Should return error when saving the user fails", () => {
//   it("Returns error", () => {
//     const user = new User();
//     user.firstName = "Timber";
//     user.id = 123;
//     return subscribeUser(user).then((result) => {
//       expect(result).to.throw("Error");
//     });
//   });
// });

// describe("Should return 'User already registered'", () => {
//   it("Returns message", () => {
//     const user = new User();
//     user.firstName = "Timber";
//     user.id = 123;
//     subscribeUser(user);
//     return subscribeUser(user).then((result) => {
//       expect(result).to.be.an("error");
//     });
//   });
// });
