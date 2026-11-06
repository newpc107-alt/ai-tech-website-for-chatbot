import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const EDITIONS_DIR = path.resolve('public/images/editions');
if (!fs.existsSync(EDITIONS_DIR)) {
  fs.mkdirSync(EDITIONS_DIR, { recursive: true });
}

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h, s, v];
}

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  let r = 0, g = 0, b = 0;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function processImage(inputJpg: string, outputJpg: string, transform: string) {
  const dimStr = execSync(`identify -format "%w %h" "${inputJpg}"`).toString().trim().split(' ');
  const w = parseInt(dimStr[0], 10);
  const h = parseInt(dimStr[1], 10);

  const rawIn = `/tmp/raw_${Math.random().toString(36).substring(2)}_in.rgba`;
  const rawOut = `/tmp/raw_${Math.random().toString(36).substring(2)}_out.rgba`;

  execSync(`convert "${inputJpg}" -depth 8 "${rawIn}"`);
  const buf = fs.readFileSync(rawIn);

  for (let i = 0; i < buf.length; i += 4) {
    const r = buf[i];
    const g = buf[i+1];
    const b = buf[i+2];

    const isLightBg = (r > 228 && g > 228 && b > 228 && Math.abs(r - g) < 18 && Math.abs(r - b) < 18);
    if (isLightBg) continue;

    let [hue, sat, val] = rgbToHsv(r, g, b);

    switch (transform) {
      case 'silver_titanium':
      case 'space_silver':
      case 'silver_gray':
      case 'steel_silver':
      case 'silver_ring':
        if (sat > 0.08) sat *= 0.12;
        val = Math.min(1.0, val * 1.18);
        break;

      case 'onyx_black':
      case 'stealth_slate':
      case 'stealth_black':
      case 'carbon_black':
      case 'space_obsidian':
      case 'obsidian_slate':
      case 'space_black':
      case 'black_ring':
        if (sat > 0.08) sat *= 0.2;
        val = Math.max(0.04, val * 0.52);
        break;

      case 'charcoal':
      case 'matte_slate':
      case 'gunmetal_gray':
      case 'space_gray':
      case 'dark_titanium':
      case 'matte_raw_carbon':
        if (sat > 0.08) sat *= 0.2;
        val = Math.max(0.08, val * 0.72);
        break;

      case 'blue_accent':
      case 'smoked_blue':
      case 'matte_blue':
      case 'cobalt_blue_accent':
      case 'azure_blue':
        if (val > 0.15 && val < 0.95) {
          hue = 0.58;
          sat = Math.min(1.0, Math.max(0.4, sat * 1.4));
        }
        break;

      case 'navy_braided':
      case 'midnight_armor':
      case 'midnight_slate':
        if (sat > 0.08 || b > r + 10) {
          hue = 0.60;
          sat = Math.min(1.0, Math.max(0.45, sat * 1.5));
          val = Math.max(0.08, val * 0.65);
        }
        break;

      case 'glacier_white':
      case 'cloud_white':
      case 'alpine_white':
        sat *= 0.12;
        val = Math.min(1.0, val * 1.25);
        break;

      case 'mint_slate':
        if (sat > 0.08) {
          hue = 0.44;
          sat = Math.min(0.7, sat * 1.1);
        }
        break;

      case 'deep_desert':
        if (sat > 0.05 || val < 0.92) {
          hue = 0.11;
          sat = Math.min(0.65, Math.max(0.28, sat * 1.2));
          val = Math.min(1.0, val * 1.05);
        }
        break;

      case 'natural_titanium':
        if (sat > 0.08) sat *= 0.2;
        val = Math.min(1.0, val * 1.05);
        break;

      case 'matte_anti_glare':
      case 'privacy_shield':
        sat *= 0.15;
        val = Math.max(0.12, val * 0.78);
        break;

      case 'dashboard_mount':
        sat *= 0.2;
        val = Math.max(0.1, val * 0.85);
        break;
    }

    const [nr, ng, nb] = hsvToRgb(hue, sat, val);
    buf[i] = nr;
    buf[i+1] = ng;
    buf[i+2] = nb;
  }

  fs.writeFileSync(rawOut, buf);
  execSync(`convert -size ${w}x${h} -depth 8 "${rawOut}" -quality 95 "${outputJpg}"`);

  if (fs.existsSync(rawIn)) fs.unlinkSync(rawIn);
  if (fs.existsSync(rawOut)) fs.unlinkSync(rawOut);
}

