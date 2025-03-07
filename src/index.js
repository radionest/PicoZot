// Create the global object
var PicoZot = {
  initialized: false,
  
  // Initialize the plugin
  init: function({ id, version, rootURI }) {
    if (this.initialized) return;
    
    this.id = id;
    this.version = version;
    this.rootURI = rootURI;
    this.initialized = true;
    
    // Import PicoZot modules
    this.utils = {
      logger: {}
    };
    
    this.services = {
      picoParser: {},
      literatureReview: {},
      aiService: {}
    };
    
    this.ui = {
      dialog: {},
      sidebar: {},
      templates: {}
    };
    
    // Initialize logger
    if (typeof Zotero !== 'undefined') {
      this.utils.logger.debug = function(msg) { Zotero.debug("PicoZot: " + msg); };
      this.utils.logger.info = function(msg) { Zotero.debug("PicoZot: " + msg); };
      this.utils.logger.warn = function(msg) { Zotero.debug("PicoZot: " + msg); };
      this.utils.logger.error = function(msg) { Zotero.debug("PicoZot ERROR: " + msg); };
    }
    
    Zotero.debug("PicoZot initialized with version " + version);
  },
  
  // Add UI to all Zotero windows
  addToAllWindows: function() {
    try {
    // Get all currently open windows
    var windows = Zotero.getMainWindows();
    for (let win of windows) {
      this.addToWindow(win);
      }
    } catch (e) {
      Zotero.debug("PicoZot error in addToAllWindows: " + e);
    }
  },
  
  // Add UI elements to a Zotero window
  addToWindow: function(window) {
    try {
      if (!window || !window.document) return;
      
      // Add UI components
      this.addMenuItems(window);
      this.createSidebar(window);
    } catch (e) {
      Zotero.debug("PicoZot: Error adding to window: " + e);
    }
  },
  
  // Remove UI from all Zotero windows
  removeFromAllWindows: function() {
    try {
    var windows = Zotero.getMainWindows();
    for (let win of windows) {
      this.removeFromWindow(win);
      }
    } catch (e) {
      Zotero.debug("PicoZot error in removeFromAllWindows: " + e);
    }
  },
  
  // Remove UI elements from a Zotero window
  removeFromWindow: function(window) {
    try {
      if (!window || !window.document) return;
      
      // Remove UI components
      this.removeMenuItems(window);
      // Uncomment when ready to implement: this.removeSidebar(window);
    } catch (e) {
      Zotero.debug("PicoZot: Error removing from window: " + e);
    }
  },
  
  // Add menu items to the Zotero UI
  addMenuItems: function(window) {
    try {
      if (!window || !window.document) return;
      
      // Add to Tools menu
      var toolsMenu = window.document.getElementById('menu_ToolsPopup');
      if (toolsMenu) {
        var separator = window.document.createElement('menuseparator');
        separator.id = 'picozot-separator';
        toolsMenu.appendChild(separator);
        
        var menuItem = window.document.createElement('menuitem');
        menuItem.setAttribute('id', 'picozot-menu');
        menuItem.setAttribute('label', 'PicoZot');
        menuItem.addEventListener('command', () => {
          this.showDialog('main');
        });
        toolsMenu.appendChild(menuItem);
      }
    } catch (e) {
      Zotero.debug("PicoZot: Error adding menu items: " + e);
    }
  },
  
  // Remove menu items from the Zotero UI
  removeMenuItems: function(window) {
    try {
      if (!window || !window.document) return;
      
      // Remove from Tools menu
      var menuItem = window.document.getElementById('picozot-menu');
      if (menuItem) menuItem.remove();
      
      var separator = window.document.getElementById('picozot-separator');
      if (separator) separator.remove();
    } catch (e) {
      Zotero.debug("PicoZot: Error removing menu items: " + e);
    }
  },
  
  // Create the sidebar UI
  createSidebar: function(window) {
    // Implement sidebar creation
  },
  
  // Remove the sidebar UI
  removeSidebar: function(window) {
    // Implement sidebar removal
  },
  
  // Show a dialog
  showDialog: function(type, options = {}) {
    try {
      Zotero.debug("PicoZot: Showing dialog type: " + type);
    // Implement dialog display
      alert("PicoZot dialog: " + type);
    } catch (e) {
      Zotero.debug("PicoZot: Error showing dialog: " + e);
    }
  },
  
  // Main function to run once Zotero is ready
  main: async function() {
    try {
      // Initialize services
      // Set up event listeners
      // Load configuration
      Zotero.debug("PicoZot main function completed successfully");
      return true;
    } catch (e) {
      Zotero.debug("PicoZot: Error in main function: " + e);
      return false;
    }
  }
};

// Make the PicoZot object global
if (typeof window != 'undefined') {
  window.PicoZot = PicoZot;
}

// Also make it available in the global scope
if (typeof globalThis !== 'undefined') {
  globalThis.PicoZot = PicoZot;
}

// Mozilla-specific export for compatibility
if (typeof Components !== 'undefined') {
  this.PicoZot = PicoZot;
}