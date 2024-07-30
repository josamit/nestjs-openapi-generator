import path from 'path'
import fs from 'fs'

const TEMPLATES_DIR = path.resolve(__dirname, '../templates')
/*
 *This function goes through the templates directory and creates a nifty TypeScript enum + utility function to get the actual location of the template.
 *Similar to how you can get Resource bindings for Android in Kotlin.
 *The idea is that you don't have to specify the location of the file and read it yourself. Instead just call Templates.read(TemplateFiles.SomeTemplateFile) and you're good to go.
 */
const createTemplateLinks = () => {
    const allTemplates = fs.readdirSync(TEMPLATES_DIR)
    const foundFiles: Map<string, string> = new Map()
    const extraDirectoriesToExplore: string[] = []
    const handleItem = (item: string, dir: string, parentItem?: string) => {
        const itemLocation = path.resolve(dir, item)
        const itemStats = fs.statSync(itemLocation)
        if (itemStats.isFile()) {
            foundFiles.set(
                (parentItem ? `${parentItem}.${item.replace('.handlebars', '')}` : item.replace('.handlebars', '')),
                path.relative(TEMPLATES_DIR, itemLocation),
            )
        } else if (itemStats.isDirectory()) {
            extraDirectoriesToExplore.push(parentItem ? path.join(parentItem, item) : item)
        }
    }
    allTemplates.forEach((item) => {
        handleItem(item, TEMPLATES_DIR)
    })
    while (extraDirectoriesToExplore.length > 0) {
        const directory = extraDirectoriesToExplore.pop()!
        const directoryPath = path.resolve(TEMPLATES_DIR, directory)
        const allItems = fs.readdirSync(directoryPath)
        allItems.forEach((item) => {
            handleItem(item, directoryPath, directory)
        })
    }
    const tsFileOutput = `import fs from "fs"
import path from "path"

enum TemplateFiles {
\t${Array.from(foundFiles.entries())
        // eslint-disable-next-line sonarjs/no-nested-template-literals
        .map(([key, value]) => `\t${key} = "${value}"`)
        .join(',\n')}
}

export const Templates = {
    read: (file: TemplateFiles): string => {
        return fs.readFileSync(path.resolve(__dirname, "../templates", file)).toString()
    }
}

export default TemplateFiles
    `
    console.log('Writing templates enum')
    fs.writeFileSync(path.resolve(__dirname, 'templates.ts'), tsFileOutput)
}

createTemplateLinks()
