#!/usr/bin/env ts-node
'use strict'
import { bold, cyan, dim, gray, green, yellow } from 'colorette'
import fg from 'fast-glob'
import path, { basename, dirname, extname } from 'path'
import { stdout } from 'process'
import readline from 'readline'
import { Project } from 'ts-morph'

const args = process.argv.slice(2)

const pathList = args.length
    ? args
    : [path.join(process.cwd(), 'src'), path.join(process.cwd(), 'tools/cli')]

function getSourceFiles(sourceRoot: string | string[]) {
    const patterns = (
        Array.isArray(sourceRoot) ? sourceRoot : [sourceRoot]
    ).map((root) => path.join(root, '**/*.{ts,tsx}'))

    const files = fg.sync([...patterns], {
        onlyFiles: true,
        caseSensitiveMatch: false,
        absolute: true,
        ignore: [
            '**/*.d.*',
            '**/*.spec.*',
            '**/*.test.*',
            '**/*.config.*',
            '**/*.stories.*',
            '**/jest.*',
            '**/webpack.*',
            '**/vite.*'
        ],
        suppressErrors: true
    })

    return files
}

function kebabCase(str: string): string {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[_\s]+/g, '-')
        .toLowerCase()
}

const SUFFIXES = [
    'dto',
    'strategy',
    'module',
    'service',
    'controller',
    'middleware',
    'interceptor',
    'guard',
    'pipe',
    'enum',
    'decorator',
    'filter',
    'exception'
]

function normalizeSuffix(str: string): string {
    const suffix = SUFFIXES.find((s) => str.endsWith(`-${s}`))

    return suffix
        ? str.replace(new RegExp(`-${suffix}$`), '') + '.' + suffix
        : str
}

function toFileCase(filePath: string): string {
    if (typeof filePath !== 'string') {
        throw new TypeError('Expected a string')
    }

    const ext = extname(filePath)
    const baseName = basename(filePath, ext)

    const newName = baseName
        .split('.')
        .map((part) => kebabCase(part))
        .map((part) => normalizeSuffix(part))
        .join('.')

    return path.join(dirname(filePath), newName + ext)
}

function relativeFromRoot(filePath: string): string {
    return path.relative(process.cwd(), path.resolve(filePath))
}

const hideCursor = () => stdout.write('\u001B[?25l')
const showCursor = () => stdout.write('\u001B[?25h')
const saveCursor = () => stdout.write('\u001B[s')
const restoreCursor = () => stdout.write('\u001B[u')
const clearLine = () => stdout.write('\u001B[K')

async function confirm(message: string): Promise<boolean> {
    if (typeof message !== 'string') {
        throw new TypeError('Expected a string')
    }

    saveCursor()
    hideCursor()

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    return new Promise((resolve) => {
        rl.question(message, (answer) => {
            rl.close()
            restoreCursor()
            clearLine()
            showCursor()
            resolve(answer.trim().toLowerCase() !== 'n')
        })
    })
}

const main = async () => {
    const files = getSourceFiles([...pathList])

    const project = new Project({
        tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
        skipAddingFilesFromTsConfig: true
    })

    project.addSourceFilesAtPaths(files)

    const sourceFiles = project.getSourceFiles().filter((sourceFile) => {
        const filePath = sourceFile.getFilePath()
        const oldName = basename(filePath)
        const newName = basename(toFileCase(filePath))

        return oldName !== newName
    })

    for (const sourceFile of sourceFiles) {
        const filePath = sourceFile.getFilePath()
        const oldName = basename(filePath)
        const newName = basename(toFileCase(filePath))

        console.info(dim(relativeFromRoot(filePath)))
        console.log(
            gray(relativeFromRoot(oldName)),
            bold('→'),
            cyan(relativeFromRoot(newName))
        )

        const newFilePath = path.join(dirname(filePath), newName)

        const awnser = await confirm('Deseja renomear? (y/n) ')
        console.log(awnser === true ? green('accepted!') : yellow('skipped!'))

        if (awnser) {
            await sourceFile.moveImmediately(newFilePath, { overwrite: true })

            stdout.write('\n')
        }
    }

    await project.save()
}

main()
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
    .finally(() => {
        showCursor()
    })
