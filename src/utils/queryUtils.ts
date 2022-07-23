type QueryMap = Record<string, string>

export function getParsedQueryString(): QueryMap {
	const queries = window.location.search.substring(1).split('&')

	return queries.reduce((queryMap: QueryMap, queryStringItem) => {
		const [key, value = ''] = queryStringItem.split('=')
		queryMap[key] = value
		return queryMap
	}, {})
}

export function getQueryString(key: string): string | null {
	const parsedQueryString = getParsedQueryString()
	const value = parsedQueryString[key]

	if (!(key in parsedQueryString) || value === undefined) {
		return null
	}

	return value
}

export function getQueryNumber(key: string): number | null {
	const parsedQueryString = getParsedQueryString()
	const value = parsedQueryString[key]

	if (!(key in parsedQueryString) || value === undefined) {
		return null
	}

	return parseFloat(value)
}

export function getQueryBool(key: string): boolean | null {
	const parsedQueryString = getParsedQueryString()
	const value = parsedQueryString[key]

	if (!(key in parsedQueryString) || value === undefined) {
		return null
	}

	if (value === '0' || value.toLowerCase() === 'false') {
		return false
	}

	return true
}
