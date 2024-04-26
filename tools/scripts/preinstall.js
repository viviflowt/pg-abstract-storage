const fs = require('fs')
const path = require('path')
const os = require('os')

const baseDir = path.join(os.homedir(), '.npm/_packages')
if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true })
}

const packageJson = require(path.join(__dirname, '../../package.json'))
const { dependencies, devDependencies } = packageJson

fs.writeFileSync(
    './package.json',
    JSON.stringify(
        {
            ...packageJson,
            dependencies: Object.entries(dependencies)
                .filter(([key]) => !key.startsWith('@vertical'))
                .map(([key, value]) => ({ [key]: value }))
                .reduce((acc, cur) => ({ ...acc, ...cur }), {}),
            devDependencies: Object.entries(devDependencies)
                .filter(([key]) => !key.startsWith('@vertical'))
                .map(([key, value]) => ({ [key]: value }))
                .reduce((acc, cur) => ({ ...acc, ...cur }), {})
        },
        null,
        2
    )
)
