// Defaults
export const DEFAULT_PAGINATE_LIMIT =
    parseInt(process.env['DEFAULT_PAGINATE_LIMIT'] as string) || 10

/**
 * Key used to identify public routes.
 */
export const IS_PUBLIC_KEY = Symbol('isPublic')

/**
 * Represents a public resource.
 */

export const PUBLIC_RESOURCE = 'resource::public'
export const PROTECTED_RESOURCE = 'resource::protected'
export const PRIVATE_RESOURCE = 'resource::internal'
export const ADMIN_RESOURCE = 'resource::admin'
export const OWNER_RESOURCE = 'resource::owner'
