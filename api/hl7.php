<?php
/**
 * GaiaEHR (Electronic Health Records)
 * Copyright (C) 2013 Certun, inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */



include_once('../lib/HL7/HL7.php');
include_once('../classes/MatchaHelper.php');
new MatchaHelper();
$hl7 = new HL7();
$m = MatchaModel::setSenchaModel('App.model.administration.HL7Messages');
$r = MatchaModel::setSenchaModel('App.model.administration.HL7Recipients');

//OBX|2|NM|JTRIG^Triglyceride (CAD)|1|72|CD:289^mg/dL|35-150^35^150|""||""|F|||20080511103500|||^^^""|
//OBX|3|NM|JVLDL^VLDL-C (calc - CAD)|1|14|CD:289^mg/dL||""||""|F|||20080511103500|||^^^""|
//OBX|4|NM|JLDL^LDL-C (calc - CAD)|1|134|CD:289^mg/dL|0-100^0^100|H||""|F|||20080511103500|||^^^""|
//OBX|5|NM|JCHO^Cholesterol (CAD)|1|210|CD:289^mg/dL|90-200^90^200|H||""|F|||20080511103500|||^^^""|


//OBR|1||185L29839X64489JLPF~X64489^ACC_NUM|JLPF^Lipid Panel - C||||||||||||1694^DOCLAST^DOCFIRST^^MD||||||20080511103529|||
//OBX|1|NM|JHDL^HDL Cholesterol (CAD)|1|62|CD:289^mg/dL|>40^>40|""||""|F|||20080511103500|||^^^""|

$msg = <<<EOF
MSH|^~\&|EHR Application^2.16.840.1.113883.3.72.7.1^HL7|EHR Facility^2.16.840.1.113883.3.72.7.2^HL7|PH Application^2.16.840.1.113883.3.72.7.3^HL7|PH Facility^2.16.840.1.113883.3.72.7.4^HL7|20110316102013||ORU^R01^ORU_R01|NIST-110316102013209|P|2.5.1|||||||||PHLabReport-Ack^^2.16.840.1.114222.4.10.3^ISO
PID|||9817566735^^^MPI&2.16.840.1.113883.19.3.2.1&ISO^MR||Johnson^Philip||20070526|M||2106-3^White^HL70005|3345 Elm Street^^Aurora^Colorado^80011^USA^M||^PRN^^^^303^5548889|||||||||N^Not Hispanic or Latino^HL70189
OBR|1||9700123^Lab^2.16.840.1.113883.19.3.1.6^ISO|10368-9^Lead BldC-mCnc^LN^3456543^Blood lead test^99USI|||200808151030-0700||||||Diarrhea|||1234^Admit^Alan^^^^^^ABC Medical Center&2.16.840.1.113883.19.4.6&ISO||||||200808181800-0700|||F||||||787.91^DIARRHEA^I9CDX
OBX|1|NM|10368-9^Lead BldC-mCnc^LN|1|50|ug/dL^micro-gram per deci-liter^UCUM|<9 mcg/dL:  Acceptable background lead exposure|H|||F|||200808151030-0700|||||200808181800-0700||||Lab^L^^^^CLIA&2.16.840.1.113883.19.4.6&ISO^XX^^^1236|3434 Industrial Lane^^Ann Arbor^MI^48103^^B
EOF;
print '<pre>';

print_r($msg.PHP_EOL);
$hl7->readMessage($msg);
$pid = $hl7->getSegment('PID');

//print_r($pid[3][4][1]);

//print_r($pid);
print_r($hl7->segments);



