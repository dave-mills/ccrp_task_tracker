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
Editor::inst( $db, 'ccrp_tasks' )
  ->fields(
    // Document Table Data
    Field::inst( 'ccrp_tasks.id' )->validator( 'Validate::notEmpty' ),
    // Field::inst( 'ccrp_tasks.title'),
    Field::inst( 'ccrp_tasks.activity' ),
    // Field::inst( 'ccrp_tasks.products' ),
    Field::inst( 'ccrp_tasks.date' ),
    Field::inst( 'ccrp_tasks.2017_report' ),
    Field::inst( 'ccrp_tasks.2018_status' ),
    Field::inst( 'ccrp_tasks.2018_comment' ),
    // Field::inst( 'ccrp_tasks.details' ),

    ////one-many join data
    
    //Staff - main responsibility
    Field::inst( 'ccrp_tasks.responsibility' )
      ->options(Options::inst()
                ->table('wp_users')
                ->value('id')
                ->label('display_name')
              ),
    Field::inst('wp_users.display_name','ccrp_tasks.primary_responsibility_name')
    )
  ->leftJoin( 'wp_users','ccrp_tasks.responsibility','=','wp_users.id')

  ->join(
    Mjoin::inst('ccrp_where')
      ->link('ccrp_tasks.id','ccrp_task_where.task_id')
      ->link('ccrp_where.id','ccrp_task_where.where_id')
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
      ->link('ccrp_tasks.id','ccrp_task_programarea.task_id')
      ->link('ccrp_programarea.id','ccrp_task_programarea.programarea_id')
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
      ->link('ccrp_tasks.id','ccrp_task_theme.task_id')
      ->link('ccrp_theme.id','ccrp_task_theme.theme_id')
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
      ->link('ccrp_tasks.id','ccrp_task_method.task_id')
      ->link('ccrp_method.id','ccrp_task_method.method_id')
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
  //other staff involved
  ->join(
    Mjoin::inst('wp_users')
      ->link('ccrp_tasks.id','ccrp_task_staff.task_id')
      ->link('wp_users.id','ccrp_task_staff.staff_id')
      ->fields(
        Field::inst('id')
          ->options(Options::inst()
            ->table('wp_users')
            ->value('id')
            ->label('display_name')
          ),
        Field::inst( 'display_name','secondary_responsibility_name' )
      )
    )
  //also get timesheets for the tasks through the same request
  ->join(
    Mjoin::inst('ccrp_timeslips')
    ->link('ccrp_tasks.id','ccrp_timeslips.task_id')
    ->fields(
      Field::inst('id')
      ->options(Options::inst()
                ->table('ccrp_timeslips')
                ->value('id')
                ->label('comment')
              ),
      Field::inst('staff_id'),
      Field::inst('comment'),
      Field::inst('hours'),
      Field::inst('date')
    )
  )
  ->join(
    Mjoin::inst('ccrp_reports')
    ->link('ccrp_tasks.id','ccrp_reports.task_id')
    ->fields(
      Field::inst('id')
    )
  )
  ->process( $_POST )
  ->json();
