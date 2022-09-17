const path = require('path');

class IconThemePlugin {
  constructor(options = {}) {
    this.metadataPath = options.metadataPath;
  }

  apply(compiler) {
    const pluginName = IconThemePlugin.name;
    const {webpack: {source: {RawSource}}} = compiler;

    compiler.hooks.emit.tap(pluginName, (compilation) => {
      const icons = compilation.getAssets().map(
        (asset) => asset.name.split('/').pop()
      );

      const metadataFile = `${this.metadataPath || compiler.context}/metadata.json`;
      const metadata = require(metadataFile);

      const iconEntries = icons.map((file) => [
        file.substr(0, file.lastIndexOf('.')),
        file.substr(file.lastIndexOf('.') + 1, file.length)
      ]);
      iconEntries.sort(([a], [b]) => a.localeCompare(b));

      const imageTypes = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'];
      metadata.icons = Object.fromEntries(
        iconEntries.filter(
          ([name, ext]) => imageTypes.includes(ext)
        )
      );

      const json = JSON.stringify(metadata, null, 2);
      const relativePath = path.relative(compiler.outputPath, metadataFile);
      compilation.emitAsset(relativePath, new RawSource(json));
    });
  }
}

module.exports = IconThemePlugin;
