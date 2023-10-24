var gcode = "";
var copyButton = document.getElementById("Copy")
const copyToClipboard = str => {
  if (navigator && navigator.clipboard && navigator.clipboard.writeText)
    return navigator.clipboard.writeText(str);
  return Promise.reject('The Clipboard API is not available.');
};

function generateGCODE() {
  var gcode = "";
  ///////////////////////////////////// RETRIEVE ALL INPUTS ////////////////////////////////////////////////////
  // machine settings
  var units = document.getElementById("units").checked;
  var xAxisSize = parseInt(document.getElementById('x-axis').value);
  var yAxisSize = parseInt(document.getElementById('y-axis').value);
  var nozzleSizeSelect = parseFloat(document.getElementById('nozzle-size').value);
  var layerHeightSelect = document.getElementById('layer-height').value;
  var layerHeight = parseFloat(document.getElementById('layer-height').value);
  var filamentDiameterSelect = parseFloat(document.getElementById('filament-diameter').value);
  var customMarginNumber = parseInt(document.getElementById('custom-margin').value);
  var retractionLengthNumber = parseFloat(document.getElementById('retraction-length').value);

  //thermal settings
  var nozzleTempSlicerCheckbox = document.getElementById('nozzle-temp-slicer').checked;
  var nozzleTempSettingNumber = parseInt(document.getElementById('nozzle-temp-settings').value);
  var bedTempSlicerCheckbox = document.getElementById('bed-temp-slicer').checked;
  var bedTempSettingNumber = parseInt(document.getElementById('bed-temp-settings').value);

  //bed alignment
  var g34Checkbox = document.getElementById("g34").checked;
  var enableMeshCheckbox = document.getElementById('enable-mesh').checked;
  var loadMeshCheckbox = document.getElementById('load-mesh').checked;
  var performMeshCheckbox = document.getElementById('perform-mesh').checked;

  //purge
  var purgeLineCheckbox = document.getElementById('purge-line').checked;
  var purgeLineLengthNumber = parseInt(document.getElementById('length-purge-line').value);
  var purgeLineNumber = parseInt(document.getElementById('number-purge-line').value);
  var purgeLineLocationSelect = document.getElementById('purge-location').value;

  var purgeBlobCheckbox = document.getElementById('purge-blob').checked;
  var purgeBlobRelativeSelect = document.getElementById('purge-blob-location-relative').value;
  var purgeBlobAbsoluteSelect = document.getElementById('purge-blob-location-absolute').value;

  //custom message
  var customMessageCheckbox = document.getElementById('custom-message-checkbox').checked;
  var customMessage = document.getElementById('custom-message').value;

  gcode += ";\n";
  gcode += ";This G-code was generated by \n";
  gcode += ";\n\n";

  gcode += ";\n";
  gcode += ";Settings \n";
  gcode += ";\n"

  gcode += "M82; Absolute extrusion mode\n";  
  units ? gcode += "G20 ;imperial values\n" : gcode += "G21 ;metric values\n" // Decides wich units system to use
  gcode += "G90; Absolute positionning mode\n";
  gcode += "M107; Turn fan off\n";

  gcode += "G28 X0 Y0 Z0\n";

  // thermals
  gcode += "\n; Thermals\n\n"
  var bedHeat;
  var nozzleHeat;
  nozzleTempSlicerCheckbox ? nozzleHeat = "S{material_print_temperature_layer_0}" : nozzleHeat = "S" + nozzleTempSettingNumber;
  bedTempSlicerCheckbox ? bedHeat = "S{material_bed_temperature_layer_0}" : bedHeat = "S" + bedTempSettingNumber;

  gcode += "M140 " + bedHeat + " ; Set bed temperature\n";
  gcode += "M104 S150 ; Wait for hotend to reach low temperature\n";
  gcode += "M190 " + bedHeat + " ; Wait for bed temperature\n";
  gcode += "M109" + nozzleHeat + " ; Wait for hotend temperature\n";

  // Bed Prepping
  gcode += "\n; Bed Prepping\n\n"
  g34Checkbox ? gcode += "G34 ; Perform Z-alignment\n" : gcode;

  if (enableMeshCheckbox) {
    if (loadMeshCheckbox) {
      gcode += "M420 S1 ; loads previously saved mesh\n";
    }
    else if (performMeshCheckbox) {
      gcode += "G29 ; Proceeds to do ABL\n"
    }
  }


  
  if (customMessageCheckbox) {
    gcode += "M117 " + customMessage + "; Custom message\n";
  }

  gcode += "\n;\n; End of the Start GCODE\n;"

  return gcode;

}

copyButton.onclick = () => {
  // Retrieve the value you want to copy to clipboard
  try {
    const gcode = generateGCODE();

    // Call the copyToClipboard function
    copyToClipboard(gcode)
      .then(() => {
        console.log('GCODE copied to clipboard successfully');
      })
      .catch(err => {
        console.error('Failed to copy GCODE to clipboard: ', err);
      });
  }
  catch (e) {
    console.log(e);
  }
}