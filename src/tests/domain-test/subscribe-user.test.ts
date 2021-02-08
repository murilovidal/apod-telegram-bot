// import { subscribeUser } from "../../domain/subscribe-user.use-case";
// import { expect } from "chai";
// import "mocha";
// import { User } from "../../data/entity/User.entity";

// describe("Should return a true when the user is registered in database", () => {
//   it("Returns true", async () => {
//     let user = new User();
//     user.firstName = "Rorschasch";
//     user.id = 123445;
//     expect(await subscribeUser(user)).to.be.true;
//   });
// });

// describe("Should return error when saving the user fails", () => {
//   it("Returns error", async () => {
//     const user = new User();
//     user.firstName = "Rorschasch";
//     user.id = 123;
//     try {
//       return await subscribeUser(user);
//     } catch (error) {
//       expect(error.message).to.be.eq("Failed to create user.");
//     }
//   });
// });

// describe("Should return 'User already registered'", () => {
//   it("Returns message", async () => {
//     const user = new User();
//     user.firstName = "Rorschasch";
//     user.id = 123;
//     await subscribeUser(user);
//     try {
//       console.log(await subscribeUser(user));
//     } catch (error) {
//       console.log(error);

//       expect(error.message).to.be.eq("User already set in database");
//     }
//   });
// });
