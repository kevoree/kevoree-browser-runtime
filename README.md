# Kevoree Browser Runtime

## [Demo](http://runjs.kevoree.org)

### Documentation
```sh
# only once :
npm install # retrieve the dependencies
bower install

grunt serve
```

### DevMode Documentation
Go to **Settings** and `enable` **DevMode**  
In this mode, the runtime will try to resolve the **DeployUnits** on a local registry at `localhost:59000` instead
of the classic `registry.npmjs.org`

### Component UI
Components can tweak there UI scripts, styles, Angular modules and UI metadata
using a JSON formatted configuration file:  **ui-config.json**  

*ui-config.json example:*
```json
{
    "scripts": [
        "my-local-script.js",
        "//cdn.scripts.foo/my-lib.js"
    ],
    "styles": [
        "my-local-style.css",
        "//cdn.styles.bar/my-style.css"
    ],
    "depModules": [
        "myNgModule"
    ],
    "layout": {
        "width": 2,
        "height": 1
    }
}
```
