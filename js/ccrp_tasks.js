
//Setup variables for scope reasons
var timeslipsTable;
var reportsTable;
var tasksTable;

var taskEditor;
var timeslipEditor;
var reportEditor;

var secondaryInit = 0;
var rowShown = -1;

jQuery(document).ready(function($){
  
  console.log("loading ccrp task tracker code");

  //setup timeslip editor: 
  timeslipEditor = new $.fn.dataTable.Editor({
    template: "#timeslip_editor",
    ajax: vars.editorurl + "/ccrp_timeslips.php",
    table: "#timeslips_table",
    fields: [
    {
      label: "Task",
      type: "select",
      labelInfo: "select the task for this timeslip",
      name:"ccrp_timeslips.task_id",
      attr:{
          style: "width:50%"
        }
    },
    {
      label:"Comment",
      type:"textarea",
      labelInfo: "what were you doing? (brief description)",
      name:"ccrp_timeslips.comment"
    },
    {
      label:"Time Spent (hours)",
      type:"text",
      labelInfo: "enter number of hours",
      name:"ccrp_timeslips.hours"
    },
    {
      label:"Date",
      type:"date",
      labelInfo: "enter date of the work done",
      name:"ccrp_timeslips.date"
    },
    {
      label:"Staff",
      type:"select",
      labelInfo: "Who did this? (will eventually default to logged-in user",
      name:"ccrp_timeslips.staff_id",
        attr:{
          style: "width:50%"
        }
    }
    ]
  });

  reportEditor = new $.fn.dataTable.Editor({
    template: "#report_editor",
    ajax: vars.editorurl + "/ccrp_reports.php",
    table: "#reports_table",
    fields: [
    {
      label: "Task",
      type: "select",
      labelInfo: "select the task for this report",
      name:"ccrp_reports.task_id",
      attr:{
          style: "width:50%"
        }
    },
    {
      label: "File Upload:",
      name: "ccrp_reports.file_id",
      type: "upload",
      display: function ( id ) {
          return '<a href="'+reportEditor.file( 'ccrp_reports_files', id ).fileUrl+'">'+reportEditor.file('ccrp_reports_files',id).fileName+'</a>';
      }
  },
      {
      label: "Dropbox Url:",
      name: "ccrp_reports.dropbox_url",
      type: "text",
      display: function ( id ) {
          return '<a href="'+reportEditor.file( 'ccrp_reports_files', id ).fileUrl+'">'+reportEditor.file('ccrp_reports_files',id).fileName+'</a>';
      }
  },
    {
      label:"Author",
      type:"select",
      labelInfo: "Main report author",
      name:"ccrp_reports.staff_id",
        attr:{
          style: "width:50%"
        }
    }
    ]
  });

  //initialise the task editor
  taskEditor = new $.fn.dataTable.Editor({
    ajax: vars.editorurl + "/ccrp_tasks.php",
    table: "#ccrp_tasks_table",
    template: "#task_editor",
    fields: [
      {
        label: "Activities / Tasks",
        type: "textarea",
        name: "ccrp_tasks.activities"
      },
      {
        label: "Products",
        type: "textarea",
        labelInfo: "Leave blank if none. e.g. App templates, sharable resources, tangible products that can be referenced",
        name: "ccrp_tasks.products"
      },
      {
        label: "Date given to task",
        labelInfo: "Dates given are approximate - generally a month-range or approximate time of year.",
        name: "ccrp_tasks.date"
      },
      {
        label: "Responsibility",
        labelInfo: "Person responsible for task",
        type: "select",
        name: "ccrp_tasks.responsibility",
        attr:{
          style: "width:50%"
        }
      },
      {
        label: "Other Staff",
        labelInfo: "Other RMS people involved in the task",
        type: "select",
        multiple: true,
        name: "wp_users[].id"
      },
      {
        label: "Program Area(s)",
        type: "select",
        multiple: true,
        name: "ccrp_programarea[].id"
      },
    {
        label: "Theme(s)",
        type: "select",
        multiple: true,
        name: "ccrp_theme[].id"
      },
          {
        label: "Method / Type(s)",
        type: "select",
        multiple: true,
        name: "ccrp_method[].id"
      },
      {
        label: "2017 Report",
        type: "textarea",
        labelInfo: "brief comments from main staff member on activity status - from December RMS meeting",
        name: "ccrp_tasks.2017_report"

      },
      {
        label: "2018 Status",
        type: "textarea",
        labelInfo: "is task complete, ongoing or stopped for 2018",
        name: "ccrp_tasks.2018_status"
      },
      {
        label: "2018 Comment",
        type: "textarea",
        labelInfo: "Any comments about this activity going into 2018 - from December RMS meeting",
        name: "ccrp_tasks.2018_comment"

      }
    ]
  });


  // initialise select2 plugin
  taskEditor.on('open displayOrder',function(e,mode,action){
    console.log("editor init complete");
    $('#task_editor select')
      .select2({
        width: "80%"
      });
  })
 
  timeslipEditor.on('open displayOrder',function(e,mode,action){
    console.log("timeslip editor init complete");
    $('#timeslip_editor select')
      .select2({
        width: "80%"
      });
  });
  
  reportEditor.on('open displayOrder',function(e,mode,action){
    console.log("report editor init complete");
    $('#report_editor select')
      .select2({
        width: "80%"
      });
  });
   //setup hidden datatables:
  timeslipTable();
  reportsTable();

  //setup top buttons: 
  jQuery('#view_all_timeslips').click(function(){
    jQuery("#timeslips_wrapper").modal("show");
    timeslipsTable.columns(0).visible(true);
    timeslipsTable.columns( 1 )
        .search( "" )
        .draw();
  });

  jQuery('#view_all_reports').click(function(){
    jQuery("#reports_wrapper").modal("show");
    reportsTable.columns(0).visible(true);
    reportsTable.columns( 1 )
        .search( "" )
        .draw();
  });


  jQuery('#add_timeslip_main').click(function(){
    timeslipEditor
      .buttons("create")
      .create()
      .set( 'ccrp_timeslips.staff_id', vars.current_user );
;
  });
    jQuery('#add_report_main').click(function(){
    reportEditor
      .buttons("create")
      .create()
      .set( 'ccrp_reports.staff_id', vars.current_user );
;
  });

  // Setup datatable columns for main task table:
  taskColumns = [
    { data: "id", title: "More Info", render: function(data,type,row,meta){
           return "<span class='fa fa-plus-circle commButton' id='taskInfo_" + data + "'></span>";
          }, "className":"trPlus"},

    {data: "ccrp_tasks.activities", title: "Activities", width: "20%"},
    {data: "ccrp_tasks.products",title:"Products", width: "20%"},
    {data: "primary_responsibility_name",title:"Responsibility"},
    {data: "wp_users", title:"Also involved", render: function(data,type,row,meta){
        return renderMultiCells(data,"secondary_responsibility_name");
        }// end function
          

        

      },
    {data: "ccrp_programarea", title:"Program Area(s)", render: function(data,type,row,meta){
          return renderMultiCells(data,"programarea");
        }// end function

      },
    {data: "ccrp_theme", title:"Theme(s)", render: function(data,type,row,meta){
        return renderMultiCells(data,"theme");
        }

      },
      {data: "ccrp_method", title:"Method / Activity Type(s)", render: function(data,type,row,meta){
        return renderMultiCells(data,"method_type");
        }

      },
    {data: "ccrp_tasks.date",title:"Date"},
    {data: "ccrp_tasks.2017_report",title:"2017 Report", visible: false},
    {data: "ccrp_tasks.2018_status",title:"2018 Status", visible: false},
    {data: "ccrp_tasks.2018_comment",title:"2018 Comment", visible: false},
  ];

  tasksTable = $('#ccrp_tasks_table').DataTable({
    dom: "Bfritp",
    ajax: vars.editorurl + "/ccrp_tasks.php",
    columns: taskColumns,
    select: true,
    buttons: [
    {
      extend: 'csv',
      text: "Download Tasks (csv)"
    },
    {
      extend: "edit",
      editor: taskEditor
    },
        {
      extend: "create",
      editor: taskEditor
    }
    ],
    pageLength: 150
  });

  tasksTable.on('init.dt',function(){
    console.log("full data", tasksTable.data());
  });


  //Setup task table filters
    yadcf.init(tasksTable, [
          {
            column_number: 3,
            filter_container_id: "resp_filter",
            filter_type:"multi_select",
            select_type:"select2",
            // html_data_type:"text",
            style_class:"ccrp_filter",
            select_type_options:{
              placeholder: "Select Program Area(s)",
              // allowClear : true // show 'x' next to selection inseide the select itself
              width:"80%"
            },
            reset_button_style_class:"ccrp_filter_reset",
            filter_default_label:"Select Person",
            reset_button_style_class:"btn btn-primary ml-3",
            filter_reset_button_text: "Reset" // hide yadcf reset button
          },
          //           {
          //   column_number: 5,
          //   filter_container_id: "programaea_filter",
          //   filter_type:"multi_select",
          //   select_type:"select2",
          //   // column_data_type:"html",
          //   // html_data_type:"text",
          //   select_type_options:{
          //     placeholder: "Select Program Area(s)",
          //     // allowClear : true // show 'x' next to selection inseide the select itself
          //     width:"80%"
          //   },
          //   filter_default_label:"Select Program Area",
          //   style_class:"col-sm-8",
          //   reset_button_style_class:"btn btn-primary ml-3",
          //   filter_reset_button_text: "Reset" // hide yadcf reset button
          // },
          //           {
          //   column_number: 6,
          //   filter_container_id: "theme_filter",
          //   filter_type:"multi_select",
          //   select_type:"select2",
          //   select_type_options:{
          //     placeholder: "Select Program Area(s)",
          //     // allowClear : true // show 'x' next to selection inseide the select itself
          //     width:"80%"
          //   },
          //   filter_default_label:"Select Theme",
          //   reset_button_style_class:"btn btn-primary ml-3",
          //   filter_reset_button_text: "Reset" // hide yadcf reset button
          // },
          //           {
          //   column_number: 7,
          //   filter_container_id: "method_filter",
          //   filter_type:"multi_select",
          //   select_type:"select2",
          //   select_type_options:{
          //     placeholder: "Select Program Area(s)",
          //     // allowClear : true // show 'x' next to selection inseide the select itself
          //     width:"80%"
          //   },
          //   filter_default_label:"Select Theme",
          //   reset_button_style_class:"btn btn-primary ml-3",
          //   filter_reset_button_text: "Reset" // hide yadcf reset button
          // },
          ],
          {
            // cumulative_filtering: true
          }
    );
  
  console.log("current user = ",vars.current_user);

  //setup child row for task table: 
  jQuery('#ccrp_tasks_table tbody').on('click', 'td.trPlus', function () {
            console.log("clicked");
            //get the row of the clicked icon
            var tr = jQuery(this).parents('tr');
            var row = tasksTable.row( tr );
            console.log(row);

            //check if child row is already shown.
            if ( row.child.isShown() ) {
                // This row is already open - close it
                console.log("isShown is true");
                row.child.hide();
                rowShown = -1;
                console.log(rowShown);
                
            }
            else {

                //first, close any other child rows:
                if ( rowShown > -1) {
                  tasksTable.row(rowShown).child.hide();
                };

                //if there is a child row, open it.
                if(row.child() && row.child().length)
                {
                    console.log("row exists, showing");
                    displayChildRow(row,null);
                }
                else {
                    //else, create the child row then show it.
                    taskChildRow(row.data(),row,displayChildRow);
                 }
                rowShown = row.index();
                console.log(rowShown);
            }
        } );

// jQuery("#testButton").click(function(){
//    jQuery.ajax({
//     method: "POST",
//       url: vars.editorurl + "/mcknight_freeAgent.php",
//       data: {
//         action:"test"
//       },
//       success: function(d){
//         console.log("freeAgentresponse =",d);
//         jQuery("#testBed").html(d);

//       }
//     });
//   });

}); //END DOCUMENT READY

