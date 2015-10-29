-- Set all the variables
-- SET @Provider = 6;
SET @Provider = null;
-- SET @StartDate = '2015-01-01';
-- SET @EndDate = '2015-12-31';
-- SET @ProblemCode = '195967001';
SET @ProblemCode = null;

-- Display all the patient fields
SELECT patient.* 
FROM patient

-- Join the Active Problems
LEFT JOIN (
SELECT distinct(pid) AS pid, code
	FROM patient_active_problems
	LIMIT 1
) patient_active_problems ON patient.pid = patient_active_problems.pid

-- Join the Encounters
LEFT JOIN (
SELECT distinct(pid) AS pid, provider_uid
	FROM encounters
) encounters ON patient.pid = encounters.pid


-- Filter by Patient Active Problems
WHERE CASE 
	WHEN @ProblemCode IS NOT NULL 
	THEN patient_active_problems.code = @ProblemCode 
	ELSE 1=1 
END

-- Filter by Provider
AND CASE 
	WHEN @Provider IS NOT NULL 
	THEN encounters.provider_uid = @Provider 
	ELSE 1=1 
END