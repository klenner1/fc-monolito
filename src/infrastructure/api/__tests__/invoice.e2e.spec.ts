import { Umzug } from "umzug";
import Address from "../../../modules/@shared/domain/value-object/address";
import InvoiceItem from "../../../modules/invoice/domain/invoice-items.entity";
import Invoice from "../../../modules/invoice/domain/invoice.entity";
import InvoiceRepository from "../../../modules/invoice/repository/invoice.repository";
import { GenerateInvoiceUseCaseInputDto } from "../../../modules/invoice/usecase/generate-invoice/generate-invoice.usecase.dto";
import { app, sequelize } from "../express";
import request from "supertest";
import { migrator } from "../../db/config/migrator ";

describe("E2E test for invoice", () => {
  let migration: Umzug<any>;

  beforeEach(async () => {
    migration = migrator(sequelize);
    //await sequelize.sync({ force: true });
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
    await sequelize.close()
    //await sequelize.close();
  });

  it("should generate an invoice", async () => {
    //Arrange 
    const input = {
      name: "Fulano",
      document: "12345678900",
      street: "Rua 1",
      number: "123",
      complement: "Complemento",
      city: "Cidade",
      state: "Estado",
      zipCode: "12345678",
      items: [
        {
          name: "Item 1",
          price: 1000,
        },
      ],
    } as GenerateInvoiceUseCaseInputDto;
    // Act
    const response = await request(app)
      .post("/invoice/")
      .send(input);
    // Assert
    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe("Fulano");
    expect(response.body.total).toBe(1000);
  });


  it("should find an invoice", async () => {
    //Arrange
    const input = {
      name: "Fulano",
      document: "12345678900",
      street: "Rua 1",
      number: "123",
      complement: "Complemento",
      city: "Cidade",
      state: "Estado",
      zipCode: "12345678",
      items: [
        {
          name: "Item 1",
          price: 1000,
        },
      ],
    } as GenerateInvoiceUseCaseInputDto;
    const responseArrange = await request(app)
      .post("/invoice/")
      .send(input);
    const id = responseArrange.body.id;
    // Act
    const response = await request(app)
      .get(`/invoice/${id}`)
      .send();
    // Assert
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Fulano");
    expect(response.body.total).toBe(1000);
  });

  it("should not find a invoice", async () => {
    const response = await request(app)
      .get("/invoice/1")
      .send();
    expect(response.status).toBe(500);
  });

});
