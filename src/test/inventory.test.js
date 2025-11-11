import request from "supertest";
import app from "../app.js";
import prisma from "../configs/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

describe("Inventory API", () => {

    let token;

    beforeAll(async () => {
        const randName = `tester_${Math.floor(Math.random() * 1000)}`;
        const randEmail = `tester_${Math.floor(Math.random() * 1000)}@example.com`;
        const hashed = await bcrypt.hash("123456", 10);

        const user = await prisma.user.create({
            data: {
                name: randName,
                email: randEmail,
                password: hashed
            }
        });

        token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    test("Should reject request without token", async () => {
        const res = await request(app).get("/api/inventories");

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe("Token required");
    });

    test("Should create inventory", async () => {
        const res = await request(app)
            .post("/api/inventories")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Laptop",
                description: "ThinkPad X1"
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe("Laptop");
    });

    test("Should get list of inventories", async () => {
        const res = await request(app)
            .get("/api/inventories")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
    });

    test("Should get inventory detail", async () => {
        const inv = await prisma.inventory.findFirst();

        const res = await request(app)
            .get(`/api/inventories/${inv.id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.id).toBe(inv.id);
    });

    test("Should update inventory", async () => {
        const inv = await prisma.inventory.findFirst();

        const res = await request(app)
            .put(`/api/inventories/${inv.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Updated Laptop",
                description: "Updated Description"
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe("Updated Laptop");
    });

    test("Should delete inventory", async () => {
        const inv = await prisma.inventory.findFirst();

        const res = await request(app)
            .delete(`/api/inventories/${inv.id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    test("Should return inventory not found", async () => {
        const res = await request(app)
            .get("/api/inventories/unknown-id")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe("Inventory not found");
    });
});
