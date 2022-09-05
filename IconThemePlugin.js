class IconThemePlugin {
  // Define `apply` as its prototype method which is supplied with compiler as its argument
  apply(compiler) {
    const pluginName = IconThemePlugin.name;
    const { webpack } = compiler;
    const { RawSource } = webpack.sources;

    // Specify the event hook to attach to
    compiler.hooks.emit.tap(pluginName, (compilation) => {
      const icons = compilation.getAssets().map(
        (asset) => asset.name.split('/').pop()
      );

      // Create an object with the property name as the asset name
      // and the value as the file extension
      const iconTypes = icons.reduce(
        (acc, icon) => {
          const [name, ext] = icon.split('.');
          acc[name] = ext;
          return acc;
        },
        {}
      );

      // Read the current metadata file
      const metadata = require('./metadata.json');
      // Overwrite the icons property with the new icon types
      metadata.icons = iconTypes;
      // Convert the metadata object to a JSON string
      const json = JSON.stringify(metadata, null, 2);
      // Create a new asset with the metadata.json file name
      compilation.emitAsset('../metadata.json', new RawSource(json));
    });
  }
}

module.exports = IconThemePlugin;
