const core = require("@actions/core");
const fs = require("node:fs").promises;

/**
 * Validate Cliq webhook URL format
 *
 * @param {string} url - The Cliq webhook URL to validate
 * @returns {string} - Returns the validated URL if it passes basic checks
 * @throws {Error} - Throws error if URL is empty or invalid
 */
function validateCliqUrl(url) {
  if (!url) {
    throw new Error("Cliq-url is required");
  }

  const cliqPattern = /^https:\/\/cliq\.zoho\.com\/[a-zA-Z0-9/_-]+$/;

  if (!cliqPattern.test(url)) {
    core.warning(
      `URL doesn't match typical Zoho Cliq webhook patterns. Proceeding anyway.`,
    );
  }

  return url;
}

/**
 * Validate message content
 *
 * @param {string} message - The message text to validate
 * @returns {string} - Returns trimmed message if valid
 * @throws {Error} - Throws error if message is empty or whitespace only
 */
function validateMessage(message) {
  if (!message || message.trim() === "") {
    throw new Error("Message cannot be empty");
  }

  return message.trim();
}

/**
 * Validate file for upload
 *
 * @param {string} filePath - Path to the file to validate
 * @returns {Promise<string>} - Returns the validated file path
 * @throws {Error} - Throws error if file doesn't exist, is too large, or can't be accessed
 */
async function validateFile(filePath) {
  if (!filePath) {
    throw new Error("File path is required for file upload");
  }

  try {
    await fs.access(filePath);
  } catch {
    throw new Error(` File not found: ${filePath}`);
  }

  const stat = await fs.stat(filePath);
  const maxSize = 50 * 1024 * 1024;

  if (stat.size > maxSize) {
    throw new Error(
      `File size (${stats.size} bytes) exceeds limit of ${maxSize} bytes (50MB) by Zoho CLiq`,
    );
  }

  return filePath;
}

/**
 * Validate all action inputs
 *
 * @param {Object} inputs - Action input parameters
 * @param {string} inputs.cliqUrl - Cliq webhook URL
 * @param {string} [inputs.message] - Optional message text
 * @param {string} [inputs.file] - Optional file path
 * @returns {Promise<Object>} - Returns validated inputs object
 * @throws {Error} - Throws error if validation fails with details
 */
async function validateInputs(inputs) {
  const errors = [];
  const validated = {};

  try {
    validated.cliqUrl = Validator.validateCliqUrl(inputs.cliqUrl);
  } catch (error) {
    errors.push(`cliq-url: ${error.message}`);
  }

  if (inputs.file && inputs.message) {
    errors.push('Cannot provide both "message" and "file" inputs. Choose one.');
  }

  if (!inputs.file && !inputs.message) {
    errors.push('Either "message" or "file" input must be provided');
  }

  if (inputs.message) {
    try {
      validated.message = Validator.validateMessage(inputs.message);
    } catch (error) {
      errors.push(`message: ${error.message}`);
    }
  }

  if (inputs.file) {
    try {
      validated.fileInfo = await Validator.validateFile(inputs.file);
    } catch (error) {
      errors.push(`file: ${error.message}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Validation failed:\n${errors.join("\n")}`);
  }

  return validated;
}

module.exports = {
  validateCliqUrl,
  validateMessage,
  validateFile,
  validateInputs,
};
