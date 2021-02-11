var quoteType = {
	/**
	 * Always quote the attribute value
	 *
	 * @type {number}
	 */
	always: 1,

	/**
	 * Never quote the attributes value
	 *
	 * @type {number}
	 */
	never: 2,

	/**
	 * Only quote the attributes value when it contains spaces to equals
	 *
	 * @type {number}
	 */
	auto: 3
};

export default quoteType;
