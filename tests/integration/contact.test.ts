import request from "supertest";
import app from "../../src/app";

vi.mock('../../src/services/emailService', () => ({
    sendContactEmail: vi.fn().mockResolvedValue(undefined)
}));

describe("POST /contact", () => {
    it("should send email successfully with valid data", async () => {
        const validData = {
            name: "test",
            email: "test@test.com",
            message: "This is a valid message with enough characters.",
        };
        const response = await request(app)
            .post("/contact")
            .send(validData)
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Email sent successfully");
    });

    it("should return 400 for invalid email", async () => {
        const validData = {
            name: "test",
            email: "testtestcom",
            message: "This is a valid message with enough characters.",
        };
        const response = await request(app)
            .post("/contact")
            .send(validData)
            .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Validation error");
    });

    it("should return 400 for missing fields", async () => {
        const validData = {
            name: "test",
            email: "test@test.com",
            // message is missing
        };
        const response = await request(app)
            .post("/contact")
            .send(validData)
            .expect(400);

        console.log(response.body);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Validation error");
    });

    it("should return 400 when the message is too short", async () => {
        const validData = {
            name: "test",
            email: "test@test.com",
            message: "Test",
        };
        const response = await request(app)
            .post("/contact")
            .send(validData)
            .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Validation error");
    });

    it("should return 400 when the name is too short", async () => {
        const validData = {
            name: "t",
            email: "test@test.com",
            message: "This is a valid message with enough characters.",
        };
        const response = await request(app)
            .post("/contact")
            .send(validData)
            .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Validation error");
    });

    it("should return 400 when the name is too long", async () => {
        const validData = {
            name: "t".repeat(101),
            email: "test@test.com",
            message: "This is a valid message with enough characters.",
        };
        const response = await request(app)
            .post("/contact")
            .send(validData)
            .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Validation error");
    });

    it("should return 400 when the message is too long", async () => {
        const validData = {
            name: "test",
            email: "test@test.com",
            message: "t".repeat(5001),
        };
        const response = await request(app)
            .post("/contact")
            .send(validData)
            .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Validation error");
    });
});
