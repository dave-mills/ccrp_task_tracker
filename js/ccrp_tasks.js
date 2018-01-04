var taskEditor;
var timeslipEditor;
var reportEditor;

jQuery(document).ready(function($){
  
  console.log("loading ccrp task tracker code");

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
        label: "Products (leave blank if none)",
        type: "textarea",
        labelInfo: "e.g. App templates, sharable resources, tangible products that can be referenced",
        name: "ccrp_tasks.products"
      },
      {
        label: "Date given to task",
        name: "ccrp_tasks.date"
      },
      {
        label: "Responsibility",
        labelInfo: "Person responsible for task",
        type: "select",
        name: "ccrp_tasks.responsibility"
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
        width: "90%"
      });
  })
 
  
  

  // Setup datatable columns for main task table:
  taskColumns = [
    { data: "id", title: "More Info", render: function(data,type,row,meta){
           return "<span class='fa fa-plus-circle commButton' id='taskInfo_" + data + "'></span>";
          }, "className":"trPlus"},
    {data: "ccrp_tasks.activities", title: "Activities"},
    {data: "ccrp_tasks.products",title:"Products"},
    {data: "primary_responsibility_name",title:"Responsibility"},
    {data: "wp_users", title:"Also involved", render: function(data,type,row,meta){
        string = "";
        for(var i=0;i<data.length; i++){
          string += "<span class='badge badge-info'>" + data[i].secondary_responsibility_name + "</span>  ";
                      }
        return string;
        }

      },
    {data: "ccrp_programarea", title:"Program Area(s)", render: function(data,type,row,meta){
        string = "";
        for(var i=0;i<data.length; i++){
          string += "<span class='badge badge-info'>" + data[i].programarea + "</span>  ";
                      }
        return string;
        }

      },
    {data: "ccrp_theme", title:"Theme(s)", render: function(data,type,row,meta){
        string = "";
        for(var i=0;i<data.length; i++){
          string += "<span class='badge badge-info'>" + data[i].theme + "</span>  ";
                      }
        return string;
        }

      },
      {data: "ccrp_method", title:"Method / Activity Type(s)", render: function(data,type,row,meta){
        string = "";
        for(var i=0;i<data.length; i++){
          string += "<span class='badge badge-info'>" + data[i].method_type + "</span>  ";
                      }
        return string;
        }

      },
    {data: "ccrp_tasks.date",title:"Date"},
    {data: "ccrp_tasks.2017_report",title:"2017 Report", visible: false},
    {data: "ccrp_tasks.2018_status",title:"2018 Status", visible: false},
    {data: "ccrp_tasks.2018_comment",title:"2018 Comment", visible: false},
  ];

  var tasksTable = $('#ccrp_tasks_table').DataTable({
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
    }
    ],
    pageLength: 50
  });


  //Setup task table filters
    yadcf.init(tasksTable, [
          {
            column_number: 2,
            filter_container_id: "resp_filter",
            filter_type:"multi_select",
            select_type:"select2",
            select_type_options:{
                        placeholder: "Select person",
                        allowClear : true // show 'x' next to selection inseide the select itself
                        },
            filter_default_label:"Select Person",
            filter_reset_button_text: false // hide yadcf reset button
          },
                    {
            column_number: 4,
            filter_container_id: "programaea_filter",
            filter_type:"multi_select",
            select_type:"select2",
            select_type_options:{
                        placeholder: "Select Program Area",
                        allowClear : true // show 'x' next to selection inseide the select itself
                        },
            filter_default_label:"Select Program Area",
            filter_reset_button_text: false // hide yadcf reset button
          },
                    {
            column_number: 5,
            filter_container_id: "theme_filter",
            filter_type:"multi_select",
            select_type:"select2",
            select_type_options:{
                        placeholder: "Select Theme",
                        allowClear : true // show 'x' next to selection inseide the select itself
                        },
            filter_default_label:"Select Theme",
            filter_reset_button_text: false // hide yadcf reset button
          },
                    {
            column_number: 6,
            filter_container_id: "method_filter",
            filter_type:"multi_select",
            select_type:"select2",
            select_type_options:{
                        placeholder: "select Theme",
                        allowClear : true // show 'x' next to selection inseide the select itself
                        },
            filter_default_label:"Select Theme",
            filter_reset_button_text: false // hide yadcf reset button
          }

          ]);
  console.log("current user = ",vars.current_user);

  // timeslipEdtior = new $.fn.dataTable.Editor({
  //   ajax: vars.editorurl + "/ccrp_timeslips.php",
  //   // table: "#ccrp_timeslips_table",
  //   // template: "#timeslips_editor",
  //   fields: [
  //     {
  //       label: "Task"
  //       name: "ccrp_tasks.activities"

  // })

  //setup child row for task table: 
  //
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
                tr.removeClass('shown');
            }
            else {
                //if there is a child row, open it.
                if(row.child() && row.child().length)
                {
                    console.log("row exists, showing")
                    row.child.show();
                }
                else {
                    //else, create the child row then show it.
                    console.log("row doesn't exist, creating");
                    taskChildRow(row.data(),row,displayChildRow);
                }
                tr.addClass('shown');
            }
        } );

});

//function to craete a child row for the task table:
//
function taskChildRow(data, row, callback) {
  console.log("taskChildRow function");
  console.log(data);
  $.ajax({
    url: vars.editorurl + "/taskchild.mst",
    success: function(d){
      console.log("got taskchild.html",d);
      console.log(data['ccrp_tasks']['2017_report']);
      var rendered = Mustache.render(d,{
        seven_report: data['ccrp_tasks']['2017_report'],
        eight_status: data['ccrp_tasks']['2018_status'],
        eight_comment: data['ccrp_tasks']['2018_comment']
      });
      callback(row,rendered);

    }});
}

function displayChildRow(row,html){
  row.child(html).show();
}