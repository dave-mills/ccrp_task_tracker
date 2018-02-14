<?php
// NOTE - work in progress, this is not currently in use. 
//

// first, run the API call to Freeagent to pull: 

//setup guzzle 	
require_once 'vendor/autoload.php';
use GuzzleHttp\Client;

//get access token
$config = parse_ini_file("/opt/freeagent_conini.php");
$access_token = $config['access'];

//initialise client
$client = new Client([
	'base_uri' => "https://api.freeagent.com/v2/",
	'headers' => array(
		"Authorization" => "Bearer " . $access_token,
		"Accept" => "application/json",
		"Content-Type" => "application/json"
		)
	]);

// get projects 
$projectResponse = $client->request("GET", "projects?per_page=100&view=active");

$projects = json_decode($projectResponse->getBody(true));

//get contacts
$contactResponse = $client->request("GET", "contacts?per_page=100&view=active");

$contacts = json_decode($contactResponse->getBody(true));

//tasks
$taskResponse = $client->request("GET","tasks?page=1&per_page=100");
$tasks = array();

$tasks[] = json_decode($taskResponse->getBody(true));

//check to see if there is another page of tasks. If there is, continue to pull more responses until we get to the last page. 

echo "<pre>" . var_export($taskResponse,true) . "</pre>";

if($taskResponse->getHeader("Link")) {
	$links = $taskResponse->getHeader("Link");
	
	$taskpage = 1;
	$notLast = strpos($links[0],'last');
	//if the returned page is NOT the last page, there will be a "last" item within the "Links" header. So, while this "last" item exists, keep getting new pages...
	while($notLast !==false) {
		$taskpage++;
		$taskResponseNext = $client->request("Get","tasks?page=" . $taskpage . "&per_page=100");
		$tasks[] = json_decode($taskResponseNext->getBody(true));
		$links = $taskResponseNext->getHeader("Link");
		$notLast = strpos($links[0], 'last');
	}	

}

echo "taskarray<pre>" . var_export($tasks, true) . "</pre>";


// tasks are over the 100 limit, so need to figure out how to parse through multiple pages of responses. 
highlight_string("<?php\n\$data =\n" . var_export($projects, true) . ";\n?>");
highlight_string("<?php\n\$data =\n" . var_export($contacts, true) . ";\n?>");
highlight_string("<?php\n\$data =\n" . var_export($tasks, true) . ";\n?>");

//then, save all 3 arrays to the database: 

//setup connection to database

$dbconfig = parse_ini_file("/var/opt/wordpressdev_conini.php");

$conn = new mysqli("localhost",$dbconfig['user'],$dbconfig['password'],"wordpress_dev");

if(mysqli_connect_errno()) {
	die("connection to database failed: " . $conn->connect_error);
}

// for projects, we should insert (url, name, client_url)

// so, freeAgent returns some nested stuff, so first dive in and grab the "projects" object from the returned body: 

$projects = $projects->projects;

foreach($projects as $project) {
	$url_p = $conn->real_escape_string($project->url);
	$name_p = $conn->real_escape_string($project->name);
	$contact_p = $conn->real_escape_string($project->contact);

	$fields_p = "`url` = '" . $url_p . "', `name` = '" . $name_p . "', `contact_url` = '" . $contact_p . "'";

	$sql_p = "INSERT INTO `stats4sd_projects` SET " . $fields_p . " ON DUPLICATE KEY UPDATE " . $fields_p . ";";

	if($conn->query($sql_p)) {
		echo "<h1>posted projects</h1>";
	}
	else{
		die("There was an error inserting records into the stats4sd_projects table." . $conn->error);
	}
}

//Again, go 1 level down to get to the actual data in the object that FreeAgent sends. 
$contacts = $contacts->contacts; 

foreach($contacts as $contact) {
	var_dump($contact);
	//get variables (and escape them to make sure we're not putting malicious code into the database)
	$url_c = $conn->real_escape_string($contact->url);
	$name_c = $conn->real_escape_string($contact->organisation_name);
	
	//prepare string for insert statement
	$fields_c = "`url` = '" . $url_c . "', `name` = '" . $name_c . "'";


	//prepare SQL statement -> added "ON DUPLICATE KEY UPDATE" so we can update existing records with new information (and so the query doesn't break by declaring some primary keys already exist!)
	$sql_c = "INSERT INTO `stats4sd_contacts` SET " . $fields_c . " ON DUPLICATE KEY UPDATE " . $fields_c . ";";
 
	//run query. if success... 
	if($conn->query($sql_c)) {
		//declare success
		echo "<h1>posted contacts</h1>";
	}
	else{
		//otherwise - output error and stop. 
		die("There was an error inserting records into the stats4sd_contacts table." . $conn->error);
	}
}

//We have multiple pages of tasks, which have all gone into an array. So, cycle through the top of the array, then cycle through the individual tasks per page: 
	echo "<h1>TASK VIEW</h1><pre>" . var_export($tasks,true) . "</pre>";

foreach($tasks as $taskpage) {
	echo "<h1>TASK VIEW</h1><pre>" . var_export($taskpage, true) . "</pre>";
	$t = $taskpage->tasks; 
	echo "<h1>COUNTING</h1>" . count($t);
	//for tasks, we should insert (url, name, project_url)

	foreach($t as $task) {
	//echo "<h3>TASK INTERNAL</h3><pre>" . var_export($task,true) . "</pre>";
		$url_t = $conn->real_escape_string($task->url);
		$name_t = $conn->real_escape_string($task->name);
		$project_t = $conn->real_escape_string($task->project);

		$fields_t = "`url` = '" . $url_t . "', `name` = '" . $name_t . "', `project_url` = '" . $project_t . "'";

		$sql_t = "INSERT INTO `stats4sd_tasks` SET " . $fields_t . " ON DUPLICATE KEY UPDATE " . $fields_t . ";";

		if($conn->query($sql_t)) {
			echo "<h1>posted tasks</h1>";
		}
		else{
			echo "<pre>" . $conn->error . "</pre>"; 
		}
	}
}




$conn->close();

