(function( AeroGear, $, undefined ) {
    /**
        A collection of sync managers (conductors). This object provides a way to keep client data (via DataManager) and server-side data (via Pipeline) in sync.
        @class
        @augments AeroGear.Core
        @param {String|Array|Object} [config] - A configuration for the conductor(s) being created along with the SyncManager. If an object or array containing objects is used, the objects can have the following properties:
        @param {String} config.name - the name that the conductor will later be referenced by
        @param {String} [config.type="Event"] - the type of adapter as determined by the adapter used
        @param {Object} [config.settings={}] - the settings to be passed to the adapter
        @returns {object} SyncManager - The created SyncManager containing any conductors that may have been created
        @example
        // Create an empty SyncManager
        var sm = AeroGear.SyncManager();

        // Create a single conductor using the default adapter
        var sm2 = AeroGear.SyncManager( "tasks" );

        // Create multiple conductors using the default adapter
        var sm3 = AeroGear.SyncManager( [ "tasks", "projects" ] );
     */
    AeroGear.SyncManager = function( config ) {
        // Allow instantiation without using new
        if ( !( this instanceof AeroGear.SyncManager ) ) {
            return new AeroGear.SyncManager( config );
        }

        // Super Constructor
        AeroGear.Core.call( this );

        this.lib = "SyncManager";
        this.type = config ? config.type || "Event" : "Event";

        /**
            The name used to reference the collection of conductor instances created from the adapters
            @memberOf AeroGear.SyncManager
            @type Object
            @default conductors
         */
        this.collectionName = "conductors";

        this.add( config );
    };

    AeroGear.SyncManager.prototype = AeroGear.Core;
    AeroGear.SyncManager.constructor = AeroGear.SyncManager;

    /**
        The adapters object is provided so that adapters can be added to the AeroGear.SyncManager namespace dynamically and still be accessible to the add method
        @augments AeroGear.SyncManager
     */
    AeroGear.SyncManager.adapters = {};
})( AeroGear, jQuery );
