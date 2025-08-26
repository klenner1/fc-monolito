import { Umzug } from "umzug";
import { migrator } from "../../db/config/migrator ";
import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for client", () => {
  let migration: Umzug<any>;

  beforeEach(async () => {
    migration = migrator(sequelize);
    await migration.up();
  });

  afterEach(async () => {
    if (!migration || !sequelize) {
      return
    }
    migration = migrator(sequelize)
    await migration.down()
    await sequelize.close()
  })

  it("should create a client", async () => {
    const body = {
      name: "Fulano de Tal",
      email: "Fulano@detal.com",
      document: "12345678900",
      description: "Um cliente",
      address: {
        street: "Rua tal",
        number: "123",
        complement: "Complemento",
        city: "Cidade",
        state: "Estado",
        zipCode: "12345678"
      }
    };
    const response = await request(app)
      .post("/clients")
      .send(body);

    expect(response.status).toBe(200);
    expect(response.body.id).not.toBeNull();
    expect(response.body.name).toBe(body.name);
  });

});
