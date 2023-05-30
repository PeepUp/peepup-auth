/* ICC (International Color Consortium) */

import { DateTime } from "./dateTimes";

export interface ICC {
   readonly header: ICCHeaderProperties;
   readonly tagTable: ICCtagTableProperties[];
   readonly description: ICCDescriptionProperties;
   readonly tags: ICCTagsProperties;
}

export type ICCHeaderProperties = {
   size: number;
   cmmId: string;
   version: string;
   deviceClass: string;
   colorSpace: string;
   pcs: string;
   date: DateTime;
   magic: string;
   platform: string;
   flags: number;
};

export type ICCtagTableProperties = {
   signature: string;
   offset: any;
   size: any;
};

export type ICCDescriptionProperties = {
   colorSpace: string;
   pcs: string;
   date: DateTime;
   manufacturer: string;
   model: string;
   attributes: 0;
   renderingIntent: string;
   creator: string;
   id: string;
};

type SpecificspaceColor = readonly [x: number, y: number, z: number];
type XYZColor = { value: SpecificspaceColor };
export type ICCTagsProperties = {
   wtpt: XYZColor;
   bkpt: XYZColor;
   rXYZ: XYZColor;
   gXYZ: XYZColor;
   bXYZ: XYZColor;
   rTRC: XYZColor;
   gTRC: XYZColor;
   bTRC: XYZColor;
   cprt: string;
};

/*  
*  header: {
    size: 128,
    cmmId: 'Lino',
    version: 2.4,
    deviceClass: 'mntr',
    colorSpace: 'RGB ',
    pcs: 'XYZ ',
    date: '2023-04-08T12:34:56.000Z',
    magic: 'acsp',
    platform: 'APPL',
    flags: 0
  },
  tagTable: [
    { signature: 'desc', offset: 0x00000000, size: 0x0000029C },
    { signature: 'wtpt', offset: 0x0000029C, size: 0x0000000C },
    { signature: 'bkpt', offset: 0x000002A8, size: 0x0000000C },
    { signature: 'rXYZ', offset: 0x000002B4, size: 0x00000018 },
    { signature: 'gXYZ', offset: 0x000002CC, size: 0x00000018 },
    { signature: 'bXYZ', offset: 0x000002E4, size: 0x00000018 },
    { signature: 'rTRC', offset: 0x000002FC, size: 0x00000084 },
    { signature: 'gTRC', offset: 0x00000380, size: 0x00000084 },
    { signature: 'bTRC', offset: 0x00000304, size: 0x00000084 },
    { signature: 'cprt', offset: 0x00000388, size: 0x0000002A }
  ],
  description: {
    colorSpace: 'RGB ',
    pcs: 'XYZ ',
    date: '2023-04-08T12:34:56.000Z',
    manufacturer: 'Unknown',
    model: 'Unknown',
    attributes: 0,
    renderingIntent: 'Perceptual',
    creator: 'Adobe',
    id: 'none'
  },
  tags: {
    wtpt: { x: 0.3127, y: 0.329, z: 0.3583 },
    bkpt: { x: 0, y: 0, z: 0 },
    rXYZ: { x: 0.64, y: 0.33, z: 0.03 },
    gXYZ: { x: 0.3, y: 0.6, z: 0.1 },
    bXYZ: { x: 0.15, y: 0.06, z: 0.79 },
    rTRC: [ red tone curve values  ],
    gTRC: [  green tone curve values  ],
    bTRC: [  blue tone curve values  ],
    cprt: 'Unknown'
  } */

/* async function getICCProfile(file) {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  return new Promise((resolve, reject) => {
    reader.onloadend = () => {
      const dataView = new DataView(reader.result);
      if (dataView.getUint16(0, false) !== 0xFFD8) {
        reject(new Error("Not a valid JPEG image"));
        return;
      }
      let offset = 2;
      while (offset < dataView.byteLength) {
        const marker = dataView.getUint16(offset, false);
        offset += 2;
        if (marker === 0xFFE2) { // APP2 marker for ICC profile
          const length = dataView.getUint16(offset, false);
          offset += 2;
          const iccData = new Uint8Array(dataView.buffer, offset, length - 2);
          const iccProfile = colorConvert.IccProfile.fromBuffer(iccData);
          resolve(iccProfile);
          return;
        } else {
          offset += dataView.getUint16(offset, false);
        }
      }
      reject(new Error("No ICC profile found"));
    };
    reader.onerror = () => {
      reject(reader.error);
    };
  });
} */
