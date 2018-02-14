<?php

/*
 * Example PHP implementation used for the index.html example
 */

// DataTables PHP library
// !!! RESET THIS BEFORE PUSHING TO SERVER !!!

include( $_SERVER['DOCUMENT_ROOT'] . "/wp-content/plugins/wordpress_datatables/DataTables_Editor/php/DataTables.php");
 //include( $_SERVER['DOCUMENT_ROOT'] . "/stats4sd.org/wp-content/plugins/wordpress_datatables/DataTables_Editor/php/DataTables.php");

// // Alias Editor classes so they are easy to use
use
  DataTables\Database,
  DataTables\Editor,
  DataTables\Editor\Field,
  DataTables\Editor\Format,
  DataTables\Editor\Mjoin,
  DataTables\Editor\Options,
  DataTables\Editor\Upload,
  DataTables\Editor\Validate;

// Build our Editor instance and process the data coming from _POST

//get user ID from sent request
$user_id = $_POST['user_id'];


//use the Editor connection to get the url; 


Editor::inst( $db, 'freeagent_staff' )
  ->fields(
    // Document Table Data
    Field::inst( 'id' )->validator( 'Validate::notEmpty' ),
    Field::inst( 'url' ),
    Field::inst( 'name' )
    )
  ->where('id',$_POST['user_id'])
  ->process( $_POST )
  ->json();

