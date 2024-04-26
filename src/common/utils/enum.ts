export type EnumLike = Array<unknown> | Record<string, unknown>

export type EnumValue<T extends EnumLike> = T extends
    | Array<infer U>
    | Record<string, infer U>
    ? U
    : never

export type EnumKey<T extends EnumLike> =
    T extends Array<any>
        ? number
        : T extends Record<string, any>
          ? string
          : never

export type StringEnum<T extends EnumLike> = {
    [key in EnumKey<T>]: EnumValue<T>
}

export type IndexEnum<T extends EnumLike, K extends string> = {
    [key in K]: EnumValue<T>
}

export function getEnumValues<T extends EnumLike>(enumType: T): Array<string> {
    return [
        ...new Set(
            Object.entries(enumType)
                .filter(([key]) => !~~key)
                .flatMap((item) => item)
        )
    ] as Array<string>
}

export function getEnumKeys<T extends EnumLike>(enumType: T): Array<string> {
    return Object.keys(enumType).filter((key) => !~~key)
}

export function getEnumKey<T extends EnumLike>(
    enumType: T,
    value: EnumValue<T>
): EnumKey<T> {
    return getEnumKeys(enumType).find(
        (key) => enumType[key] === value
    ) as EnumKey<T>
}

export function getEnumValue<T extends EnumLike>(
    enumType: T,
    key: EnumKey<T>
): EnumValue<T> {
    return getEnumValues(enumType).find(
        (value) => value === key
    ) as EnumValue<T>
}
