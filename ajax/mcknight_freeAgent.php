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

  if($action == "get_task");


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
  } //end test action

  if($action == "add_timeslip") {

    $user = $_POST['user']; 
    $project = "https://api.freeagent.com/v2/projects/1275080";

    if($_POST['chargeable']=="1") {
      $task = "https://api.freeagent.com/v2/tasks/1997008";
    } else {
      $task = "https://api.freeagent.com/v2/tasks/2039466";
    }

    $dated_on = $_POST['date'];
    $hours = $_POST['hours'];
    $comment = $_POST['comment'];

    $timeslip = [
      "timeslip" => [
        "project" => $project,
        "task" => $task,
        "dated_on" => $dated_on,
        "hours" => $hours,
        "user" => $user,
        "comment" => $comment
      ]

    ];

    try {
      $response = $client->request(
        "POST",
        "https://api.freeagent.com/v2/timeslips",
        ['form_params'=>$timeslip]
      );

      $body = $response->getBody();
      echo $body;
      die();
     } catch (RequestException $e) {
      echo Psr7\str($e->getRequest());
      if($e->hasResponse()){
        echo Psr7\str($e->getResponse());
      }
      die();
    } // end catch

    // echo var_dump($response);
    // die();
  } // end add_timeslip action

  // if($action == "get_timeslip") {
  //   $response = $client->request(
  //     "GET",
  //     "https://api.freeagent.com/v2/timeslips/21245283"
  //   );
  //   $body = $response->getBody();
  //   echo $body;
  //   die();
  // } //end "get timeslip action"

  if($action == "edit_timeslip") {

    $timeslip_url = $_POST['url'];
    $user = $_POST['user'];
    $project = "https://api.freeagent.com/v2/projects/1275080";

    // Chceck "chargeable" to see which task to add it to.
    if($_POST['chargeable']=="1") {
      $task = "https://api.freeagent.com/v2/tasks/1997008";
    } else {
      $task = "https://api.freeagent.com/v2/tasks/2039466";
    }

    $dated_on = $_POST['date'];
    $hours = $_POST['hours'];
    $comment = $_POST['comment'];

    $timeslip = [
      "timeslip" => [
        "project" => $project,
        "task" => $task,
        "dated_on" => $dated_on,
        "hours" => $hours,
        "user" => $user,
        "comment" => $comment
      ]
    ];

    try {
      $response = $client->request(
      "PUT",
      $timeslip_url,
      ['form_params'=>$timeslip]
    );

    $body = $response->getBody();
    echo $body;
    die();

    } catch (RequestException $e) {
      echo Psr7\str($e->getRequest());
      if($e->hasResponse()){
        echo Psr7\str($e->getResponse());
      }
      die();
    } //end catch
    
  } //end edit_timeslip;

  if($action == "delete_timeslip") {
    
    $timeslip_url = $_POST['url'];

    try {
      $response = $client->request(
        "DELETE",
        $timeslip_url
      );

    $body = $response->getBody();
    echo $body;
    die();
    } catch (RequestException $e) {
      echo Psr7\str($e->getRequest());
      if($e->hasResponse()){
        echo Psr7\str($e->getResponse());
      }
      die();
    } //end catch
  } //end delete timeslip


