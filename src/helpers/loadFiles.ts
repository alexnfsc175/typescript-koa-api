const fs = require("fs");
const path = require("path");

// const modelsPath = path.resolve('Server/app/models');

let load = modelsPathString => { 
  const modelsPath = path.resolve(__dirname, modelsPathString);

  return fs
    .readdirSync(modelsPath)
    .filter(file => /\.js$/.test(file))
    .forEach(file => {
        require(`${modelsPath}/${file}`);
        console.log(`${modelsPath}/${file}`);
        
});
};

export default load;
