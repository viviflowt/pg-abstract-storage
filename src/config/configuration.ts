import { merge } from 'lodash'
import path from 'path'

export const configuration = async () => {
    const { config } = await import(path.join(__dirname, 'envs', 'default'))

    const { config: environment } = await import(
        path.join(__dirname, 'envs', process.env.NODE_ENV || 'development')
    )

    return merge(config, environment)
}
