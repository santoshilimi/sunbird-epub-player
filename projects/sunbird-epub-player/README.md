# Sunbird Epub Player
Player for playing Epub contents for sunbird applications

## Prerequisite

  Node version > 12

## Usage


`npm i @project-sunbird/sunbird-epub-player-v9`


Add the module to the your player root module 

`import  { SunbirdEpubPlayerModule } from '@project-sunbird/sunbird-epub-player-v9';`

```javascript
@NgModule({
  ...
  imports: [
    ...,
    SunbirdEpubPlayerModule
  ]
})
```

add the assets, scripts and styles in angular.json file

```javascript
....
 "assets": [
              "src/favicon.ico",
              "src/assets",
              {
                "glob": "**/*",
                "input": "node_modules/@project-sunbird/sunbird-epub-player-v9/lib/assets/",
                "output": "/assets/"
              }
],
  "scripts": [
  ...
    "./node_modules/epubjs/dist/epub.js",
    "node_modules/@project-sunbird/telemetry-sdk/index.js"
    ....
  ],
  
"styles": [
...
"./node_modules/@project-sunbird/sb-styles/assets/_styles.scss",
"src/styles.css"
....
],
...

```

add peer dependecies of the player as dependecies in your project
 

add the component selector in your component like below

```html

    <sunbird-epub-player [playerConfig]="epubPlayerConfig" 
                         (playerEvent)="playerEventHandler($event)"
                         (telemetryEvent)="telemetryEvent($event)">
    </sunbird-epub-player>

```

Still facing issues please refer the demo project in this repo as example

## Development

  check out this repo with latest release version branch

  cd to {repo_path} in terminal

  run  `sh setup.sh`

  above script installs the dependecies and link the epub player library project to demo app

  if you do any changes in library project run to get latest changes in demo app

  `npm run build-lib-link`

  once above command completed run `npm run start` which will run the player in demo app at http://localhost:4200



## References

http://epubjs.org/documentation/0.3/#epubjs
