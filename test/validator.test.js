jest.mock("node:fs", () => ({
  promises: {
    access: jest.fn(),
    stat: jest.fn(),
  },
}));

jest.mock(
  "@actions/core",
  () => ({
    warning: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
  }),
  { virtual: true },
);

const validator = require("../src/validator");
const fs = require("node:fs").promises;
const core = require("@actions/core");

describe("Validation tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("validateCliqUrl should accept valid URLs", () => {
    const validUrl =
      "https://cliq.zoho.com/company/123456/webhook/abcdef?botname=testing";
    expect(() => validator.validateCliqUrl(validUrl)).not.toThrow();
  });

  test("validateCliqUrl should show a warning on invalid URLs", () => {
    const invalidUrl = "https://webhbook.com/2345t6";
    validator.validateCliqUrl(invalidUrl);
    expect(core.warning).toHaveBeenCalled();
  });

  test("validateCliqUrl should throw an error on empty url", () => {
    const emptyUrl = "";
    expect(() => validator.validateCliqUrl(emptyUrl)).toThrow(Error);
  });

  test("validateMessage should throw an error on empty message", () => {
    const emptyMessage = "";
    expect(() => validator.validateMessage(emptyMessage)).toThrow(Error);
  });

  test("validateMessage should trim message", () => {
    const message = "hello ";
    const result = validator.validateMessage(message);
    expect(result).toMatch(message.trim());
  });

  test("validateFile should throw an error if path is empty", async () => {
    const emptyPath = "";
    await expect(validator.validateFile(emptyPath)).rejects.toThrow(Error);
  });

  test("validateFile should throw an error if file is not found ", async () => {
    fs.access.mockRejectedValue(new Error("File not found"));

    const filePath = "./test.txt";
    await expect(validator.validateFile(filePath)).rejects.toThrow(Error);
  });

  test("validateFile should not throw an error if file isfound ", async () => {
    fs.access.mockResolvedValue();
    fs.stat.mockResolvedValue({ size: 10240 });

    const filePath = "./test.txt";
    await expect(validator.validateFile(filePath)).resolves.not.toThrow();
  });

  test("validateFile should throw an error if size exceeds the limit", async () => {
    fs.access.mockResolvedValue();
    fs.stat.mockResolvedValue({ size: 1024000000 });

    const filePath = "./test.txt";
    await expect(validator.validateFile(filePath)).rejects.toThrow(Error);
  });

  test("validateInputs should throw errors if a file and message are not passed", async () => {
    let inputs = {
      cliqUrl: "https://webhbook.com/2345t6",
    };
    await expect(validator.validateInputs(inputs)).rejects.toThrow(Error);

    inputs = {
      cliqUrl: "https://webhbook.com/2345t6",
      message: "hello",
      file: "./test.txt",
    };
    fs.access.mockResolvedValue();
    fs.stat.mockResolvedValue({ size: 10240 });

    await expect(validator.validateInputs(inputs)).rejects.toThrow(Error);
  });
});
