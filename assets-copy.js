const fs = require('fs-extra');
(async () => {
    try {
      var source = "projects/sunbird-epub-player/node_modules/@project-sunbird/sunbird-player-sdk-v8/lib/assets";
        const dest = "dist/sunbird-epub-player/lib/assets/";
        var libsource = "projects/sunbird-epub-player/src/lib/assets";
        const isAssetsExists = await fs.pathExists(dest)

        if (isAssetsExists) {
            await fs.remove(dest);
        }
        await fs.ensureDir(dest);
        await fs.copy(source, dest)
        await fs.copy(libsource, dest)
        console.log('Assets copied successfully')
    } catch (err) {
        console.error("Error while copying assets", err)
    }
})();