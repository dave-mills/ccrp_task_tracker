<?php

/*
 * Example PHP implementation used for the index.html example
 */

// DataTables PHP library

include( $_SERVER['DOCUMENT_ROOT'] . "/wp-content/plugins/wordpress_datatables/DataTables_Editor/php/DataTables.php");

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
Editor::inst( $db, 'ccrp_reports' )
  ->fields(
    // Document Table Data
    Field::inst( 'ccrp_reports.id' )
      ->validator( 'Validate::notEmpty' ),
    Field::inst('ccrp_reports.file_id')
      ->upload( Upload::inst($_SERVER['DOCUMENT_ROOT'].'/wp-content/uploads/ccrp_reports/__ID__-__NAME__.__EXTN__' )
        ->db( 'ccrp_reports_files', 'id', array(
          'fileName' => Upload::DB_FILE_NAME,
          'fileSize' => Upload::DB_FILE_SIZE,
          'fileUrl' => Upload::DB_WEB_PATH
        )
      )
    )
      ->setFormatter( 'Format::nullEmpty' ),
    Field::inst('ccrp_reports_files.fileName'),
    Field::inst('ccrp_reports_files.fileUrl'),
    Field::inst('ccrp_reports.dropbox_url'),
    Field::inst('wp_users.display_name'),
    Field::inst('ccrp_tasks.activities'),
    Field::inst( 'ccrp_reports.task_id' )
    ->options( Options::inst()
                ->table('ccrp_tasks')
                ->value('id')
                ->label('activities')
              ),
    Field::inst( 'ccrp_reports.staff_id' )
    ->options( Options::inst()
                ->table('wp_users')
                ->value('id')
                ->label('display_name')
            )
  )
  ->leftJoin( 'ccrp_reports_files','ccrp_reports.file_id','=','ccrp_reports_files.id')
  ->leftJoin( 'wp_users','ccrp_reports.staff_id','=','wp_users.ID')
  ->leftJoin( 'ccrp_tasks','ccrp_reports.task_id','=','ccrp_tasks.id')
  ->process( $_POST )
  ->json();
