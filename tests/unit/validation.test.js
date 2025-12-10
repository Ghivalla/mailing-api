"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validation_1 = require("../../src/utils/validation");
describe("Contact Form Validation", () => {
    it("should accept valid contact form data", () => {
        const validData = {
            name: "test",
            email: "test@test.com",
            message: "This is a valid message with enough characters.",
        };
        const result = validation_1.contactSchema.safeParse(validData);
        expect(result.success).toBe(true);
    });
    it("should reject invalid email", () => {
        const invalidData = {
            name: "test",
            email: "test.com",
            message: "This is a valid message with enough characters.",
        };
        const result = validation_1.contactSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toContain("Invalid email");
        }
    });
    it("should reject too short message", () => {
        const invalidData = {
            name: "test",
            email: "test@test.com",
            message: "invalid",
        };
        const result = validation_1.contactSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toContain("Message must be at least 10 characters");
        }
    });
    it("should reject too short name", () => {
        const invalidData = {
            name: "t",
            email: "test@test.com",
            message: "This is a valid message with enough characters.",
        };
        const result = validation_1.contactSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toContain("Name must be at least 2 characters");
        }
    });
    it("should reject missing fields", () => {
        const invalidData = {
            name: "test",
            email: "test@test.com",
            // message is missing
        };
        const result = validation_1.contactSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
    });
    it("should reject too long message", () => {
        const invalidData = {
            name: "test",
            email: "test@test.com",
            message: "a".repeat(5001),
        };
        const result = validation_1.contactSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
    });
});
describe("sanitizeContactData", () => {
    it("should trim whitespace from all fields", () => {
        const invalidData = {
            name: "   test  ",
            email: " test@test.com     ",
            message: "   This is a valid message with enough characters.   ",
        };
        const sanitized = (0, validation_1.sanitizeContactData)(invalidData);
        expect(sanitized.name).toBe("test");
        expect(sanitized.email).toBe("test@test.com");
        expect(sanitized.message).toBe("This is a valid message with enough characters.");
    });
    it("should lowercase email", () => {
        const invalidData = {
            name: "test",
            email: "TeST@TEST.cOM",
            message: "This is a valid message with enough characters.",
        };
        const sanitized = (0, validation_1.sanitizeContactData)(invalidData);
        expect(sanitized.email).toBe("test@test.com");
    });
});
