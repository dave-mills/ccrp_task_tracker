
//Setup variables for scope reasons
var timeslipsTable;
var reportsTable;
var tasksTable;

var taskEditor;
var timeslipEditor;
var reportEditor;

var ccrp_tasks;

var secondaryInit = 0;
var rowShown = -1;

jQuery(document).ready(function($){
  
  console.log("loading ccrp task tracker code");
  console.log("test");

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
      type:"datetime",
      format:"YYYY-MM-DD",
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
    },
    {
      label: "Where?",
      type: "select",
      multiple: true,
      name: "ccrp_where[].id"
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
      type:"hidden",
      name:"ccrp_timeslips.url"
    },
    {
      label:"Chargeable?",
      labelInfo:"Should this time be charged to the project? (Default is yes)",
      type:"radio",
      options:[{
        label:"Yes",
        value:"1"
      },
      {
        label:"No",
        value:"0"
      }],
      name:"ccrp_timeslips.chargeable"
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
      // {
      //   label: "Title",
      //   type: "text",
      //   name: "ccrp_tasks.title"
      // },
      {
        label: "Activity Title",
        className: "editor_title",
        type: "text",
        name: "ccrp_tasks.activity"
      },
      {
        label: "Date / range given to task",
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
        label: "Where?",
        type: "select",
        multiple: true,
        name: "ccrp_where[].id"
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


  //add hook to send new timeslips directly to FreeAgent:
  //
  timeslipEditor.on('initSubmit',function(e,action){

    console.log()
    //When creating a new timeslip:
    if(action == "create") {
      console.log('event',e);
      // console.log('data',editor_data);
      console.log('action',action);

      var staff_id = timeslipEditor.field('ccrp_timeslips.staff_id').val();
      var date = timeslipEditor.field('ccrp_timeslips.date').val();
      var hours = timeslipEditor.field('ccrp_timeslips.hours').val();
      var comment = timeslipEditor.field('ccrp_timeslips.comment').val();
      var chargeable = timeslipEditor.field('ccrp_timeslips.chargeable').val();

      errorDiv = document.querySelector('#error-message');
      errorDiv.innerHTML = "";
      error = false;
      //check for empties:
      if(!date) {
        errorDiv.innerHTML += "<p class='alert alert-warning'>Please add a date.</p>"
        error = true;
      }

      if(!hours) {
        errorDiv.innerHTML += "<p class='alert alert-warning'>Please add the number of hours spent.</p>"
        error = true;
      }

      if(error){
        return false;
      }

      // timeslip = editor_data.data[0]['ccrp_timeslips'];
      // console.log("timeslip",timeslip);

      //submit a request to the users.php script.
      //POST the user_id, will return the whole row.
      jQuery.ajax({
        async: false,
        url: vars.editorurl + "/users.php",
        method: "POST",
        data: {
          "user_id": staff_id
        },
        success: function(d){
          
          console.log("d",d);
          d = JSON.parse(d);
          url = d.data[0]['url'];
          console.log("url",url);
          //construct the full url for the FreeAgent User. 
          url = "https://api.freeagent.com/v2/users/" + url;

          //setup the object to POST to the FreeAgent API.
          post_data = {
            "action":"add_timeslip",
            "user": url,
            "date": date,
            "hours": hours,
            "comment": comment,
            "chargeable":chargeable
          }

          jQuery.ajax({
            async: false,
            url: vars.editorurl + "/mcknight_freeAgent.php",
            method: "POST",
            data: post_data,
            success: function(d){
              console.log("succeeded at the post. Winning");
              console.log("response = ",d);
              d =JSON.parse(d);
              freeagent_url = d.timeslip.url;
              //editor_data.data[0].ccrp_timeslips.url = freeagent_url;
              
              timeslipEditor.field('ccrp_timeslips.url').val(freeagent_url);

              console.log("freeagent_url",freeagent_url)
              
            },
            error: function(d){
              console.log("ajax error sending data to FreeAgent");
              return false;
            }
          }) //end ajax to FreeAgent
        },
        error: function(d){
          console.log("ajax error retrieving data from users.php");
          return false;
        }
      }); //end ajax to users.php
    } // end CREATE function


    if(action == "edit"){
      console.log(timeslipEditor.field('ccrp_timeslips.url').val());


      var staff_id = timeslipEditor.field('ccrp_timeslips.staff_id').val();
      var date = timeslipEditor.field('ccrp_timeslips.date').val();
      var hours = timeslipEditor.field('ccrp_timeslips.hours').val();
      var comment = timeslipEditor.field('ccrp_timeslips.comment').val();
      var timeslip_url = timeslipEditor.field('ccrp_timeslips.url').val();
      var chargeable = timeslipEditor.field('ccrp_timeslips.chargeable').val();


      if(timeslip_url == "" || timeslip_url == null) {
      var post_action = "add_timeslip";
      console.log("should add not edit");
      
      } else {
        var post_action = "edit_timeslip";
        console.log("should edit not add");

      }

      //submit a request to the users.php script.
      //POST the user_id, will return the whole row.
      jQuery.ajax({
        async: false,
        url: vars.editorurl + "/users.php",
        method: "POST",
        data: {
          "user_id": staff_id
        },
        success: function(d){
          
          console.log("d",d);
          d = JSON.parse(d);
          url = d.data[0]['url'];
          console.log("url",url);
          //construct the full url for the FreeAgent User. 
          url = "https://api.freeagent.com/v2/users/" + url;

          //setup the object to POST to the FreeAgent API.
          post_data = {
            "action": post_action,
            "url": timeslip_url,
            "user": url,
            "date": date,
            "hours": hours,
            "comment": comment,
            "chargeable":chargeable

          }

          jQuery.ajax({
            async: false,
            url: vars.editorurl + "/mcknight_freeAgent.php",
            method: "POST",
            data: post_data,
            success: function(d){
              console.log("succeeded at the edit post. Winning");
              console.log("response = ",d);

              if(post_action == "add_timeslip"){
                d =JSON.parse(d);
                freeagent_url = d.timeslip.url;
                timeslipEditor.field('ccrp_timeslips.url').val(freeagent_url);

                console.log("freeagent_url",freeagent_url)
              }
            },
            error: function(d){
              console.log("ajax error sending data to FreeAgent");
              return false;
            }
          }) //end ajax to FreeAgent
        },
        error: function(d){
          console.log("ajax error retrieving data from users.php");
          return false;
        }
      }); //end ajax to users.php

    } //end edit aciton

    // if(action == "remove"){
    //   console.log("e",e);
    //   console.log("action",action)
    //   console.log("this",this);
    //   console.log(timeslipEditor.field('ccrp_timeslips.url').val());

    //   url = this.get('ccrp_timeslips.url');
    //   console.log("url",url);
    //   test = this.get('ccrp_timeslips.id');
    //   console.log("test",test);
    //   return false;
    // } //end delete action
  }) //end initSubmit

  // run a seperate "preSubmit" action, as deleting means I can't get at the data via the editor.field.val() method.
  timeslipEditor.on('preSubmit',function(e,d,action){

    if(action == "remove"){
      console.log('d',d);
      data = d.data;
      //find the data! (the key is the row_id; different every time); 
      
      for (var k in data) {
        if(typeof data[k] !== 'function'){
          console.log("key = ", k);
          row = data[k];
      
          //url is the FreeAgent URL stored when the record was first created.
          url = row.ccrp_timeslips.url;
          console.log('url',url);
          
          post_data = {
            "url": url,
            "action": "delete_timeslip"
          }

          jQuery.ajax({
            aysnc: false,
            method: "POST",
            url: vars.editorurl + "/mcknight_freeAgent.php",
            data: post_data,
            success: function(d){
              console.log("deleted",d);

            },
            error: function(d){
              console.log("error sending delete request");
              return false;
            }
          })
        }
      }
      //return false;
    } //return if remove;
  })

  taskEditor.on('postEdit',function(e,json,data){
    ccrp_tasks = tasksTable.data().toArray();
  })

  //setup hidden datatables:
  timeslipTable();
  reportsTable();

  //setup top buttons:
  jQuery('#view_all_timeslips').click(function(){
    jQuery("#timeslips_header").html("All Timeslips");
    jQuery("#timeslips_wrapper").modal("show");
    timeslipsTable.columns(0).visible(true);
    timeslipsTable.columns( 1 )
        .search( "" )
        .draw();
  });

  jQuery('#view_all_reports').click(function(){
    jQuery("#reports_header").html("All Reports");
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
  });
  
  jQuery('#add_report_main').click(function(){
    reportEditor
      .buttons("create")
      .create()
      .set( 'ccrp_reports.staff_id', vars.current_user );
  });

  // Setup datatable columns for main task table:
  taskColumns = [
    // { data: "id", title: "More Info", render: function(data,type,row,meta){
    //        return "<span class='fa fa-plus-circle commButton' id='taskInfo_" + data + "'></span>";
    //       }, "className":"trPlus"},
    // {data: "ccrp_tasks.title", title: "Task title", width: "10%"},
    {data: "ccrp_tasks.activity", title: "Activity / Task", width: "15%"},
    {data: "ccrp_tasks.primary_responsibility_name",title:"Responsibility"},
    {data: "wp_users", title:"Also involved", render: function(data,type,row,meta){
        return renderMultiCells(data,"secondary_responsibility_name");
        }// end function
      },
          {data: "ccrp_where", title:"Where", render: function(data,type,row,meta){
          return renderMultiCells(data,"name");
        }// end function
      },
    {data: "ccrp_programarea", title:"Program Area(s)", render: function(data,type,row,meta){
          return renderMultiCells(data,"programarea");
        }// end function
        ,visible: false
      },
    {data: "ccrp_theme", title:"Theme(s)", render: function(data,type,row,meta){
        return renderMultiCells(data,"theme");
        }
        ,visible: false
      },
      {data: "ccrp_method", title:"Method / Activity Type(s)", render: function(data,type,row,meta){
        return renderMultiCells(data,"method_type");
        }
        ,visible: false
      },
    // {data: "ccrp_tasks.date",title:"Date"},
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
    ccrp_tasks = tasksTable.data().toArray();
  });


  tasksTable.on('select',function(e,dt,type,indexes){
    if(type === 'row'){
      //get the template:
      
      var template = jQuery('#task_details_pane_template').html();
      data = tasksTable.rows(indexes).data();
      //add the index into the data for rendering(for edit / add buttons)
      console.log(data[0])
      var html = Mustache.render(template,data[0]);
      jQuery('#task_details_pane').html(html);
    }
  })

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
    }
    ]
  );
  
  console.log("current user = ",vars.current_user);

  // });

  jQuery("#testButton").click(function(){
     jQuery.ajax({
      method: "POST",
        url: vars.editorurl + "/mcknight_freeAgent.php",
        data: {
          action:"test"
        },
        success: function(d){
          console.log("freeAgentresponse =",d);
          jQuery("#testBed").html(d);

        }
      });
    });

}); //END DOCUMENT READY



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


