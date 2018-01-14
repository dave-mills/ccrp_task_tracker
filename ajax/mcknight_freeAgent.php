<?php 

  //load dependancies
  require_once 'vendor/autoload.php';
  use GuzzleHttp\Client;


  //figure out what to do based on data received:
  //
  $action = $_POST['action'];

  //get access token for FreeAgent 
  $config = parse_ini_file("/opt/freeagent_conini.php");
  $access_token = $config['access'];

  //setup new client to send requests to FreeAgent dev app:
  $client = new Client([
    'base_uri' => "https://api.freeagent.com/v2/",
    'headers' => array(
    "Authorization" => "Bearer " . $access_token,
    "Accept" => "application/json",
    "Content-Type" => "application/json"
    )
  ]);


  //if action is "test"

  if($action == "test"){
    $response = $client->request("GET","https://api.freeagent.com/v2/users");
    $main = json_decode($response->getBody(true));
    $info = array();
    //for each task, extract just the name and url:
    for($x = 0; $x<sizeof($main->users);$x++){
      $info[$x]['name'] = $main->users[$x]->first_name;
      $info[$x]['url'] = $main->users[$x]->url;
    }
  
  $return = "<pre>" . var_export($info, true) . "</pre>";
  echo $return;
  }

  // /////
  if($action == "add_timeslip") {

    $user = $_POST['user']; 
    $project = "https://api.freeagent.com/v2/projects/1275080";
    $task = "https://api.freeagent.com/v2/tasks/1997008";
    $dated_on = $_POST['date'];
    $hours = $_POST['hours'];

    $timeslip = [
      "project" => $project,
      "task" => $task,
      "dated_on" => $dated_on,
      "hours" => $hours,
      "user" => $user
    ];
    }

// $r = $client->request('POST', 'http://httpbin.org/post', ['body' => $timeslip]);

//   url   The unique identifier for the timeslip  URI
// ✔   task  Task that was completed   URI
// ✔   user  User that completed the task  URI
// ✔   project   Project for which the task was completed  URI
// ✔   dated_on  Date of the timeslip, in YYYY-MM-DD format  Date
// ✔   hours   

// Number of hours worked
// For e.g. 1:30 hours, use 1.5  Decimal
//   comment   Free-text comment
//   ?>

