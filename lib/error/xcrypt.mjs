class XcryptError extends Error {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.name = "XcryptError";
    this.statusCode = 500;
  }
}

export default XcryptError;