function filterSubTables(task_id){
  var task_name;
  //Get the task name:
  console.log("ccrp tasks",ccrp_tasks)

  ccrp_tasks.some(function(item,index){
    if(item.ccrp_tasks.id === task_id){
      task_name = item.ccrp_tasks.activity;
      return true;
    }
    return false;
  })



  console.log("filting to show tasks with ID = ",task_id);
  timeslipsTable.columns(0).visible(false);
  timeslipsTable.columns( 1 ).visible(true)
        .search( "^"+task_id+"$",true,false )
        .draw();

  reportsTable.columns(0).visible(false);
  reportsTable.columns(1).visible(true)
    .search( "^"+task_id+"$",true,false )
    .draw();

  jQuery('#timeslips_header').html("Timeslips for Task: "+task_name)
  jQuery('#reports_header').html("Reports for Task: "+task_name)

}

function timeslipTable() {

    console.log("setting up timeslip table");

    

    //if initialised, destory secondary table
    if(secondaryInit == 1){
      secondaryTable.destroy();
      jQuery('#timeslips_table').empty();
    }

      timeslipColumns = [
      {data: "ccrp_tasks.activity", title: "Task", visible:false},
      {data: "ccrp_timeslips.task_id", title: "Task", visible:true},
      {data: "wp_users.display_name", title: "Staff"},
      {data: "ccrp_timeslips.date", title: "Date"},
      {data: "ccrp_timeslips.hours", title: "Hours"},
      {data: "ccrp_timeslips.comment", title: "Comment"},
      {data: "ccrp_timeslips.url",title:"FreeAgent URL",visible:false},
      {data: "ccrp_timeslips.chargeable",title:"Chargeable?",visible:true},
      {data: null, className:"center",defaultContent:"<a href='' class='editor_edit'>Edit</a>"}
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

      jQuery('#timeslips_table').on('click','a.editor_edit',function(e){
        e.preventDefault();

        timeslipEditor.edit(jQuery(this).closest('tr'),{
          title: 'Edit Timeslip',
          buttons: "Update"
        })
      })

      secondaryInit = 1;
}

function reportsTable() {
    reportColumns = [
        {data: "ccrp_tasks.activity", title: "Task", visible: false},
        {data: "ccrp_reports.task_id", title: "Task", visible: true},
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
        { extend: "create", editor: reportEditor },
        { extend: "edit",   editor: reportEditor },
        { extend: "remove", editor: reportEditor }
        ],
        pageLength: 150
      });

    
}

