import { Project, SourceFile } from 'ts-morph'
import path from 'path'
import { gray, green, dim } from 'colorette'

import fg from 'fast-glob'
import { stdout } from 'process'
import { builtinModules } from 'module'
import { execSync } from 'child_process'
import { flow } from 'lodash'
import { IndentStyle } from 'typescript'

function printLogo() {
    console.info(`
  ███████████ █████ █████ █████
  ░░███░░░░░░█░░███ ░░███ ░░███
   ░███   █ ░  ░███  ░░███ ███
   ░███████    ░███   ░░█████
   ░███░░░█    ░███    ███░███
   ░███  ░     ░███   ███ ░░███
   █████       █████ █████ █████
  ░░░░░       ░░░░░ ░░░░░ ░░░░░
  `)
}

printLogo()

function relativeFromRoot(target: string): string {
    return path.relative(process.cwd(), target)
}

function fixBuiltinImports(sourceFile: SourceFile): SourceFile {
    const importDeclarations = sourceFile
        .getImportDeclarations()
        .filter((importDeclaration) =>
            builtinModules.includes(importDeclaration.getModuleSpecifierValue())
        )

    for (const importDeclaration of importDeclarations) {
        const moduleSpecifierValue = importDeclaration.getModuleSpecifierValue()
        if (moduleSpecifierValue.startsWith('node:')) {
            const newModuleSpecifierValue = moduleSpecifierValue.replace(
                'node:',
                ''
            )

            importDeclaration.setModuleSpecifier(newModuleSpecifierValue)
        }
    }

    return sourceFile
}

function fixNonRelativeLocalImports(sourceFile: SourceFile): SourceFile {
    sourceFile
        .getImportDeclarations()
        .filter((importDeclaration) =>
            importDeclaration.getModuleSpecifierValue().startsWith('src')
        )

        .forEach((importDeclaration) => {
            const moduleSpecifier = importDeclaration.getModuleSpecifierValue()

            const moduleSpecifierRelativePath = path.relative(
                path.dirname(sourceFile.getFilePath()),
                moduleSpecifier
            )
            importDeclaration.setModuleSpecifier(moduleSpecifierRelativePath)
        })

    sourceFile.fixMissingImports()

    return sourceFile
}

function organizeImports(sourceFile: SourceFile): SourceFile {
    const importDeclarations = sourceFile.getImportDeclarations()

    const moduleSpecifiers = importDeclarations.map((importDeclaration) =>
        importDeclaration.getModuleSpecifierValue()
    )

    const moduleSpecifiersSet = new Set(moduleSpecifiers)

    for (const moduleSpecifier of moduleSpecifiersSet) {
        const importDeclarations = sourceFile
            .getImportDeclarations()
            .filter(
                (importDeclaration) =>
                    importDeclaration.getModuleSpecifierValue() ===
                    moduleSpecifier
            )

        const namedImports = importDeclarations

        const namedImportsText = namedImports.map((namedImport) =>
            namedImport
                .getNamedImports()
                .map((namedImport) => namedImport.getText())
        )

        importDeclarations.forEach((importDeclaration) =>
            importDeclaration.removeNamedImports()
        )

        importDeclarations[0].addNamedImports(namedImportsText.flat().sort())

        importDeclarations.slice(1).forEach((importDeclaration) => {
            importDeclaration.remove()
        })
    }

    sourceFile.organizeImports(
        {
            trimTrailingWhitespace: true,
            ensureNewLineAtEndOfFile: true
        },
        {
            quotePreference: 'single',
            importModuleSpecifierPreference: 'relative',
            importModuleSpecifierEnding: 'auto',
            allowTextChangesInNewFiles: true,
            includePackageJsonAutoImports: 'auto',
            allowRenameOfImportPath: true,
            autoImportFileExcludePatterns: [
                '**/node_modules/**',
                '**/dist/**',
                '**/build/**',
                '**/public/**'
            ]
        }
    )
    sourceFile.formatText({
        trimTrailingWhitespace: true,
        indentStyle: IndentStyle.Smart,
        insertSpaceAfterConstructor: true,
        ensureNewLineAtEndOfFile: true,
        insertSpaceBeforeTypeAnnotation: true,
        insertSpaceAfterTypeAssertion: true,
        insertSpaceAfterFunctionKeywordForAnonymousFunctions: true,
        insertSpaceAfterKeywordsInControlFlowStatements: true,
        insertSpaceAfterOpeningAndBeforeClosingEmptyBraces: false
    })

    return sourceFile
}

const run = async () => {
    const project = new Project({
        tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
        skipAddingFilesFromTsConfig: true
    })

    const files = await fg(
        [path.join(process.cwd(), 'src', '**/*.{ts,tsx,js,jsx}')],
        {
            onlyFiles: true,
            caseSensitiveMatch: false,
            suppressErrors: true,
            ignore: [
                '**/index.ts',
                '**/*.d.ts',
                '**/*.spec.ts',
                '**/*.test.ts',
                '**/__tests__/**',
                '**/__mocks__/**',
                '**/__fixtures__/**',
                '**/__snapshots__/**',
                '**/assets/database/migrations/**',
                '**/assets/database/seeds/**'
            ]
        }
    )

    project.addSourceFilesAtPaths(files)

    console.info(gray('🧹'), `Optimizing ${files.length} source files...`, '\n')

    await new Promise((resolve) => setTimeout(resolve, 1000))

    for (const sourceFile of project.getSourceFiles()) {
        flow(
            fixBuiltinImports,
            fixNonRelativeLocalImports,
            organizeImports
        )(sourceFile)

        console.info(green('✓'), relativeFromRoot(sourceFile.getFilePath()))
    }

    // save all vscode open files and close tabs

    await project.save()

    execSync('npx prettier-package-json --write package.json')
    execSync('npm run format')

    stdout.write('\n')
    console.info(dim('✨'), `Optimized ${files.length} source files!\n`)
}

run()
