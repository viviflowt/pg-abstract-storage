import path from 'path'
import fg from 'fast-glob'
import f from 'lodash/fp'
import { dim, green, red, whiteBright, cyan } from 'colorette'
import { Project } from 'ts-morph'

const searchFiles = async () => {
    const files = await fg(
        [path.join(process.cwd(), 'src', '**/*.{ts,tsx,js,jsx}')],
        {
            onlyFiles: true,
            caseSensitiveMatch: false,
            absolute: true,
            ignore: [
                '**/index.ts',
                '**/*.spec.ts',
                '**/*.test.ts',
                '**/*.d.ts'
            ],
            suppressErrors: true
        }
    )

    return files
        .map((file) => path.relative(process.cwd(), file))
        .sort((a, b) => a.split('/').length - b.split('/').length)
}

const run = async () => {
    const files = await searchFiles()

    const project = new Project({
        tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
        skipAddingFilesFromTsConfig: true
    })

    project.addSourceFilesAtPaths(files)

    const list = files.map((file) => file.replace(/\.[^/.]+$/, ''))

    console.log('Found', list.length, 'files')

    const sourceFilesToFix = []

    project.getSourceFiles().forEach((sourceFile) => {
        const sourceFilePath = path.relative(
            process.cwd(),
            sourceFile.getFilePath()
        )

        const imports = sourceFile
            .getImportDeclarations()
            .filter((importDeclaration) => {
                const moduleSpecifier =
                    importDeclaration.getModuleSpecifierValue()
                return moduleSpecifier.startsWith('.')
            })

        imports.forEach((importDeclaration) => {
            const moduleSpecifier = importDeclaration.getModuleSpecifierValue()
            const importPath = path.relative(
                process.cwd(),
                path.resolve(path.dirname(sourceFilePath), moduleSpecifier)
            )

            const found = list.includes(importPath)

            if (!found) {
                console.log(whiteBright(sourceFilePath))
                console.log(red('  +'), dim(importPath))
                importDeclaration.remove()

                sourceFilesToFix.push(sourceFile)
                sourceFile.saveSync()
            }
        })
    })

    const sourceFilesToFixUnique = [...new Set(sourceFilesToFix)]

    for (const sourceFile of sourceFilesToFixUnique) {
        console.log(cyan('fixing missing imports'))
        console.log(dim(path.relative(process.cwd(), sourceFile.getFilePath())))

        sourceFile.fixMissingImports()
        sourceFile.saveSync()

        console.log(green('done!\n'))
    }

    project.saveSync()
}

run()
