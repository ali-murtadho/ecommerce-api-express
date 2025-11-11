import request from "supertest";
import app from "../app.js";
import prisma from "../configs/db.js";
import bcrypt from "bcrypt";
describe("POST /api/auth/register", () => {
    test("Should register new user", async () => {
        const uniqueEmail = `john_${Date.now()}@example.com`;

        const res = await request(app).post("/api/auth/register").send({
            name: "John Doe",
            email: uniqueEmail,
            password: "123456",
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.email).toBe(uniqueEmail);
    });

    test("Should return error if email already exist", async () => {
        const email = "duplicate@example.com";

        await prisma.user.create({
            data: {
                name: "John",
                email,
                password: "123456",
            },
        });

        const res = await request(app).post("/api/auth/register").send({
            name: "John",
            email,
            password: "123456",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Email already exist");
    });
});

describe("POST /api/auth/login", () => {
    const email = `user_${Date.now()}@example.com`;
    const password = "123456";

    beforeAll(async () => {
        const hashed = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name: "Test User",
                email,
                password: hashed
            }
        });
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    test("Should login successfully", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email, password });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("User logged in successfully");

        expect(res.body.data).toHaveProperty("id");
        expect(res.body.data.email).toBe(email);
        expect(res.body.data).toHaveProperty("token");

        expect(res.headers["set-cookie"]).toBeDefined();
    });

    test("Should return error if user not found", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: "notfound@example.com",
                password: "123456"
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("User not found");
    });

    test("Should return error for wrong password", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email,
                password: "wrongpassword"
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Invalid password");
    });
});
