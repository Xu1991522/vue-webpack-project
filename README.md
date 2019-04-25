## workdir
vue-webpack-project

```
cd vue-webpack-project
```

## requirements
```bash
# install
npm install

# when first time to install, add eslint-standard related packages to global
npm install eslint-config-standard eslint-plugin-import eslint-plugin-node eslint-plugin-promise eslint-plugin-standard -g
```

## commands
``` bash
# serve with hot reload at localhost:3000
npm run serve

# build for production with minification
npm run build
```

vue build options changelog
```
add vue.config.js

set outputDir to ../src/site
set productionSourceMap to false
set ExtractTextPlugin allChunks to false
set devServer options
set echarts externals
disable preload and prefetch
```
