<?php

/*
 * Example PHP implementation used for the index.html example
 */

// DataTables PHP library
// !!! RESET THIS BEFORE PUSHING TO SERVER !!!

if(strpos($_SERVER['DOCUMENT_ROOT'], 'stats4sd.org') !== false) {
  $dt_string = "/wp-content/plugins/wordpress_datatables/DataTables_Editor/php/DataTables.php";
}

else {
  $dt_string = "/stats4sd.org/wp-content/plugins/wordpress_datatables/DataTables_Editor/php/DataTables.php";
}

include( $_SERVER['DOCUMENT_ROOT'] . $dt_string);


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
                ->label('activity')
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
    Field::inst('ccrp_tasks.activity'),

    Field::inst('ccrp_timeslips.url'),
    Field::inst('ccrp_timeslips.chargeable')
    )
  ->leftJoin( 'wp_users','ccrp_timeslips.staff_id','=','wp_users.ID')
  ->leftJoin( 'ccrp_tasks','ccrp_timeslips.task_id','=','ccrp_tasks.id')

   ->join(
    Mjoin::inst('ccrp_where')
      ->link('ccrp_timeslips.id','ccrp_timeslip_where.timeslip_id')
      ->link('ccrp_where.id','ccrp_timeslip_where.where_id')
      ->order('name asc')
      ->fields(
        Field::inst('id')
          ->options(Options::inst()
            ->table('ccrp_where')
            ->value('id')
            ->label('name')
          ),
        Field::inst( 'name' )
      )
    )
  //programarea
  ->join(
    Mjoin::inst('ccrp_programarea')
      ->link('ccrp_timeslips.id','ccrp_timeslip_programarea.timeslip_id')
      ->link('ccrp_programarea.id','ccrp_timeslip_programarea.programarea_id')
      ->order('programarea asc')
      ->fields(
        Field::inst('id')
          ->options(Options::inst()
            ->table('ccrp_programarea')
            ->value('id')
            ->label('programarea')
          ),
        Field::inst( 'programarea' )
      )
    )
  //theme
  ->join(
    Mjoin::inst('ccrp_theme')
      ->link('ccrp_timeslips.id','ccrp_timeslip_theme.timeslip_id')
      ->link('ccrp_theme.id','ccrp_timeslip_theme.theme_id')
      ->order('theme asc')
      ->fields(
        Field::inst('id')
          ->options(Options::inst()
            ->table('ccrp_theme')
            ->value('id')
            ->label('theme')
          ),
        Field::inst( 'theme' )
      )
    )
  //method
  ->join(
    Mjoin::inst('ccrp_method')
      ->link('ccrp_timeslips.id','ccrp_timeslip_method.timeslip_id')
      ->link('ccrp_method.id','ccrp_timeslip_method.method_id')
      ->order('method_type asc')
      ->fields(
        Field::inst('id')
          ->options(Options::inst()
            ->table('ccrp_method')
            ->value('id')
            ->label('method_type')
          ),
        Field::inst( 'method_type' )
      )
    )
  ->process( $_POST )
  ->json();
