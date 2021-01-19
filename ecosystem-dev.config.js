module.exports = {
  apps : [{
    name        : "server",
    script      : "www/web.js",
    watch       : ["www/web.js", "src", "webpack.dev-config.js", "tsconfig.json", ".env"],
    env: {
      "NODE_ENV": "development",
    },
    env_production : {
       "NODE_ENV": "production"
    }
  },{
    name       : "front",
    watch      : ["www/web.js", "src", "webpack.dev-config.js", "tsconfig.json", ".env"],
    script     : "npx webpack --watch --config webpack.dev-config.js",
  }]
}