//function to craete a child row for the task table:
//
function taskChildRow(data, row, callback) {
  console.log("taskChildRow function");
  console.log(data);

  timeslip_number = data.ccrp_timeslips.length;
  report_number = data.ccrp_reports.length;
  time = 0;
  for(x = 0;x<timeslip_number;x++){
    num_time = Number(data.ccrp_timeslips[x]["hours"]);
    time += num_time;
  }

  time = time / 7;
  time = time.toFixed(2)
  jQuery.ajax({
    url: vars.editorurl + "/taskchild.mst",
    success: function(d){
      console.log("got taskchild.html",d);
      console.log(data['ccrp_tasks']['2017_report']);
      var rendered = Mustache.render(d,{
        seven_report: data['ccrp_tasks']['2017_report'],
        eight_status: data['ccrp_tasks']['2018_status'],
        eight_comment: data['ccrp_tasks']['2018_comment'],
        row_id: data['DT_RowId'],
        task_name: data['ccrp_tasks']['activities'],
        number_timeslips: timeslip_number,
        total_time: time,
        number_reports: report_number
      });
      callback(row,rendered);

    }});
}

function displayChildRow(row,html){

  if(html){
      row.child(html).show();
  }

  else {
    row.child.show();
  }

  console.log("row = ",row.data());
  data = row.data();

  //filter hidden subtables:
  filterSubTables(data);

  //once it's shown, prepare buttons:
  //Edit Button
  jQuery("#ccrp_tasks_table").on('click', 'button.edit_row', function (e) {
    e.preventDefault();
    console.log("clicked edit");

    //trigger the editor manually, targeting the closest row in the table. 
    taskEditor.edit(jQuery(this).closest('tr').prev()[0], {
        title: 'Edit record',
        buttons: 'Update'
    });
  });

  //Add timeslip button
  jQuery("#ccrp_tasks_table").on("click","button.add_timeslip",function(e){
    e.preventDefault();
    console.log("clicked Add timeslip");

    timeslipEditor
            .title('Create new timeslip')
            .buttons('Create')
            .create()
            .set( 'ccrp_timeslips.task_id', data.ccrp_tasks.id )
            .set( 'ccrp_timeslips.staff_id', vars.current_user );
  });

  //View timeslips button
  jQuery("#ccrp_tasks_table").on("click","button.view_timeslips",function(e){
    e.preventDefault();
    jQuery("#timeslips_wrapper").modal("show");
  });

  //Add report button
  jQuery("#ccrp_tasks_table").on("click","button.add_report",function(e){
    e.preventDefault();
    console.log("clicked add report");

    reportEditor.title("Create new report")
    .buttons("create")
    .create()
    .set( 'ccrp_reports.task_id', data.ccrp_tasks.id )
    .set( 'ccrp_reports.staff_id', vars.current_user );
  });

  //View reports button
  jQuery("#ccrp_tasks_table").on("click","button.view_reports",function(e){
    e.preventDefault();
    console.log("clicked view reports");
    jQuery("#reports_wrapper").modal("show");
  });
  
}


