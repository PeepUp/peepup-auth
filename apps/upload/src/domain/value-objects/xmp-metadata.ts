import { DateTime } from "./dateTimes";
import { FlashProperties, LensProperties } from "./exif-metadata";

export interface XMP {
   readonly toolkit: string;
   readonly creatorWorkUrl: string;
   readonly imageNumber: number;
   readonly lens: LensProperties;
   readonly creator: string;
   readonly apertureValue: number;
   readonly fNumber: number;
   readonly flash: FlashProperties;
   readonly timeOfGPS: DateTime;
   readonly legacyIPTCDigest: string;
   readonly transmissionReference: string;
   readonly creatorTool: string;
   readonly label: string;
   readonly modifyDate: DateTime;
   readonly hasMarked: boolean;
}

/* 
const imageContents = ...; // the image file contents

// Parse the contents of the image file as an XML document
const parser = new DOMParser();
const xmlDoc = parser.parseFromString(imageContents, "application/xml");

// Extract the XMP metadata from the XML document
const xmpNodes = xmlDoc.getElementsByTagNameNS("adobe:ns:meta/", "xmpmeta");
if (xmpNodes.length > 0) {
  const xmpMetadata = xmpNodes[0].getElementsByTagNameNS("adobe:ns:meta/", "xmp")[0].textContent;
  console.log(xmpMetadata);
} else {
  console.log("No XMP metadata found in the image file.");
} */

/* <?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.4-c005 78.147326, 2012/08/23-13:03:03        ">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about="" xmlns:xmp="http://ns.adobe.com/xap/1.0/">
      <xmp:CreatorTool>Adobe Photoshop CC 2019 (Windows)</xmp:CreatorTool>
      <xmp:CreateDate>2021-03-27T15:37:18-07:00</xmp:CreateDate>
      <xmp:ModifyDate>2021-03-27T15:38:04-07:00</xmp:ModifyDate>
      <xmp:MetadataDate>2021-03-27T15:38:04-07:00</xmp:MetadataDate>
      <xmp:Rating>0</xmp:Rating>
    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?> */

// parse to JSON
// Read the contents of the image file
/* const imageContents = ...; // the image file contents

// Parse the contents of the image file as an XML document
const parser = new DOMParser();
const xmlDoc = parser.parseFromString(imageContents, "application/xml");

// Convert the XML document to a JavaScript object
function xmlToJson(xml) {
  // Create the return object
  const obj = {};

  if (xml.nodeType === 1) { // element
    // do attributes
    if (xml.attributes.length > 0) {
      obj["@attributes"] = {};
      for (let j = 0; j < xml.attributes.length; j++) {
        const attribute = xml.attributes.item(j);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType === 3) { // text
    obj = xml.nodeValue.trim();
  }

  // do children
  if (xml.hasChildNodes()) {
    for(let i = 0; i < xml.childNodes.length; i++) {
      const item = xml.childNodes.item(i);
      const nodeName = item.nodeName;
      if (typeof(obj[nodeName]) === "undefined") {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof(obj[nodeName].push) === "undefined") {
          const old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
}

// Convert the XML object to a JavaScript object
const xmpObj = xmlToJson(xmlDoc);

// Convert the JavaScript object to JSON format
const xmpJson = JSON.stringify(xmpObj);
console.log(xmpJson);
 */

/* {
  "rdf:RDF": {
    "@attributes": {
      "xmlns:rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      "xmlns:dc": "http://purl.org/dc/elements/1.1/",
      "xmlns:xmp": "http://ns.adobe.com/xap/1.0/",
      "xmlns:xmpMM": "http://ns.adobe.com/xap/1.0/mm/",
      "xmlns:exif": "http://ns.adobe.com/exif/1.0/",
      "xmlns:photoshop": "http://ns.adobe.com/photoshop/1.0/",
      "xmlns:iptc": "http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/",
      "xmlns:xmpRights": "http://ns.adobe.com/xap/1.0/rights/",
      "xmlns:aux": "http://ns.adobe.com/exif/1.0/aux/"
    },
    "rdf:Description": {
      "@attributes": {
        "rdf:about": ""
      },
      "dc:title": {
        "#text": "Example Title"
      },
      "dc:description": {
        "#text": "Example Description"
      },
      "dc:creator": {
        "#text": "John Smith"
      },
      "dc:date": {
        "#text": "2023-04-08T12:00:00Z"
      },
      "xmp:Rating": {
        "#text": "3"
      },
      "xmpMM:Rating": {
        "#text": "2"
      },
      "exif:Make": {
        "#text": "Canon"
      },
      "exif:Model": {
        "#text": "Canon EOS 5D Mark IV"
      },
      "exif:ExposureTime": {
        "#text": "1/125"
      },
      "exif:FNumber": {
        "#text": "8"
      },
      "exif:ISO": {
        "#text": "200"
      },
      "exif:FocalLength": {
        "#text": "50 mm"
      },
      "photoshop:ColorMode": {
        "#text": "RGB"
      },
      "iptc:Keywords": [
        {
          "#text": "example",
          "@attributes": {
            "iptc:Qualifier": "red"
          }
        },
        {
          "#text": "sample",
          "@attributes": {
            "iptc:Qualifier": "green"
          }
        },
        {
          "#text": "test",
          "@attributes": {
            "iptc:Qualifier": "blue"
          }
        }
      ]
    }
  }
} */
