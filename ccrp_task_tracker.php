<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              http://example.com
 * @since             1.0.0
 * @package           ccrp_task_tracker
 *
 * @wordpress-plugin
 * Plugin Name:       Stats4SD CCRP Task Tracker
 * Plugin URI:        https://stats4sd.org
 * Description:       A custom plugin to track CCRP / RMS project tasks and timeslips. Requires wordpress_datatables (a plugin by Stats4SD)
 * Version:           0.0.1
 * Author:            Stats4SD
 * Author URI:        http://stats4sd.org/
 * License:           -
 * License URI:       -
 * Text Domain:       ccrp_task_tracker
 * Domain Path:       /languages
 */


// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
  die;
}


// This plugins adds a set of page templates, and checks for those templates to queue the correct javascript files.
add_action('wp_enqueue_scripts','init_taskTables');


function init_taskTables() {


  if(is_page_template('page-template-ccrp_tasks.php')) {
    wp_enqueue_style( 'ccrp_tasks-style',plugin_dir_url( __FILE__ ) . "css/ccrp_tasks.css", time() );

    wp_register_script( 'ccrp_tasks-script', plugin_dir_url( __FILE__ ) . '/js/ccrp_tasks.js', array( 'jquery','dt-script','dataTables-editor-script' ), time(), true );
    wp_enqueue_script( 'ccrp_tasks-script');
  }
  
    //select 2 scripts: 
    //
    wp_enqueue_style('select2-style',"https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/css/select2.min.css","4.0.6");
    wp_enqueue_script('select2-script',"https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/js/select2.min.js",array('jquery'),"4.0.6",true);

  //add mustache support
  //
    wp_enqueue_script('mustache-script',plugin_dir_url(__FILE__) . '/js/mustache.js/mustache.min.js',array('jquery'),"4.0.6",true);


    //Setup the parameters for "localising" the javascript. (i.e. passing values into the javascript)
    $params = array(
      //file path for the ajax files we need to reference in the javascript.
      'editorurl' => plugin_dir_url(__FILE__) . 'ajax',
      //the ajax url for a propoer wordpress ajax call;
      'ajaxurl' => admin_url( 'admin-ajax.php' ),
      // create a 'nonce' to properly authenticate any ajax requests. 
      'pa_nonce' => wp_create_nonce('pa_nonce'),
      'current_user' => wp_get_current_user()->ID
    );

    //localise!
    wp_localize_script('ccrp_tasks-script','vars',$params);
}