function renderMultiCells(data,variableName){
        string = "";
        for(var i=0;i<data.length; i++){
          if(data[i][variableName].search("/") == -1) {
            string += "<span class='badge badge-info'>" + data[i][variableName] + "</span>";
          } //endif
          else {
            partstring = data[i][variableName].split("/");
            string += "<span class='badge badge-info'>";
            for(var j=0;j<partstring.length;j++){
              if(j!=0){
                string+="/<br/>";
              }
              string+= partstring[j];
            }
            string+= "</span>";
            
            } //endelse
           
          } //endfor
          return string;
}

function getFreeAgentData(){
  
}

function filterSubTables(data){
  console.log("filting to show tasks with ID = ",data.ccrp_tasks.id);
  timeslipsTable.columns(0).visible(false);
  timeslipsTable.columns( 1 ).visible(false)
        .search( data.ccrp_tasks.id )
        .draw();

  reportsTable.columns(0).visible(false);
  reportsTable.columns(1).visible(false)
    .search(data.ccrp_tasks.id)
    .draw();


}

function timeslipTable() {

    console.log("setting up timeslip table");

    

    //if initialised, destory secondary table
    if(secondaryInit == 1){
      secondaryTable.destroy();
      jQuery('#timeslips_table').empty();
    }

      timeslipColumns = [
      {data: "ccrp_tasks.activities", title: "Task", visible: false},
      {data: "ccrp_timeslips.task_id", title: "Task", visible: false},
      {data: "wp_users.display_name", title: "Staff"},
      {data: "ccrp_timeslips.date", title: "Date"},
      {data: "ccrp_timeslips.hours", title: "Hours"}
      ];

      timeslipsTable = jQuery('#timeslips_table').DataTable({
        dom: "Bfritp",
        ajax: vars.editorurl + "/ccrp_timeslips.php",
        columns: timeslipColumns,
        select: true,
        buttons: [
        {
          extend: 'csv',
          text: "Download Timeslips (csv)"
        },
        { extend: "create", editor: timeslipEditor },
        { extend: "edit",   editor: timeslipEditor },
        { extend: "remove", editor: timeslipEditor }
        ],
        pageLength: 150
      });

      secondaryInit = 1;
}

function reportsTable() {
    reportColumns = [
        {data: "ccrp_tasks.activities", title: "Task", visible: false},
        {data: "ccrp_reports.task_id", title: "Task", visible: false},
        {data: "wp_users.display_name", title: "Staff"},
        {data: "ccrp_reports_files.fileName", title: "File Name"},
        {data: "ccrp_reports_files.fileUrl", title: "File Url"},
        {data: "ccrp_reports.dropbox_url",title:"Dropbox File"}
      ];

      reportsTable = jQuery('#reports_table').DataTable({
        dom: "Bfritp",
        ajax: vars.editorurl + "/ccrp_reports.php",
        columns: reportColumns,
        select: true,
        buttons: [
        {
          extend: 'csv',
          text: "Download Reports Data (csv)"
        },
        { extend: "create", editor: timeslipEditor },
        { extend: "edit",   editor: timeslipEditor },
        { extend: "remove", editor: timeslipEditor }
        ],
        pageLength: 150
      });

    
}
