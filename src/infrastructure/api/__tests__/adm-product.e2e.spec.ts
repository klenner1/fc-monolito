import { Umzug } from "umzug";
import { app, sequelize } from "../express";
import request from "supertest";
import { migrator } from "../../db/config/migrator ";
import { ProductModel } from "../../../modules/product-adm/repository/product.model";
import { Sequelize } from "sequelize-typescript";

describe("E2E test for product", () => {

  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ":memory:",
      logging: false
    });

    sequelize.addModels([ProductModel]);
    migration = migrator(sequelize);

  });

  beforeEach(async () => {
    await migration.up();
  });

  afterEach(async () => {
    if (!migration || !sequelize) {
      return
    }
    migration = migrator(sequelize)
    await migration.down()
  })


  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app)
      .post("/adm/products")
      .send({
        name: "Car",
        description: "A nice car",
        purchasePrice: 500,
        stock: 50
      });
      
    expect(response.status).toBe(200);
    expect(response.body.id).not.toBeNull();
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe("Car");
    expect(response.body.purchasePrice).toBe(500);
  });
});