/// Functions for the Task Details bottom panel;

function edit_task(index){
    console.log("clicked edit");
    console.log("index: ",index);
    //trigger the editor manually, targeting the closest row in the table. 
    taskEditor.edit("#ccrp_tasks_table tbody tr#"+index, {
        title: 'Edit Task',
        buttons: 'Update'
    });
}


function view_timeslips(task_id){
    
    filterSubTables(task_id);
    jQuery("#timeslips_wrapper").modal("show");

}

function view_reports(task_id){

    filterSubTables(task_id);
    jQuery("#reports_wrapper").modal("show");

}

function add_timeslip(task_id){
  
  //get tags for current task_id
  var method = [];
  var where = [];
  var theme = [];
  var programarea = [];

  item = task = get_task_by_id(task_id);

  //go through method array and trawl for ids:
  item.ccrp_method.forEach(function(item,index){
    method.push(item.id);
  })

  item.ccrp_programarea.forEach(function(item,index){
    programarea.push(item.id);
  })

  item.ccrp_theme.forEach(function(item,index){
    theme.push(item.id);
  })

  item.ccrp_where.forEach(function(item,index){
    where.push(item.id);
  })

  timeslipEditor
    .title("Add New Timeslips record for task:" + item.ccrp_tasks.activity)
    .buttons("Save")
    .create()
    .set("ccrp_timeslips.task_id",task_id)
    .set("ccrp_timeslips.staff_id",vars.current_user)
    .set("ccrp_timeslips.chargeable",1)
    .set("ccrp_where[].id",where)
    .set("ccrp_method[].id",method)
    .set("ccrp_programarea[].id",programarea)
    .set("ccrp_theme[].id",theme)
    

}

