import 'jest-extended'

declare global {
    export type Primitive =
        | string
        | number
        | boolean
        | symbol
        | null
        | undefined

    export type Nullable<T> = T | null
    export type Optional<T> = T | undefined
    export type Maybe<T> = T | null
    export type Empty = null | undefined

    export type Key = string | number | symbol
    export type Value = any

    export type KeyOf<T> = keyof T
    export type ValueOf<T> = T[keyof T]

    export type AnyObject = Record<Key, Value>

    export type List<T> = ReadonlyArray<T>
    export type Dictionary<T> = Record<string, T>

    export type Prototype<T = any> = T

    export type ClassConstructor<T = any> = new (...args: any[]) => T
    export type Property<T> = () => T
    export type Method<T> = (...args: any[]) => T

    export type Callback<T = any> = (...args: any[]) => T
    export type CallbackFn<T = any> = Callback<T>
}

declare module 'express' {
    export interface MulterFile {
        /** Name of the form field associated with this file. */
        fieldname: string
        /** Name of the file on the uploader's computer. */
        originalname: string
        /**
         * Value of the `Content-Transfer-Encoding` header for this file.
         * @deprecated since July 2015
         * @see RFC 7578, Section 4.7
         */
        encoding: string
        /** Value of the `Content-Type` header for this file. */
        mimetype: string
        /** Size of the file in bytes. */
        size: number
        /**
         * A readable stream of this file. Only available to the `_handleFile`
         * callback for custom `StorageEngine`s.
         */
        stream: Readable
        /** `DiskStorage` only: Directory to which this file has been uploaded. */
        destination: string
        /** `DiskStorage` only: Name of this file within `destination`. */
        FileCase: string
        /** `DiskStorage` only: Full path to the uploaded file. */
        path: string
        /** `MemoryStorage` only: A Buffer containing the entire file. */
        buffer: Buffer
    }

    // interface Request extends Express.Request {
    //     user?: User
    //     headers: {
    //         'x-request-id': string
    //         'x-tenant-id': string
    //     }
    // }
}

export {}
