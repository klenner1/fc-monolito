import { Umzug } from "umzug";
import { app, sequelize } from "../express";
import request from "supertest";
import { migrator } from "../../db/config/migrator ";
import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../modules/store-catalog/repository/product.model";
import { ProductModel as AdmProductModel } from "../../../modules/product-adm/repository/product.model";

describe("E2E test for product", () => {

  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ":memory:",
      logging: false
    });

    sequelize.addModels([ProductModel, AdmProductModel]);
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

  it("should update sales-price from product", async () => {
    //arrange
    const responseCreate = await request(app)
      .post("/adm/products")
      .send({
        name: "Car",
        description: "A nice car",
        purchasePrice: 500,
        stock: 50
      });

    //act
    const response = await request(app)
      .patch(`/catalog/products/${responseCreate.body.id}/sales-price`)
      .send({
        salesPrice: 1500
      });

    expect(response.status).toBe(200);
    expect(response.body.id).not.toBeNull();
    expect(response.body.name).toBe("Car");
    expect(response.body.salesPrice).toBe(1500);
  });

});
