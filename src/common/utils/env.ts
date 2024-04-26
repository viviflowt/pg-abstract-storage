/**
 * Checks if the application is running in a development environment.
 * @returns {boolean} Returns true if the application is running in a development environment, otherwise returns false.
 */
export function isDevelopment(): boolean {
    return process.env.NODE_ENV ? process.env.NODE_ENV === 'development' : true
}

/**
 * Checks if the application is running in a testing environment.
 * @returns {boolean} Returns true if the application is running in a testing environment, otherwise returns false.
 */
export function isTesting(): boolean {
    return process.env.NODE_ENV === 'test'
}

/**
 * Checks if the application is running in a production environment.
 * @returns {boolean} Returns true if the application is running in production, false otherwise.
 */
export function isProduction(): boolean {
    return process.env.NODE_ENV === 'production'
}
