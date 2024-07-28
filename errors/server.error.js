module.exports = class ServerError extends Error {
	/**
	 * Represents a server error.
	 * @class
	 * @param {string} message - The error message.
	 * @param {number} code - The error code.
	 */
	constructor(message, code) {
		super(message);
		this._code = code;
	}

	get code(){
		return this._code;
	}
}