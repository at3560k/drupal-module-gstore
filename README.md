drupal-module-gstore
====================

Drupal7 module implementing GSTORE JS API with leaflet.


To Install:

* cp -r drupal-module-gstore/gstore $DRUPAL_ROOT/sites/all/modules
* cd $DRUPAL_ROOT
* drush pm-enable gstore

Utilize a [services.json URL](http://gstore.unm.edu/apps/rgis/datasets/04a22a6b-3b8b-4f73-b7f3-668a1f16f4d3/services.json)

## Notes, Cautions, Bugs

* This presently makes use of my cloudmade API.  Please change the key for your base layers
* Height/Width options not set at present, but I'm putting this out there now.
* This will fail on systems without WMS or HTML/FGDC views at present.
* This utilizes jsonpwrapper.com until we have our own jsonpcallback running and/or browsers reliably support CORS

