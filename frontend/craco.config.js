module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Suppress source map warnings for html2pdf.js
      webpackConfig.ignoreWarnings = [
        ...(webpackConfig.ignoreWarnings || []),
        /Failed to parse source map/,
        /ENOENT: no such file or directory/,
      ];
      
      return webpackConfig;
    },
  },
}; 