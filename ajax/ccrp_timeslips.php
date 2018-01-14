<?php

/*
 * Example PHP implementation used for the index.html example
 */

// DataTables PHP library
include( "/Users/davidmills/Sites/stats4sd.org/wp-content/plugins/wordpress_datatables/datatables_editor/php/DataTables.php");

// Alias Editor classes so they are easy to use
use
  DataTables\Editor,
  DataTables\Editor\Field,
  DataTables\Editor\Format,
  DataTables\Editor\Mjoin,
  DataTables\Editor\Options,
  DataTables\Editor\Upload,
  DataTables\Editor\Validate;

// Build our Editor instance and process the data coming from _POST
Editor::inst( $db, 'ccrp_timeslips' )
  ->fields(
    // Document Table Data
    Field::inst( 'ccrp_timeslips.id' )->validator( 'Validate::notEmpty' ),
    Field::inst( 'ccrp_timeslips.task_id' )
    ->options( Options::inst()
                ->table('ccrp_tasks')
                ->value('id')
                ->label('activities')
              ),
    Field::inst( 'ccrp_timeslips.staff_id' )
    ->options( Options::inst()
                ->table('wp_users')
                ->value('id')
                ->label('display_name')
            ),
    Field::inst( 'ccrp_timeslips.comment' ),
    Field::inst( 'ccrp_timeslips.hours' ),
    Field::inst( 'ccrp_timeslips.date' ),

    Field::inst('wp_users.display_name'),
    Field::inst('ccrp_tasks.activities')
    )
  ->leftJoin( 'wp_users','ccrp_timeslips.staff_id','=','wp_users.ID')
  ->leftJoin( 'ccrp_tasks','ccrp_timeslips.task_id','=','ccrp_tasks.id')
  ->process( $_POST )
  ->json();
