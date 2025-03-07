var rootURI;
var { utils: Cu } = Components;

// Import Zotero services
Cu.import("resource://zotero/loader.jsm");

// Define startup function
function startup({ id, version, resourceURI }, reason) {
  // Set rootURI based on resourceURI
  rootURI = resourceURI.spec;
  
  // Register resource protocol
  let handler = Services.io.getProtocolHandler("resource")
    .QueryInterface(Components.interfaces.nsIResProtocolHandler);
  
  handler.setSubstitution("picozot", resourceURI);
  
  // Wait for Zotero to be fully loaded
  if (Zotero.initialized) {
    initPicoZot();
  } else {
    let listener = {
      onInit: function() {
        Zotero.removeInitListener(listener);
        initPicoZot();
      }
    };
    Zotero.addInitListener(listener);
  }
}

// Initialize the plugin
function initPicoZot() {
  try {
    // Load the main script
    Services.scriptloader.loadSubScript(
      rootURI + "index.js",
      null,
      "UTF-8"
    );
    
    Zotero.debug("PicoZot initialized");
  } catch (e) {
    Zotero.debug("Error initializing PicoZot: " + e);
  }
}

// Define shutdown function
function shutdown({ id, version, resourceURI }, reason) {
  if (reason === APP_SHUTDOWN) return;
  
  // Unregister resource alias
  let handler = Services.io.getProtocolHandler("resource")
    .QueryInterface(Components.interfaces.nsIResProtocolHandler);
  
  handler.setSubstitution("picozot", null);
}

// Define install function
function install(data, reason) {}

// Define uninstall function
function uninstall(data, reason) {}