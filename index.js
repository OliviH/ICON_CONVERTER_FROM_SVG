const path = require("path")
const fs = require("fs-extra")
const converter = require('icon-gen')

const directoryPath = path.join(__dirname, 'images')
fs.emptyDirSync(path.join(__dirname, "icons"))

function fromDir(startPath,filter,callback){

    //console.log('Starting from dir '+startPath+'/');

    if (!fs.existsSync(startPath)){
        console.log("no dir ",startPath)
        return
    }

    var files=fs.readdirSync(startPath)
    for(var i=0;i<files.length;i++){
        var filename=path.join(startPath,files[i])
        var stat = fs.lstatSync(filename)
        if (stat.isDirectory()){
            fromDir(filename,filter,callback) //recurse
        }
        else if (filter.test(filename)) callback(filename)
    }
}
function convertfile(file){
    console.log("convertfile", path.basename(file))
    let dir = path.join('./icons', path.parse(file).name)
    fs.ensureDirSync(dir)
    converter(`./images/${path.basename(file)}`, dir, { report: true })
    .then(results=>{
        console.log(results)
    })
    .catch(e=>{
        console.error(e)
    })
}
/* converter('./images/image.svg','./icons',{report:true})
.then(results=>{
    console.log(results)
}) 
.catch(e=>console.error(e))
*/
fromDir('./images',/\.svg$/,function(filename){
    convertfile(filename)
})