import request from "supertest";
import app from "../app.js";
import prisma from "../configs/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

describe("getListProduct", () => {

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
        const res = await request(app).get("/api/product");

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe("Token required");
    });
});