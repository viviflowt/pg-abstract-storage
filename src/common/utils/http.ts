import { get } from 'lodash'

export function extractTenantIdFromRequest(
    request: Request
): string | undefined {
    const tenantId = get(request, 'headers.x-tenant-id')
    return tenantId
}

export function extractForwardedForFromRequest(
    request: Request
): string | undefined {
    const forwardedFor = get(request, 'headers.x-forwarded-for')
    return forwardedFor
}

export function extractAuthorizationFromRequest(
    request: Request
): string | undefined {
    const authorization = get(request, 'headers.authorization')
    return authorization
}
