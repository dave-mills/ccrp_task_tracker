var taskEditor;


jQuery(document).ready(function($){
    console.log("loading ccrp task tracker code");

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
  
  taskEditor.on('open displayOrder',function(e,mode,action){
    console.log("editor init complete");
    $('#task_editor select')
      .select2({
        width: "90%"
      });
  })
  // initialise select2 plugin
 
  
  

  // Setup datatable columns for main task table:
  
  taskColumns = [
    // {data: "id", title: "Show more details", render: function(data, type, row, meta){
    //   return "<a href='"+data.url+"' target='_blank'>"+data.title+"</a>";
    //   }, 
    //   width: "20%" 
    // },
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
    {data: "ccrp_tasks.2017_report",title:"2017 Report"},
    {data: "ccrp_tasks.2018_status",title:"2018 Status"},
    {data: "ccrp_tasks.2018_comment",title:"2018 Comment"},
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
  
});