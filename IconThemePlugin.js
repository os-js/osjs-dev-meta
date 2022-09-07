const path = require('path');

class IconThemePlugin {
  apply(compiler) {
    const pluginName = IconThemePlugin.name;
    const { webpack } = compiler;
    const { RawSource } = webpack.sources;

    compiler.hooks.emit.tap(pluginName, (compilation) => {
      const icons = compilation.getAssets().map(
        (asset) => asset.name.split('/').pop()
      );

      const iconEntries = icons.map((file) => [
        file.substr(0, file.lastIndexOf('.')),
        file.substr(file.lastIndexOf('.') + 1, file.length)
      ]);

      const metadataFile = `${compiler.context}/metadata.json`;
      const metadata = require(metadataFile);
      metadata.icons = Object.fromEntries(iconEntries);

      const json = JSON.stringify(metadata, null, 2);
      const relativePath = path.relative(compiler.outputPath, metadataFile);
      compilation.emitAsset(relativePath, new RawSource(json));
    });
  }
}

module.exports = IconThemePlugin;
