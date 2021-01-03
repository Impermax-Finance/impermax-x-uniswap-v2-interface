module.exports = {
  apps : [{
    name        : "server",
    script      : "./www/web.js",
    watch       : true,
    env: {
      "NODE_ENV": "development",
    },
    env_production : {
       "NODE_ENV": "production"
    }
  },{
    name       : "front",
    script     : "npx webpack --watch --config webpack.dev-config.js",
    
  },{
      name:   "ts-api",
      script: "tsc --project tsconfig-server.json --watch"
  }]
}