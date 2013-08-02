(function($) {
    // Stores current opened infoWindow.
    var currentInfoWindow = null;

    /**
     * Create leaflet map using gstore api.
     *
     * @param object map
     *   Object of map options.
     * @return object
     *   On success returns gmap object.
     *
     *   Caution:  This actually expects to receive a gstore API, but /wraps/
     *   it in a call to jsonpwrapper.com, pending callback support in gstore
     */
    function gstoreCreateMap(map) {
        if (map.mapId === null) {
            alert(Drupal.t('Error: Map id element is not defined.'));
            return null;
        }

        var lMap = L.map(map.mapId).setView([34.51, -106.26], 6);

        var baseTile = L.tileLayer('http://{s}.tile.cloudmade.com/32f24392ce69490c9d0a891a03b44048/997/256/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
            maxZoom: 18
        }).addTo(lMap);

        var sorenTile = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            maxZoom: 18
        });

        var baseMaps = {
            'CloudMade OSM Base': baseTile,
            'Soren': sorenTile
        };
        //L.control.layers(baseMaps, overlays).addTo(map);
        var overlays = {};

        //JSON-P in jquery 1.4.4 is a little ugly
        $.ajax({
            //url: map.servicesURL,
            url: 'http://jsonpwrapper.com',
            data: {
                urls: [map.servicesURL]
            },
            dataType: 'jsonp',
            // cachebust, callback
            success: function(data, txtStatus, jqXHR) {
                // A result of our jsonpwrapper
                data = data[0].body;
                if (typeof data == 'string') {
                    data = $.parseJSON(data);
                }
                var services = data.services;
                // find wms
                $.each(services, function(i, service) {
                    if (typeof service.wms == 'string') {
                        var layer = L.tileLayer.wms(service.wms, {
                            layers: data.name,
                            format: 'image/png',
                            transparent: true
                        });

                        //overlays[data.name] = layer;
                        overlays[data.description] = layer;
                        layer.addTo(lMap);
                    }
                });

                $('#' + map.mapId).after(
                    "<br/><iframe src='" +
                    data.metadata[0].fgdc.html + "'" +
                    "style='width:600px; height:600px' />"
                );

                // Get polygon
                var bbox = data.spatial.bbox;
                var minx = parseFloat(bbox[0]);
                var miny = parseFloat(bbox[1]);
                var maxx = parseFloat(bbox[2]);
                var maxy = parseFloat(bbox[3]);

                var poly = L.polygon([
                    [miny, minx],
                    [miny, maxx],
                    [maxy, maxx],
                    [maxy, minx]], {
                    color: 'red',
                    fillOpacity: 0.1
                });
                poly.addTo(lMap);
            },
            error: function(jwXHR, txtStatus, err) {
                alert(txtStatus);
            },
            complete: function(jqXHR, txtStatus) {
                // after success & error CB
                L.control.layers(baseMaps, overlays).addTo(lMap);
            }
        });

        return lMap;
    }

    /**
     * Attach gstore maps.
     */
    Drupal.behaviors.gstore = {
        attach: function(context, settings) {
            // Create all defined maps.
            if (Drupal.settings.gstore === undefined) {
                return;
            }

            // We only pass one, unlike gmap_3
            $.each(Drupal.settings.gstore.maps, function(i, map) {
                // @todo - we should really use css selector here and not only element id.
                var $mapElement = $('#' + map.mapId, context);
                if ($mapElement.length === 0 || $mapElement.hasClass('gstore-tools-processed')) {
                    return;
                }
                $mapElement.addClass('gstore-tools-processed');
                var lMap = gstoreCreateMap(map);
            });
        }
    };

})(jQuery);
