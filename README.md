# Epub player library for Sunbird platform!
Contains Epub player library components powered by angular. These components are designed to be used in sunbird consumption platforms *(mobile app, web portal, offline desktop app)* to drive reusability, maintainability hence reducing the redundant development effort significantly.

# Getting Started
For help getting started with a new Angular app, check out the Angular CLI.
For existing apps, follow these steps to begin using .

## Step 1: Install the packages

    npm install @project-sunbird/sunbird-epub-player-v9 --save
    npm install @project-sunbird/sb-styles --save
    npm install @project-sunbird/client-services --save
    npm install epubjs --save

## Step 2: Include the styles, scripts and assets in angular.json
    "styles": [
    ...
    ...
    "src/styles.css",
    "./node_modules/@project-sunbird/sb-styles/assets/_styles.scss"
    ],
    "scripts": [
    ...
    ...
    "node_modules/epubjs/dist/epub.js"
    ]

  Add following under architect.build.assets

     {
	    ...
	    "build": {
	    
	    "builder": "@angular-devkit/build-angular:browser",
	    
	    "options": {
		    ...
		    ...
    
		    "assets": [
		    
			   ...
			   ...
			    
			    {
				    "glob": "**/*.*",
				    "input": "./node_modules/@project-sunbird/sunbird-epub-player-v9/lib/assets/",
				    "output": "/assets/"
			    }
		    
		    ],
    
	    "styles": [
	    
	    ...
	    
	    "./node_modules/@project-sunbird/sb-styles/assets/_styles.scss"
	    ],
	    "scripts": [
         ...
         "node_modules/epubjs/dist/epub.js"
         ]
	    ...
	    ...
    
    },

  

## Step 3: Import the modules and components
Import the NgModule where you want to use. Also create a [question-cursor-implementation.service](data.ts)
       
    import { SunbirdEpubPlayerModule } from '@project-sunbird/sunbird-epub-player-v9';

    
    @NgModule({
	    ...
	    
	    imports: [SunbirdEpubPlayerModule]
	    
	    ...
    })

  
    export class TestAppModule { }
    
## Step 4: Add css in global styles

    body {
        background-color: white;
        height: 100%;
    }
    html {
        height: 100%;
    }


## Step 5: Send input to render Epub player
Use the mock config in your component to send input to Epub player
Click to see the mock - [playerConfig](src/app/data.ts)

## Available components
|Feature| Notes| Selector|Code|Input|Output
|--|--|--|------------------------------------------------------------------------------------------|---|--|
| Epub Player | Can be used to render epub | sunbird-epub-player| *`<sunbird-epub-player [playerConfig]="playerConfig"><sunbird-epub-player>`*|playerConfig|playerEvent, telemetryEvent|