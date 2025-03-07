var PicoZot;

function log(msg) {
  Zotero.debug("PicoZot: " + msg);
}

function install() {
  log("PicoZot installed");
}

async function startup({ id, version, rootURI }) {
  log("Starting PicoZot");

  try {
    // Load the main script
    Services.scriptloader.loadSubScript(
      rootURI + "index.js",
      null,
      "UTF-8"
    );
    
    // Initialize the plugin
    if (typeof PicoZot !== 'undefined' && PicoZot.init) {
      PicoZot.init({ id, version, rootURI });
      
      if (PicoZot.addToAllWindows) {
        PicoZot.addToAllWindows();
      }
      
      if (PicoZot.main) {
        await PicoZot.main();
      }
    } else {
      log("Error: PicoZot global object not found after loading index.js");
    }
  } catch (e) {
    log("Error in PicoZot startup: " + e);
  }
}

function onMainWindowLoad({ window }) {
  if (PicoZot && PicoZot.addToWindow) {
    PicoZot.addToWindow(window);
  }
}

function onMainWindowUnload({ window }) {
  if (PicoZot && PicoZot.removeFromWindow) {
    PicoZot.removeFromWindow(window);
  }
}

function shutdown() {
  log("Shutting down PicoZot");
  
  if (PicoZot && PicoZot.removeFromAllWindows) {
    PicoZot.removeFromAllWindows();
  }
  
  PicoZot = undefined;
}

function uninstall() {
  log("PicoZot uninstalled");
}