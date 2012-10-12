(function( AeroGear, $, uuid, undefined ) {
    /**
        The Event adapter is the default type used when creating a new conductor. It uses events fired by pipes and stores to keep client and server side data in sync.
        @constructs AeroGear.SyncManager.adapters.Event
        @param {String} conductorName - the name used to reference this particular conductor
        @param {Object} settings - the settings to be passed to the adapter
        @param {Object} settings.pipe - the pipe to use for communication with the server
        @param {Object} settings.store - the store that will be synchronized with the server
        @param {Object} [settings.syncCallbacks={}] - the additional callbacks to be fired after a sync attempt in addition to callbacks defined on the pipe
        @param {Object} [settings.syncCallbacks.readError] - sync failed
        @param {Object} [settings.syncCallbacks.readSuccess] - sync success
        @param {Object} [settings.syncCallbacks.saveError] - sync failed
        @param {Object} [settings.syncCallbacks.saveSuccess] - sync success
        @returns {Object} The created conductor
     */
    AeroGear.SyncManager.adapters.Event = function( conductorName, settings ) {
        // Allow instantiation without using new
        if ( !( this instanceof AeroGear.SyncManager.adapters.Event ) ) {
            return new AeroGear.SyncManager.adapters.Event( conductorName, settings );
        }

        settings = settings || {};

        // Private Instance vars
        var pipe = settings.pipe,
            //pipeName = pipe.getName(),
            syncCallbacks = settings.syncCallbacks || {},
            store = settings.store,
            storeName = store.getName(),
            type = "Event";

        // Privileged Methods
        /**
            Returns the pipe
            @private
            @augments Event
            @returns {Object}
         */
        this.getPipe = function() {
            return pipe;
        };

        /**
            Returns the store
            @private
            @augments Event
            @returns {Object}
         */
        this.getStore = function() {
            return store;
        };

        /**
            Returns the sync callbacks
            @private
            @augments Event
            @returns {Object}
         */
        this.getSyncCallbacks = function() {
            return syncCallbacks;
        };

        // Event bindings to "watch" for the need to sync
        $( document )
            // Store - Save
            .on( "ag-sync-" + storeName + "-store-save", function( event ) {
                var item,
                    data = store.getData( true );

                for ( item in data ) {
                    if ( data[ item ][ "ag-sync-status" ] === AeroGear.DataManager.STATUS_NEW || data[ item ][ "ag-sync-status" ] === AeroGear.DataManager.STATUS_MODIFIED ) {
                        // Batching this into a single save would be preferred but the server needs to be able to handle that
                        // Revisit after determining method for server to inform client of capabilities/expectations
                        pipe.save( data[ item ], {
                            success: syncCallbacks.saveSuccess,
                            error: syncCallbacks.saveError,
                            noSync: true
                        });
                    }
                }
            });
    };
})( AeroGear, jQuery, uuid );
