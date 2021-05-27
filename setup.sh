#!/bin/sh

npm i
cd projects/sunbird-epub-player
npm i
cd ../..
npm run build-lib
cd dist/sunbird-epub-player
npm link
cd ../..
npm link @project-sunbird/sunbird-epub-player