
<?php

// before doing anything, ask the question - is this called from the command line with the correct parameter?

if(!defined("STDIN")) {
  die("Are you loading this page from a web browser or http request? That doesn't work");
}

//   //check that the correct argument was passed
// if($argv[1] != "ajothwudjfogheohfheuejaowi29eit02") {

//   die("incorrect parameter passed. Exiting");

// }

// include dependancies
include __DIR__.'/vendor/autoload.php';
use GuzzleHttp\Client;

//create Client to make API request
$http = new Client([
  'base_uri' => "https://api.freeagent.com/v2/",
  'exceptions' => false,
  'headers' => array(
    "Accept" => "application/json",
    "Content-Type" => "application/json"
      )
  ]);

//Setup config details from exsiting ini file
$config = parse_ini_file("/opt/freeagent_conini.php");

//get refresh and access tokens
$refresh = $config['refresh'];
$access = $config['access'];

//get client_id and secret.
$id = $config['id'];
$s = $config['s'];

//set a random 'state' - something about security.
$state = md5(uniqid(mt_rand(),true));

//Prepare and send the request using the $http client.

$request = $http->post('token_endpoint', [
  'json' => [
    'client_id' => $id, 
    'client_secret' => $s,
    'grant_type' => 'refresh_token',
    'refresh_token' => $refresh,
    'access_type' => 'offline',
    'state' => $state
    ]
  ]);

//get the response from the $request object - run through json_decode to unpack it.
$responsebody = json_decode($request->getBody(true));


//create array to rebuild the ini file with new data
$ini = array();

//populate the fields we know without the response body.
$ini['id'] = $id;
$ini['s'] = $s;
$ini['refresh'] = $refresh;


//check that the response body contains an access_token.
if($responsebody->access_token) {
  //put the new access_token into the ini array:
  $ini['access'] = $responsebody->access_token;
}
else {
  //send error. Probably because FreeAgent didn't respond, or we sent the request to the wrong place. 
  die("error, no access token returned");
}

//update ini file with the function below:
put_ini_file("/opt/freeagent_conini.php",$ini);


//function to update ini file - taken from http://php.net/manual/en/function.parse-ini-file.php comments.
function put_ini_file($file,$array,$i=0){

  //create empty output to populate with main body of ini file.
  $str="";

  //for each item in the "ini" array, run through it and output it in a specific format.
  foreach($array as $k => $v) {

    if(is_array($v)){
      $str.=str_repeat(" ",$i*2)."[$k]\r\n";
      $str.=put_ini_file("",$v,$i+1);
    }

    else{
      $str .= str_repeat(" ",$i*2) . "$k = $v\r\n";
    }
  }

  //Add the initial "die()" command to the top of the ini file (as it's saved as a php file for safe-keeping).
  $phpstr = "<?php\r\n;\r\n;die();\r\n;/*\r\n" . $str . ";*/\r\n?>";

  if($file) {
    return file_put_contents($file,$phpstr);
  }
  else {
    return $str;
  }

}

?>
