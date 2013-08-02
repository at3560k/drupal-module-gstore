<?php

/**
 * @file
 * An API for working with gstore module.
 *
 *  Copyright 2013 by Jason Brown (http://edac.unm.edu/2011/07/jason-brown/)
 */

define('GSTORE_DEFAULT_WMS_URL', 'http://edacwms.unm.edu/cgi-bin/mapfiles/imagery_wms2?');
define('GSTORE_DEFAULT_WMS_LAYERS', 'naturalearthsw,southwestutm,nmcounties,Highways');
define('GSTORE_DEFAULT_MAP_WIDTH', 640);
define('GSTORE_DEFAULT_MAP_HEIGHT', 480);
define('GSTORE_DEFAULT_MAP_ZOOM', 8);

/**
 * Add JS needed to render
 */
function gstore_add_map($options) {
  static $init = FALSE;

  static $defaults = array(
    'mapId' => NULL, // domID
    'servicesURL' => NULL,
    'options' => array(
      'zoom' => 4,
    )
  );

  if (!$init) {
    $init = TRUE;
    $prefix = '/leaflet';
    $myJS = '/leaflet.js';
    $myCSS = '/leaflet.css';

    // TODO: We need the IE8 conditional CSS

    drupal_add_js(
        drupal_get_path('module', 'gstore') . $prefix . $myJS, array('scope' => 'header')
    );

    drupal_add_css(drupal_get_path('module', 'gstore') . $prefix . $myCSS);
  }

  // Add our loader JS in
  drupal_add_js(drupal_get_path(
      'module', 'gstore') . '/js/gstore_loader.js',
      array('scope' => 'footer')
  );

  // req php 5.3
  $finalOptions = array_replace_recursive($defaults, $options);

  // Add configuration options to JS
  drupal_add_js(array(
    'gstore' => array(
      'maps' => array($finalOptions)
      )), 'setting'
  );
}
