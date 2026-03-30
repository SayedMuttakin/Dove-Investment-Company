const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir, callback) {
    fs.readdir(dir, function (err, list) {
        if (err) return callback(err);
        let pending = list.length;
        if (!pending) return callback(null);
        list.forEach(function (file) {
            file = path.join(dir, file);
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function (err, res) {
                        if (!--pending) callback(null);
                    });
                } else {
                    if (file.endsWith('.jsx')) {
                        processFile(file);
                    }
                    if (!--pending) callback(null);
                }
            });
        });
    });
}

const replacements = [
    // Backgrounds
    { regex: /(?<=['"\s`])bg-dark-300(?=['"\s`])/g, replacement: 'bg-gray-50 dark:bg-dark-300' },
    { regex: /(?<=['"\s`])bg-dark-200(?=['"\s`])/g, replacement: 'bg-white dark:bg-dark-200' },
    { regex: /(?<=['"\s`])bg-dark-100(?=['"\s`])/g, replacement: 'bg-gray-100 dark:bg-dark-100' },
    
    // Text colors
    { regex: /(?<=['"\s`])text-white(?=['"\s`])/g, replacement: 'text-gray-900 dark:text-white' },
    { regex: /(?<=['"\s`])text-white\/(\d+)(?=['"\s`])/g, replacement: 'text-gray-900/$1 dark:text-white/$1' },
    
    // Borders
    { regex: /(?<=['"\s`])border-white\/(\d+)(?=['"\s`])/g, replacement: 'border-slate-200 dark:border-white/$1' },
    { regex: /(?<=['"\s`])border-t-white\/(\d+)(?=['"\s`])/g, replacement: 'border-t-slate-200 dark:border-t-white/$1' },
    { regex: /(?<=['"\s`])border-b-white\/(\d+)(?=['"\s`])/g, replacement: 'border-b-slate-200 dark:border-b-white/$1' },
    
    // Background opacity
    { regex: /(?<=['"\s`])bg-white\/(\d+)(?=['"\s`])/g, replacement: 'bg-gray-900/$1 dark:bg-white/$1' },
    
    // Gradients
    { regex: /(?<=['"\s`])from-black\/(\d+)(?=['"\s`])/g, replacement: 'from-gray-900/$1 dark:from-black/$1' },
    { regex: /(?<=['"\s`])to-black\/(\d+)(?=['"\s`])/g, replacement: 'to-gray-900/$1 dark:to-black/$1' }
];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;

    for (const r of replacements) {
        newContent = newContent.replace(r.regex, r.replacement);
    }
    
    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

walk(srcDir, (err) => {
    if (err) throw err;
    console.log('Migration complete.');
});