// Config table for all 31 products
const PRODUCTS_EDITIONS_CONFIG = [
  {
    code: '01',
    base: 'public/images/product_earbuds_pro_studio_1793216309274.jpg',
    editions: [
      { name: 'Ice Blue', file: 'p01_ice_blue.jpg', transform: null },
      { name: 'Silver Titanium', file: 'p01_silver_titanium.jpg', transform: 'silver_titanium' },
      { name: 'Onyx Black', file: 'p01_onyx_black.jpg', transform: 'onyx_black' },
    ]
  },
  {
    code: '02',
    base: 'public/images/airpods_pro_white_case_1793219800813.jpg',
    editions: [
      { name: 'Pure White & Titanium', file: 'p02_pure_white.jpg', transform: null },
      { name: 'Space Silver', file: 'p02_space_silver.jpg', transform: 'space_silver' },
      { name: 'Stealth Slate', file: 'p02_stealth_slate.jpg', transform: 'stealth_slate' },
    ]
  },
  {
    code: '03',
    base: 'public/images/headphones_overear_studio_1793218339958.jpg',
    editions: [
      { name: 'Silver & White Leather', file: 'p03_silver_white.jpg', transform: null },
      { name: 'Space Silver', file: 'p03_space_silver.jpg', transform: 'space_silver' },
      { name: 'Cobalt Blue Accent', file: 'p03_cobalt_blue.jpg', transform: 'blue_accent' },
    ]
  },
  {
    code: '04',
    base: 'public/images/earbud_tuning_silicone_tips_1793219800973.jpg',
    editions: [
      { name: 'Pure White', file: 'p04_pure_white.jpg', transform: null },
      { name: 'Smoked Blue', file: 'p04_smoked_blue.jpg', transform: 'smoked_blue' },
      { name: 'Charcoal', file: 'p04_charcoal.jpg', transform: 'charcoal' },
    ]
  },
  {
    code: '05',
    base: 'public/images/carbon_fiber_airpods_case_1793219801737.jpg',
    editions: [
      { name: 'Classic Twill Weave', file: 'p05_classic_twill.jpg', transform: null },
      { name: 'Matte Blue Weave', file: 'p05_matte_blue.jpg', transform: 'matte_blue' },
    ]
  },
  {
    code: '06',
    base: 'public/images/product_gan_charger_desktop_1793216309952.jpg',
    editions: [
      { name: 'Silver Aluminum', file: 'p06_silver_aluminum.jpg', transform: null },
      { name: 'Space Titanium', file: 'p06_space_titanium.jpg', transform: 'charcoal' },
    ]
  },
  {
    code: '07',
    base: 'public/images/charger_magsafe_3in1_dock_1793218340897.jpg',
    editions: [
      { name: 'Pure White & Chrome', file: 'p07_pure_white.jpg', transform: null },
      { name: 'Silver Aluminum', file: 'p07_silver_aluminum.jpg', transform: 'silver_titanium' },
    ]
  },
  {
    code: '08',
    base: 'public/images/powerbank_digital_display_1793218340448.jpg',
    editions: [
      { name: 'Digital Titanium OLED', file: 'p08_digital_titanium.jpg', transform: null },
      { name: 'Stealth Graphite', file: 'p08_stealth_graphite.jpg', transform: 'charcoal' },
    ]
  },
  {
    code: '09',
    base: 'public/images/charger_65w_gan_travel_1793219802504.jpg',
    editions: [
      { name: 'Pure White', file: 'p09_pure_white.jpg', transform: null },
      { name: 'Sky Blue', file: 'p09_sky_blue.jpg', transform: 'blue_accent' },
      { name: 'Matte Black', file: 'p09_matte_black.jpg', transform: 'stealth_black' },
    ]
  },
  {
    code: '10',
    base: 'public/images/charger_45w_slim_puck_1793219802723.jpg',
    editions: [
      { name: 'Glacier White', file: 'p10_glacier_white.jpg', transform: null },
      { name: 'Cobalt Blue Accent', file: 'p10_cobalt_blue.jpg', transform: 'blue_accent' },
    ]
  },
  {
    code: '11',
    base: 'public/images/charger_car_vent_mount_1793219803944.jpg',
    editions: [
      { name: 'Air Vent Twist-Lock', file: 'p11_vent_lock.jpg', transform: null },
      { name: 'Suction Dashboard Base', file: 'p11_dashboard_base.jpg', transform: 'dashboard_mount' },
    ]
  },
  {
    code: '12',
    base: 'public/images/product_braided_cables_dock_1793216310339.jpg',
    editions: [
      { name: 'Silver Braided Weave', file: 'p12_silver_braided.jpg', transform: null },
      { name: 'Cobalt Blue Accent', file: 'p12_cobalt_blue.jpg', transform: 'blue_accent' },
    ]
  },
  {
    code: '13',
    base: 'public/images/braided_usbc_cable_blue_1793219803382.jpg',
    editions: [
      { name: 'Electric Blue Weave', file: 'p13_electric_blue.jpg', transform: null },
      { name: 'Silver Gray', file: 'p13_silver_gray.jpg', transform: 'silver_gray' },
      { name: 'Navy Braided', file: 'p13_navy_braided.jpg', transform: 'navy_braided' },
    ]
  },
  {
    code: '14',
    base: 'public/images/gaming_right_angle_cable_1793219803719.jpg',
    editions: [
      { name: 'Azure Blue', file: 'p14_azure_blue.jpg', transform: null },
      { name: 'Stealth Black', file: 'p14_stealth_black.jpg', transform: 'stealth_black' },
    ]
  },
  {
    code: '15',
    base: 'public/images/silicone_lightning_cable_1793219804524.jpg',
    editions: [
      { name: 'Sky Blue', file: 'p15_sky_blue.jpg', transform: null },
      { name: 'Cloud White', file: 'p15_cloud_white.jpg', transform: 'cloud_white' },
      { name: 'Mint Slate', file: 'p15_mint_slate.jpg', transform: 'mint_slate' },
    ]
  },
  {
    code: '16',
    base: 'public/images/universal_4in1_cable_real_1793219825113.jpg',
    editions: [
      { name: 'Silver & Blue Accent', file: 'p16_silver_blue.jpg', transform: null },
      { name: 'Matte Slate', file: 'p16_matte_slate.jpg', transform: 'matte_slate' },
    ]
  },
  {
    code: '17',
    base: 'public/images/hdmi_8k_braided_cable_real_1793219825403.jpg',
    editions: [
      { name: 'Space Gray Braided', file: 'p17_space_gray.jpg', transform: null },
      { name: 'Midnight Blue Armor', file: 'p17_midnight_blue.jpg', transform: 'midnight_armor' },
    ]
  },
  {
    code: '18',
    base: 'public/images/usba_to_usbc_10gbps_cable_real_1793219826343.jpg',
    editions: [
      { name: 'Carbon Black', file: 'p18_carbon_black.jpg', transform: null },
      { name: 'Steel Silver', file: 'p18_steel_silver.jpg', transform: 'steel_silver' },
    ]
  },
  {
    code: '19',
    base: 'public/images/phone_case_aramid_carbon_real_1793219826925.jpg',
    editions: [
      { name: 'Classic Twill Weave', file: 'p19_classic_twill.jpg', transform: null },
      { name: 'Matte Raw Carbon', file: 'p19_raw_carbon.jpg', transform: 'matte_raw_carbon' },
    ]
  },
  {
    code: '20',
    base: 'public/images/rugged_armor_case_1793219909912.jpg',
    editions: [
      { name: 'Tactical Blue & Slate', file: 'p20_tactical_blue.jpg', transform: null },
      { name: 'Gunmetal Gray', file: 'p20_gunmetal_gray.jpg', transform: 'gunmetal_gray' },
      { name: 'Alpine White', file: 'p20_alpine_white.jpg', transform: 'alpine_white' },
    ]
  },
  {
    code: '21',
    base: 'public/images/frost_translucent_case_1793219911284.jpg',
    editions: [
      { name: 'Azure Blue Ring', file: 'p21_azure_blue_ring.jpg', transform: null },
      { name: 'Silver Ring', file: 'p21_silver_ring.jpg', transform: 'silver_ring' },
      { name: 'Black Ring', file: 'p21_black_ring.jpg', transform: 'black_ring' },
    ]
  },
  {
    code: '22',
    base: 'public/images/glass_screen_protector_1793219911344.jpg',
    editions: [
      { name: 'HD Ultra Clear', file: 'p22_hd_clear.jpg', transform: null },
      { name: 'Matte Anti-Glare Gaming', file: 'p22_matte_antiglare.jpg', transform: 'matte_anti_glare' },
      { name: '28° Privacy Shield', file: 'p22_privacy_shield.jpg', transform: 'privacy_shield' },
    ]
  },
  {
    code: '23',
    base: 'public/images/camera_lens_rings_1793219912059.jpg',
    editions: [
      { name: 'Ice Blue Titanium', file: 'p23_ice_blue_titanium.jpg', transform: null },
      { name: 'Natural Titanium', file: 'p23_natural_titanium.jpg', transform: 'natural_titanium' },
      { name: 'Space Black', file: 'p23_space_black.jpg', transform: 'space_black' },
    ]
  },
  {
    code: '24',
    base: 'public/images/aluminum_magsafe_stand_real_1793219826893.jpg',
    editions: [
      { name: 'Pure Silver Bead-Blasted', file: 'p24_pure_silver.jpg', transform: null },
      { name: 'Space Gray Anodized', file: 'p24_space_gray.jpg', transform: 'space_gray' },
    ]
  },
  {
    code: '25',
    base: 'public/images/thunderbolt_hub_dock_1793219911439.jpg',
    editions: [
      { name: 'Silver Aluminum', file: 'p25_silver_aluminum.jpg', transform: null },
      { name: 'Dark Titanium', file: 'p25_dark_titanium.jpg', transform: 'dark_titanium' },
    ]
  },
  {
    code: '26',
    base: 'public/images/laptop_riser_stand_1793219926609.jpg',
    editions: [
      { name: 'Pure Silver', file: 'p26_pure_silver.jpg', transform: null },
      { name: 'Space Gray', file: 'p26_space_gray.jpg', transform: 'space_gray' },
    ]
  },
  {
    code: '27',
    base: 'public/images/magnetic_cable_blocks_1793219927656.jpg',
    editions: [
      { name: 'Sky Blue & White', file: 'p27_sky_blue.jpg', transform: null },
      { name: 'Brushed Titanium Silver', file: 'p27_brushed_titanium.jpg', transform: 'silver_titanium' },
    ]
  },
  {
    code: '28',
    base: 'public/images/product_smartphone_flagship_1793216309456.jpg',
    editions: [
      { name: 'Natural Titanium', file: 'p28_natural_titanium.jpg', transform: null },
      { name: 'Space Obsidian', file: 'p28_space_obsidian.jpg', transform: 'space_obsidian' },
      { name: 'Deep Desert', file: 'p28_deep_desert.jpg', transform: 'deep_desert' },
    ]
  },
  {
    code: '29',
    base: 'public/images/foldable_phone_real_1793220658419.jpg',
    editions: [
      { name: 'Titanium Silver', file: 'p29_titanium_silver.jpg', transform: null },
      { name: 'Carbon Black', file: 'p29_carbon_black.jpg', transform: 'carbon_black' },
    ]
  },
  {
    code: '30',
    base: 'public/images/phone_compact_minimal_1793218338599.jpg',
    editions: [
      { name: 'Ice Blue', file: 'p30_ice_blue.jpg', transform: null },
      { name: 'Glacier White', file: 'p30_glacier_white.jpg', transform: 'glacier_white' },
      { name: 'Midnight Slate', file: 'p30_midnight_slate.jpg', transform: 'midnight_slate' },
    ]
  },
  {
    code: '31',
    base: 'public/images/phone_cinema_edition_1793219955586.jpg',
    editions: [
      { name: 'Cinema Matte Titanium', file: 'p31_cinema_titanium.jpg', transform: null },
      { name: 'Obsidian Slate', file: 'p31_obsidian_slate.jpg', transform: 'obsidian_slate' },
    ]
  },
];

console.log("Starting generation of all 31 product edition images...");

for (const prod of PRODUCTS_EDITIONS_CONFIG) {
  console.log(`Processing Product #${prod.code}...`);
  for (const ed of prod.editions) {
    const outPath = path.join(EDITIONS_DIR, ed.file);
    if (ed.transform === null) {
      // Base edition: copy or symlink
      fs.copyFileSync(prod.base, outPath);
      console.log(`  [BASE] ${ed.name} -> ${ed.file}`);
    } else {
      processImage(prod.base, outPath, ed.transform);
      console.log(`  [RECOLOR] ${ed.name} -> ${ed.file} (${ed.transform})`);
    }
  }
}

console.log("All edition images generated successfully!");
