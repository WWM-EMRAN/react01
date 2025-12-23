# React website to GitHub

## Install necessary react packages (do not run audit)
npm install
npm install react-router-dom

## For Deployment 

### Add GitHub page to the project 
npm i gh-pages --save-dev

### Add homepage property to the packages.json
{
    "homepage: "http://wwm-emran.github.io/react01",
    ...
}


### Add the predeploy and deploy properties to scripts to the packages.json 
{
    ...
    "scripts": {
        ...
        "predeploy": "npm run build",
        "deploy": "gh-pages -d build"
        ...
    }
    ...
}


### Run npm deploy 
npm run deploy

