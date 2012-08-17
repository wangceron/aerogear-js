/* Need to add license, description, etc. */

// Rest Adapter (default)
(function( aerogear, $, undefined ) {
    // TODO: Share this across entire lib
    function isArray( obj ) {
        return ({}).toString.call( obj ) === "[object Array]";
    }

    aerogear.pipeline.adapters.rest = function( pipeName, recordId, ajaxSettings ) {
        ajaxSettings = $.extend({
            // use the pipeName as the default rest endpoint
            url: pipeName,
            // set the default content type and Accept headers to JSON
            contentType: "application/json",
            dataType: "json"
        }, ajaxSettings );

        return {
            recordId: recordId,
            type: "rest",
            data: null,
            read: function( options ) {
                var that = this,
                    data;
                if ( options ) {
                    if ( options.ajax && options.ajax.data ) {
                        data = options.ajax.data;
                    } else if ( options.data ) {
                        data = options.data;
                    } else if ( !options.ajax ) {
                        options.ajax = {};
                    }
                    if ( data ) {
                        options.ajax.data = data;
                    }
                } else {
                    options = { ajax: {} };
                }

                var success = function( data ) {
                    that.data = isArray( data ) ? data : [ data ];

                    if ( options.ajax.success ) {
                        options.ajax.success.apply( this, arguments );
                    }
                };

                return $.ajax( $.extend( {}, ajaxSettings, { type: "GET" }, options.ajax, { success: success } ) );
            },

            save: function( data, options ) {
                var that = this,
                    type,
                    url,
                    itemFound = false;
                data = data || {};
                options = options || {};
                type = data[ this.recordId ] ? "PUT" : "POST";

                if ( !options.ajax.url && data[ this.recordId ] ) {
                    url = ajaxSettings.url + "/" + data[ this.recordId ];
                } else if ( !options.ajax.url ) {
                    url = ajaxSettings.url;
                } else {
                    url = options.ajax.url;
                }

                var success = function( data ) {
                    if ( that.data ) {
                        for( var item in that.data ) {
                            if ( that.data[ item ].id === data.id ) {
                                that.data[ item ] = data;
                                itemFound = true;
                            }
                        }
                        if ( !itemFound ) {
                            that.data.push( data );
                        }
                    } else {
                        that.data = isArray( data ) ? data : [ data ];
                    }

                    if ( options.ajax.success ) {
                        options.ajax.success.apply( this, arguments );
                    }
                };

                if ( typeof data !== "string" ) {
                    data = JSON.stringify( data );
                }

                return $.ajax( $.extend( {}, ajaxSettings,
                    {
                        data: data,
                        type: type,
                        url: url
                    },
                    options.ajax || {},
                    { success: success }
                ));
            },

            remove: function( rem, options ) {
                var that = this,
                    delId = 0,
                    delPath = "",
                    url;

                options = options || {};

                if ( typeof rem === "string" || typeof rem === "number" ) {
                    delId = parseInt( rem, 10 );
                } else if ( rem ) {
                    if ( typeof rem.record === "string" || typeof rem.record === "number" ) {
                        delId = parseInt( rem.record, 10 );
                    } else if ( rem.record ) {
                        delId = parseInt( rem.record[ this.recordId ], 10 );
                    }
                } else {
                    throw "aerogear.pipeline.rest: missing argument";
                }

                delPath = delId ? "/" + delId : "";
                if ( options.ajax ) {
                    if ( options.ajax.url ) {
                        url = options.ajax.url;
                    } else {
                        url = ajaxSettings.url + delPath;
                    }
                } else if ( rem.ajax ) {
                    options.ajax = rem.ajax;
                    if ( rem.ajax.url ) {
                        url = rem.ajax.url;
                    } else {
                        url = ajaxSettings.url + delPath;
                    }
                } else {
                    url = ajaxSettings.url + delPath;
                }

                var success = function( data ) {
                    var itemIndex;

                    for( var item in that.data ) {
                        if ( that.data[ item ].id === delId ) {
                            itemIndex = that.data.indexOf( that.data[ item ] );
                            that.data.slice( itemIndex, itemIndex + 1 );
                        }
                    }

                    if ( options.ajax.success ) {
                        options.ajax.success.apply( this, arguments );
                    }
                };

                return $.ajax( $.extend( {}, ajaxSettings,
                    {
                        type: "DELETE",
                        url: url
                    },
                    options.ajax || {},
                    { success: success }
                ));
            }
        };
    };
})( aerogear, jQuery );