function test_timeslip(){
  
  checkVals = {
    "task": timeslipEditor.get("ccrp_timeslips.task_id"),
    "comment": timeslipEditor.get("ccrp_timeslips.comment"),
    "hours": timeslipEditor.get("ccrp_timeslips.hours"),
    "date": timeslipEditor.get("ccrp_timeslips.date"),
    "staff_id": timeslipEditor.get("ccrp_timeslips.staff_id"),
    "where": timeslipEditor.get("ccrp_where[].id"),
    "programarea": timeslipEditor.get("ccrp_programarea[].id"),
    "theme": timeslipEditor.get("ccrp_theme[].id"),
    "method": timeslipEditor.get("ccrp_method[].id")
  }

  console.log(checkVals)
}

function add_report(task_id){

  task = get_task_by_id(task_id);

  reportEditor
  .title("Add New Record for task - " + task.ccrp_tasks.activity)
  .buttons("Save")
  .create()
  .set("ccrp_reports.task_id", task_id)
  .set("ccrp_reports.staff_id",vars.current_user);
}


function get_task_by_id(id){
  var task; 

  ccrp_tasks.some(function(item,index){
    if(item.ccrp_tasks.id == id){
      task = item;
      return true;
    }
    return false;
  })

  return task;
}

function add_generic_timeslip(){
  timeslipEditor
  .title("Add New Timeslip not related to any project")
  .buttons("Save")
  .create()
  .set("ccrp_timeslips.task_id",35)
  .set("ccrp_timeslips.staff_id",vars.current_user);
}