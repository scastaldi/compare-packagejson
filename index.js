const fs = require('fs')
const path = require('path');

// This is a simple helper tool to validate all the package.json
// have the same versions for all the related repos
// I made it simple to avoid any references no need to include a package.json
const log = console.log;
const colors = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",
    fg: {
     Black: "\x1b[30m",
     Red: "\x1b[31m",
     Green: "\x1b[32m",
     Yellow: "\x1b[33m",
     Blue: "\x1b[34m",
     Magenta: "\x1b[35m",
     Cyan: "\x1b[36m",
     White: "\x1b[37m",
     Crimson: "\x1b[38m" 
    },
    bg: {
     Black: "\x1b[40m",
     Red: "\x1b[41m",
     Green: "\x1b[42m",
     Yellow: "\x1b[43m",
     Blue: "\x1b[44m",
     Magenta: "\x1b[45m",
     Cyan: "\x1b[46m",
     White: "\x1b[47m",
     Crimson: "\x1b[48m"
    }
};
const getDirectories = () => {
    try {
        // if the user does not provide a path, 
        // set the path as the current directory
        let directory = __dirname;
        if (process.argv.length === 3) {
            directory = process.argv[2]; // node index.js userPath
        }
        log(`${colors.fg.Yellow}Root directory: ${directory}${colors.Reset}`);
        return fs.readdirSync(directory, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => path.join(directory, dirent.name));
    } catch (error) {
        console.error(`${colors.fg.Red}Ooops! this is not a proper folder, Make sure the app is located in the root folder...${colors.fg.Red}`, error.message)
    }
}
const getFiles = (directory) => {
    let files = [];
    fs.readdirSync(directory)
    .filter(file => file === 'package.json')
    .forEach(file => {
        files.push(path.join(directory, file));
    });
    return files;
}
const readFile = (fileName) => {
    try {
        return fs.readFileSync(fileName, 'utf8');
    } catch (error) {
        console.error(`Error reading file ${fileName}`, error.message);
    }
}
const main = () => {
    // get all package.json files from all the related repos
    let packageJsonList = [];
    let directories = getDirectories();
    directories.forEach(dir => {
        let files = getFiles(dir);
        packageJsonList.push(files);
    });
    // log(packageJsonList);

    let referenceMap = [];
    let uniqueReferences = new Set();
    packageJsonList.forEach(file => {
        if (file.length > 0) {
            let f = file[0];
            if (fs.existsSync(f)) {
                // log(`file: ${f}`);
                let currentFile = readFile(f);
                // log(`currentFile: ${currentFile}`);
                let att = JSON.parse(currentFile);
                // log(`attributes: ${JSON.stringify(att.dependencies)}`);
                for (let prop in att.dependencies) {
                    // log(prop, att.dependencies[prop]);
                    uniqueReferences.add(prop);
                    referenceMap.push({prop:prop + ',' + att.dependencies[prop], file:f, package:prop, version:att.dependencies[prop]}) // save unique values here of all props in all files
                }
                for (let prop in att.devDependencies) {
                    // log(prop, att.dependencies[prop]);
                    uniqueReferences.add(prop);
                    referenceMap.push({prop:prop + ',' + att.dependencies[prop], file:f, package:prop, version:att.dependencies[prop]}) // save unique values here of all props in all files
                }
            } else {
                log(`${colors.fg.Red}file does not exist: ${f}${colors.Reset}`);
            }

        }
    });
    
    let uniqueItems = new Map();
    for (let i = 0; i < referenceMap.length; i++) {
        const element1 = referenceMap[i];
        for (let j = 0; j < referenceMap.length; j++) {
            const element2 = referenceMap[j];
            if (element1.package === element2.package && element1.version !== element2.version && element1.version !== undefined && element2.version !== undefined) {
                // if the package match and not the version then add to new array
                uniqueItems.set(element1.package, `${colors.fg.Green}${element1.package} ${colors.fg.Cyan}${element1.version} !== ${element2.version}${colors.Reset}}`);  // ${element1.file}, ${element2.file
                break;
            }
        }
    }

    if (uniqueItems.size > 0) {
        log(`${colors.fg.Red}Opps found mismatch in ${uniqueItems.size} packages${colors.Reset}`);
        uniqueItems.forEach((value, key) => log(value));
    } else {
        log(`${colors.fg.Green}Congrats! all the packages have the same version!${colors.Reset}`)
    }

    log(`${colors.fg.Green}Unique references ${uniqueReferences.size}${colors.Reset}`);
}

main();