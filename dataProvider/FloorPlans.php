<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File: Encounter.php
 * Date: 1/21/12
 * Time: 3:26 PM
 */
if(!isset($_SESSION)) {
	session_name('GaiaEHR');
	session_start();
	session_cache_limiter('private');
}
include_once($_SESSION['site']['root'] . '/dataProvider/Patient.php');
include_once($_SESSION['site']['root'] . '/dataProvider/User.php');
include_once($_SESSION['site']['root'] . '/dataProvider/ACL.php');
include_once($_SESSION['site']['root'] . '/dataProvider/PoolArea.php');
include_once($_SESSION['site']['root'] . '/dataProvider/Services.php');
include_once($_SESSION['site']['root'] . '/classes/dbHelper.php');
include_once($_SESSION['site']['root'] . '/classes/Time.php');
class FloorPlans
{
	/**
	 * @var dbHelper
	 */
	private $db;
	/**
	 * @var User
	 */
	private $user;
	/**
	 * @var Patient
	 */
	private $patient;
	/**
	 * @var Services
	 */
	private $services;

	private $pool;

	function __construct()
	{
		$this->db       = new dbHelper();
		$this->user     = new User();
		$this->acl      = new ACL();
		$this->patient  = new Patient();
		$this->services = new Services();
		$this->pool     = new PoolArea();
		return;
	}


	public function getFloorPlans(){
		$this->db->setSQL("SELECT * FROM floor_plans");
		return $this->db->fetchRecords(PDO::FETCH_ASSOC);
	}

	public function createFloorPlan(stdClass $params){
		$data = get_object_vars($params);
		unset($data['id']);
		$this->db->setSQL($this->db->sqlBind($data, 'floor_plans', 'I'));
		$this->db->execLog();
		$params->id = $this->db->lastInsertId;
		return $params;
	}

	public function updateFloorPlan(stdClass $params){
		$data = get_object_vars($params);
		unset($data['id']);
		$this->db->setSQL($this->db->sqlBind($data, 'floor_plans', 'U', array('id'=>$params->id)));
		$this->db->execLog();
		return $params;
	}

	public function getFloorPlanZones(stdClass $params){
		return $this->getFloorPlanZonesByFloorPlanId($params->floor_plan_id);
	}

	public function createFloorPlanZone(stdClass $params){
		$data = get_object_vars($params);
		unset($data['id']);
		$this->db->setSQL($this->db->sqlBind($data, 'floor_plans_zones', 'I'));
		$this->db->execLog();
		$params->id = $this->db->lastInsertId;
		return $params;
	}

	public function updateFloorPlanZone(stdClass $params){
		$data = get_object_vars($params);
		unset($data['id']);
		$this->db->setSQL($this->db->sqlBind($data, 'floor_plans_zones', 'U', array('id'=>$params->id)));
		$this->db->execLog();
		return $params;
	}



	//******************************************************************************************************************
	//******************************************************************************************************************

	public function setPatientToZone($params){
		$params->uid = $_SESSION['user']['id'];
		$params->time_in = Time::getLocalTime();
		$data = get_object_vars($params);
		unset($data['id']);
		$this->db->setSQL($this->db->sqlBind($data, 'patient_zone', 'I'));
		$this->db->execLog();
		$params->patientZoneId = $this->db->lastInsertId;
		return array('success' => true, 'data' => $params);
	}

	public function unSetPatientZoneByPatientZoneId($PatientZoneId){
		$data['time_out'] = Time::getLocalTime();
		$this->db->setSQL($this->db->sqlBind($data, 'patient_zone', 'U', array('id' => $PatientZoneId)));
		$this->db->execLog();
	}

	public function unSetPatientFromZoneByPid($pid){

		return $params;

	}

	public function getPatientsZonesByFloorPlanId($FloorPlanId){
		$zones = array();
		$this->db->setSQL("SELECT pz.id AS patientZoneId,
								  pz.pid,
								  pz.uid,
								  pz.zone_id AS zoneId,
								  time_in AS zoneTimerIn,
								  fpz.floor_plan_id AS floorPlanId
							 FROM patient_zone AS pz
						LEFT JOIN floor_plans_zones AS fpz ON pz.zone_id = fpz.id
							WHERE fpz.floor_plan_id = $FloorPlanId AND pz.time_out IS NULL");
		foreach($this->db->fetchRecords(PDO::FETCH_ASSOC) as $zone){
			$zone['name'] = $this->patient->getPatientFullNameByPid($zone['pid']);
			$zone['photoSrc'] = $this->patient->getPatientPhotoSrcIdByPid($zone['pid']);

			$pool = $this->pool->getCurrentPatientPoolAreaByPid($zone['pid']);
			$zone['poolArea'] = $pool['poolArea'];
			$zone['priority'] = $pool['priority'];
			$zone['eid'] = $pool['eid'];
			$zones[] = $zone;
		}

		return $zones;
	}


	//******************************************************************************************************************
	// private functions
	//******************************************************************************************************************

	private function getFloorPlanZonesByFloorPlanId($floor_plan_id){
		$this->db->setSQL("SELECT * FROM floor_plans_zones WHERE floor_plan_id = '$floor_plan_id'");
		return $this->db->fetchRecords(PDO::FETCH_ASSOC);
	}

}
//$e = new FloorPlans();
//echo '<pre>';
//print_r($e->getPatientsZonesByFloorPlanId(1));
//print '<br><br>Session ----->>> <br><br>';
//print_r($_SESSION);
