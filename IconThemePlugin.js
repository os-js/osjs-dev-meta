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
        file.substr(0, file.lastIndexOf(".")),
        file.substr(file.lastIndexOf(".") + 1, file.length)
      ]);
      const iconTypes = Object.fromEntries(iconEntries);

      const metadata = require('./metadata.json');
      metadata.icons = iconTypes;
      const json = JSON.stringify(metadata, null, 2);
      compilation.emitAsset('../metadata.json', new RawSource(json));
    });
  }
}

module.exports = IconThemePlugin;
